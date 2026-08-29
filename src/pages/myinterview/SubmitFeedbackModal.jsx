import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getRecommendationOptions,
} from "../../lib/api/myinterviewApi";

const RATING_OPTIONS = [
  {
    value: 1,
    label: "1 — Poor",
  },
  {
    value: 2,
    label: "2 — Below Average",
  },
  {
    value: 3,
    label: "3 — Average",
  },
  {
    value: 4,
    label: "4 — Good",
  },
  {
    value: 5,
    label: "5 — Excellent",
  },
];

const FALLBACK_RECOMMENDATION_OPTIONS = [
  {
    value: "Strong Hire",
    label: "Strong Hire",
  },
  {
    value: "Hire",
    label: "Hire",
  },
  {
    value: "No Hire",
    label: "No Hire",
  },
  {
    value: "Strong No Hire",
    label: "Strong No Hire",
  },
];

function SubmitFeedbackModal({
  isOpen,
  interview,
  onClose,
  onSubmit,
}) {
  /*
   * IMPORTANT:
   * Form values are initialized from the interview.
   *
   * The parent should render this component with:
   *
   * key={interview?._id}
   *
   * This makes React create a fresh modal state
   * whenever a different interview is selected.
   */

  const existingFeedback =
    interview?.feedback;

  const [overallRating, setOverallRating] =
    useState(
      existingFeedback?.overallRating || 3
    );

  const [recommendation, setRecommendation] =
    useState(
      existingFeedback?.recommendation || ""
    );

  const [
    recommendationOptions,
    setRecommendationOptions,
  ] = useState(
    FALLBACK_RECOMMENDATION_OPTIONS
  );

  const [
    technicalStrengths,
    setTechnicalStrengths,
  ] = useState(
    existingFeedback?.technicalStrengths || ""
  );

  const [concerns, setConcerns] =
    useState(
      existingFeedback?.concerns || ""
    );

  const [loadingOptions, setLoadingOptions] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  // =====================================================
  // LOAD RECOMMENDATION OPTIONS
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    const loadRecommendations =
      async () => {
        try {
          setLoadingOptions(true);

          const response =
            await getRecommendationOptions();

          const options =
            response?.data?.data || [];

          if (cancelled) {
            return;
          }

          if (
            Array.isArray(options) &&
            options.length > 0
          ) {
            setRecommendationOptions(
              options
            );

            /*
             * Only set default recommendation
             * if there is no existing feedback.
             */
            if (
              !existingFeedback?.recommendation
            ) {
              setRecommendation(
                options[0]?.value || ""
              );
            }
          } else {
            setRecommendationOptions(
              FALLBACK_RECOMMENDATION_OPTIONS
            );

            if (
              !existingFeedback?.recommendation
            ) {
              setRecommendation(
                "Strong Hire"
              );
            }
          }
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "GET RECOMMENDATION OPTIONS ERROR:",
            error?.response?.data ||
              error
          );

          setRecommendationOptions(
            FALLBACK_RECOMMENDATION_OPTIONS
          );

          if (
            !existingFeedback?.recommendation
          ) {
            setRecommendation(
              "Strong Hire"
            );
          }
        } finally {
          if (!cancelled) {
            setLoadingOptions(false);
          }
        }
      };

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    existingFeedback?.recommendation,
  ]);

  // =====================================================
  // HIDE MODAL
  // =====================================================

  if (!isOpen || !interview) {
    return null;
  }

  const candidate =
    interview?.candidateId;

  const hasExistingFeedback =
    Boolean(
      interview?.feedback?.submittedAt
    );

  // =====================================================
  // SUBMIT FEEDBACK
  // =====================================================

  const handleSubmit = async () => {
    if (!recommendation) {
      toast.error(
        "Please select a recommendation."
      );
      return;
    }

    if (
      !overallRating ||
      overallRating < 1 ||
      overallRating > 5
    ) {
      toast.error(
        "Please select a valid rating."
      );
      return;
    }

    try {
      setSubmitting(true);

      const interviewId =
        interview?._id ||
        interview?.id;

      if (!interviewId) {
        toast.error(
          "Interview ID not found."
        );
        return;
      }

      await onSubmit(
        interviewId,
        {
          overallRating:
            Number(overallRating),

          recommendation,

          technicalStrengths,

          concerns,
        }
      );

      toast.success(
        "Feedback submitted successfully."
      );

      onClose();
    } catch (error) {
      console.error(
        "SUBMIT FEEDBACK ERROR:",
        error?.response?.data ||
          error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {hasExistingFeedback
                ? "View Feedback"
                : "Submit Feedback"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {candidate?.name ||
                "Unknown Candidate"}

              {candidate?.role &&
                ` · ${candidate.role}`}

              {candidate?.stage &&
                ` · ${candidate.stage}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <div className="mt-5 space-y-4">

          {/* =============================================== */}
          {/* OVERALL RATING */}
          {/* =============================================== */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Overall Rating
            </label>

            <select
              value={overallRating}
              onChange={(e) =>
                setOverallRating(
                  Number(
                    e.target.value
                  )
                )
              }
              disabled={
                hasExistingFeedback ||
                submitting
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            >
              {RATING_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* =============================================== */}
          {/* RECOMMENDATION */}
          {/* =============================================== */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Recommendation
            </label>

            <select
              value={recommendation}
              onChange={(e) =>
                setRecommendation(
                  e.target.value
                )
              }
              disabled={
                loadingOptions ||
                hasExistingFeedback ||
                submitting
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            >
              {loadingOptions ? (
                <option value="">
                  Loading...
                </option>
              ) : (
                recommendationOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )
              )}
            </select>
          </div>

          {/* =============================================== */}
          {/* TECHNICAL STRENGTHS */}
          {/* =============================================== */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Technical Strengths
            </label>

            <textarea
              value={
                technicalStrengths
              }
              onChange={(e) =>
                setTechnicalStrengths(
                  e.target.value
                )
              }
              disabled={
                hasExistingFeedback ||
                submitting
              }
              placeholder="What did the candidate do well?"
              rows={3}
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          {/* =============================================== */}
          {/* CONCERNS */}
          {/* =============================================== */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Concerns / Gaps
            </label>

            <textarea
              value={concerns}
              onChange={(e) =>
                setConcerns(
                  e.target.value
                )
              }
              disabled={
                hasExistingFeedback ||
                submitting
              }
              placeholder="Any red flags or areas of concern?"
              rows={3}
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Close
          </button>

          {!hasExistingFeedback && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitting ||
                loadingOptions
              }
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Feedback"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubmitFeedbackModal;