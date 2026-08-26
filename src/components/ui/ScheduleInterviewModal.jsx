import { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";

import { getUsersLookup } from "../../lib/api/lookupApi";
import { fetchAllCandidates } from "../../lib/api/candidateApi";

// =====================================================
// INITIAL FORM
// =====================================================

const INITIAL_FORM = {
  candidateId: "",
  round: "Technical",
  mode: "Video Call",
  date: "",
  time: "",
  duration: "",
  interviewerId: "",
  location: "",
  notes: "",
};

// =====================================================
// LOCAL DATE
// IMPORTANT:
// Do NOT use toISOString() for input date.
// It can move date one day backward because of UTC.
// =====================================================

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// NORMALIZE DATE FROM API
// =====================================================

const getInputDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  // YYYY-MM-DD
  if (
    typeof dateValue === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      dateValue
    )
  ) {
    return dateValue;
  }

  // ISO date
  if (
    typeof dateValue === "string" &&
    dateValue.includes("T")
  ) {
    // Take the date portion directly.
    // Do NOT convert to UTC.
    return dateValue.split("T")[0];
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return getLocalDateString(date);
};

// =====================================================
// FORM REDUCER
// =====================================================

function formReducer(form, action) {
  switch (action.type) {
    case "reset":
      return {
        ...INITIAL_FORM,
      };

    case "update":
      return {
        ...form,
        [action.field]: action.value,
      };

    case "setForm":
      return {
        ...INITIAL_FORM,
        ...action.value,
      };

    default:
      return form;
  }
}

// =====================================================
// COMPONENT
// =====================================================

function ScheduleInterviewModal({
  isOpen,
  candidate,
  onClose,
  onSubmit,
  onCancelInterview,
  mode = "schedule",
  interview = null,
}) {
  const [
    form,
    dispatchForm,
  ] = useReducer(
    formReducer,
    INITIAL_FORM
  );

  const [
    candidates,
    setCandidates,
  ] = useState([]);

  const [
    interviewers,
    setInterviewers,
  ] = useState([]);

  const [
    loadingCandidates,
    setLoadingCandidates,
  ] = useState(false);

  const [
    loadingInterviewers,
    setLoadingInterviewers,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const isReschedule =
    mode === "reschedule";

  // =====================================================
  // ACTIVE CANDIDATE
  // =====================================================

  const activeCandidate =
    candidate ||
    interview?.candidateId ||
    null;

  // =====================================================
  // LOAD CANDIDATES
  // Only candidates who can reasonably be scheduled:
  //
  // Applied
  // Screening
  // Shortlisted
  //
  // Exclude:
  // Interview
  // Offer Sent
  // Hired
  // Rejected
  // =====================================================

  useEffect(() => {
    if (!isOpen || isReschedule) {
      return;
    }

    const loadCandidates = async () => {
      try {
        setLoadingCandidates(true);

        const response =
          await fetchAllCandidates();

        const candidateData =
          response?.data?.data ||
          response?.data?.candidates ||
          response?.data ||
          [];

        const allCandidates =
          Array.isArray(candidateData)
            ? candidateData
            : [];

        const eligibleCandidates =
          allCandidates.filter(
            (item) => {
              const stage =
                item?.stage;

              return [
                "Applied",
                "Screening",
                "Shortlisted",
              ].includes(stage);
            }
          );

        setCandidates(
          eligibleCandidates
        );
      } catch (error) {
        console.error(
          "GET CANDIDATES ERROR:",
          error?.response?.data ||
            error
        );

        setCandidates([]);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load candidates."
        );
      } finally {
        setLoadingCandidates(false);
      }
    };

    loadCandidates();
  }, [isOpen, isReschedule]);

  // =====================================================
  // LOAD INTERVIEWERS
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadInterviewers =
      async () => {
        try {
          setLoadingInterviewers(
            true
          );

          const response =
            await getUsersLookup(
              "Interviewer"
            );

          const users =
            response?.data?.data ||
            response?.data?.users ||
            response?.data ||
            [];

          const normalizedUsers =
            Array.isArray(users)
              ? users.map(
                  (user) => ({
                    ...user,

                    id:
                      user?.id ||
                      user?._id,

                    _id:
                      user?._id ||
                      user?.id,

                    name:
                      user?.name ||
                      user?.fullName ||
                      user?.username ||
                      "Unknown User",
                  })
                )
              : [];

          setInterviewers(
            normalizedUsers
          );
        } catch (error) {
          console.error(
            "GET INTERVIEWERS ERROR:",
            error?.response?.data ||
              error
          );

          setInterviewers([]);

          toast.error(
            error?.response?.data?.message ||
              "Failed to load interviewers."
          );
        } finally {
          setLoadingInterviewers(
            false
          );
        }
      };

    loadInterviewers();
  }, [isOpen]);

  // =====================================================
  // RESET / LOAD FORM
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // ===================================================
    // RESCHEDULE
    // ===================================================

    if (
      isReschedule &&
      interview
    ) {
      const interviewerId =
        typeof interview.interviewerId ===
        "object"
          ? interview.interviewerId?._id ||
            interview.interviewerId?.id
          : interview.interviewerId;

      const interviewCandidate =
        interview.candidateId;

      const candidateId =
        typeof interviewCandidate ===
        "object"
          ? interviewCandidate?._id ||
            interviewCandidate?.id
          : interviewCandidate;

      dispatchForm({
        type: "setForm",

        value: {
          candidateId:
            candidateId || "",

          round:
            interview.round ||
            "Technical",

          mode:
            interview.mode ||
            "Video Call",

          date:
            getInputDate(
              interview.date
            ),

          time:
            interview.time || "",

          duration:
            interview.duration
              ? String(
                  interview.duration
                )
              : "",

          interviewerId:
            interviewerId || "",

          location:
            interview.location || "",

          notes:
            interview.notes || "",
        },
      });

      return;
    }

    // ===================================================
    // NORMAL SCHEDULE
    // ===================================================

    dispatchForm({
      type: "setForm",

      value: {
        ...INITIAL_FORM,

        candidateId:
          activeCandidate?._id ||
          activeCandidate?.id ||
          activeCandidate?.candidateId ||
          "",
      },
    });
  }, [
    isOpen,
    candidate,
    isReschedule,
    interview,
  ]);

  // =====================================================
  // UPDATE FORM
  // =====================================================

  const update = (
    field,
    value
  ) => {
    dispatchForm({
      type: "update",
      field,
      value,
    });
  };

  // =====================================================
  // SELECTED CANDIDATE
  // =====================================================

  const selectedCandidate =
    candidates.find(
      (item) =>
        String(
          item?._id ||
            item?.id
        ) ===
        String(form.candidateId)
    ) ||
    activeCandidate;

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async () => {
      const candidateId =
        form.candidateId ||
        activeCandidate?._id ||
        activeCandidate?.id ||
        activeCandidate?.candidateId;

      // -------------------------------------------------
      // CANDIDATE
      // -------------------------------------------------

      if (!candidateId) {
        toast.error(
          "Please select a candidate."
        );
        return;
      }

      // -------------------------------------------------
      // DATE
      // -------------------------------------------------

      if (!form.date) {
        toast.error(
          "Please select interview date."
        );
        return;
      }

      // -------------------------------------------------
      // TIME
      // -------------------------------------------------

      if (!form.time) {
        toast.error(
          "Please select interview time."
        );
        return;
      }

      // -------------------------------------------------
      // DURATION
      // -------------------------------------------------

      if (!form.duration) {
        toast.error(
          "Please select interview duration."
        );
        return;
      }

      // -------------------------------------------------
      // INTERVIEWER
      // -------------------------------------------------

      if (!form.interviewerId) {
        toast.error(
          "Please select interviewer."
        );
        return;
      }

      try {
        setSubmitting(true);

        const candidatePayload = {
          ...(selectedCandidate || {}),
          _id: candidateId,
          candidateId: candidateId,
        };

        const interviewPayload = {
          round:
            form.round,

          mode:
            form.mode,

          date:
            form.date,

          time:
            form.time,

          duration:
            Number(
              form.duration
            ),

          interviewerId:
            form.interviewerId,

          location:
            form.location,

          notes:
            form.notes,

          ...(isReschedule
            ? {
                interviewId:
                  interview?._id ||
                  interview?.id,
              }
            : {}),
        };

        await onSubmit(
          candidatePayload,
          interviewPayload
        );
      } catch (error) {
        console.error(
          `${mode.toUpperCase()} ERROR:`,
          error?.response?.data ||
            error
        );
      } finally {
        setSubmitting(false);
      }
    };

  // =====================================================
  // CANCEL INTERVIEW FROM RESCHEDULE MODAL
  // =====================================================

  const handleCancelInterview =
    async () => {
      if (
        !onCancelInterview ||
        !interview ||
        cancelling
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this interview?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancelling(true);

        await onCancelInterview(
          interview
        );
      } catch (error) {
        console.error(
          "CANCEL INTERVIEW ERROR:",
          error?.response?.data ||
            error
        );
      } finally {
        setCancelling(false);
      }
    };

  // =====================================================
  // HIDE
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-3">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isReschedule
                ? "Reschedule Interview"
                : "Schedule Interview"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {isReschedule
                ? "Update interview date and time."
                : "Schedule a new interview round."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              submitting ||
              cancelling
            }
            className="text-xl leading-none text-slate-400 hover:text-slate-800 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-4 px-5 py-4">

          {/* ========================================= */}
          {/* CANDIDATE */}
          {/* ========================================= */}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Candidate
            </label>

            {isReschedule ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800">
                {selectedCandidate?.name ||
                  selectedCandidate?.fullName ||
                  "Unknown Candidate"}
              </div>
            ) : (
              <select
                value={
                  form.candidateId
                }
                onChange={(e) =>
                  update(
                    "candidateId",
                    e.target.value
                  )
                }
                disabled={
                  submitting ||
                  loadingCandidates
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100"
              >
                <option value="">
                  {loadingCandidates
                    ? "Loading candidates..."
                    : candidates.length ===
                      0
                    ? "No eligible candidates found"
                    : "Select candidate"}
                </option>

                {candidates.map(
                  (item) => {
                    const id =
                      item?._id ||
                      item?.id;

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {item?.name ||
                          item?.fullName ||
                          "Unknown Candidate"}
                        {item?.role
                          ? ` — ${item.role}`
                          : ""}
                      </option>
                    );
                  }
                )}
              </select>
            )}
          </div>

          {/* ========================================= */}
          {/* ROUND + MODE */}
          {/* ========================================= */}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Interview Round
              </label>

              <select
                value={form.round}
                onChange={(e) =>
                  update(
                    "round",
                    e.target.value
                  )
                }
                disabled={
                  submitting ||
                  isReschedule
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="Final">
                  Final
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Mode
              </label>

              <select
                value={form.mode}
                onChange={(e) =>
                  update(
                    "mode",
                    e.target.value
                  )
                }
                disabled={
                  submitting ||
                  isReschedule
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="Video Call">
                  Video Call
                </option>

                <option value="Onsite">
                  Onsite
                </option>

                <option value="Phone Call">
                  Phone Call
                </option>
              </select>
            </div>
          </div>

          {/* ========================================= */}
          {/* DATE + TIME */}
          {/* ========================================= */}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Date
              </label>

              <input
                type="date"
                value={form.date}
                min={getLocalDateString()}
                onChange={(e) =>
                  update(
                    "date",
                    e.target.value
                  )
                }
                disabled={submitting}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Time
              </label>

              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  update(
                    "time",
                    e.target.value
                  )
                }
                disabled={submitting}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* ========================================= */}
          {/* DURATION + INTERVIEWER */}
          {/* ========================================= */}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Duration
              </label>

              <select
                value={form.duration}
                onChange={(e) =>
                  update(
                    "duration",
                    e.target.value
                  )
                }
                disabled={
                  submitting ||
                  isReschedule
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">
                  Select duration
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="45">
                  45 minutes
                </option>

                <option value="60">
                  60 minutes
                </option>

                <option value="90">
                  90 minutes
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Interviewer
              </label>

              <select
                value={
                  form.interviewerId
                }
                onChange={(e) =>
                  update(
                    "interviewerId",
                    e.target.value
                  )
                }
                disabled={
                  loadingInterviewers ||
                  submitting ||
                  isReschedule
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">
                  {loadingInterviewers
                    ? "Loading interviewers..."
                    : interviewers.length ===
                      0
                    ? "No interviewers found"
                    : "Select interviewer"}
                </option>

                {interviewers.map(
                  (interviewer) => {
                    const id =
                      interviewer.id ||
                      interviewer._id;

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {interviewer.name}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

          </div>

          {/* ========================================= */}
          {/* LOCATION */}
          {/* ========================================= */}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Meeting Link / Location
            </label>

            <input
              type="text"
              value={form.location}
              onChange={(e) =>
                update(
                  "location",
                  e.target.value
                )
              }
              disabled={
                submitting ||
                isReschedule
              }
              placeholder="Google Meet link or office room"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          {/* ========================================= */}
          {/* NOTES */}
          {/* ========================================= */}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Notes for Interviewer
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                update(
                  "notes",
                  e.target.value
                )
              }
              disabled={
                submitting ||
                isReschedule
              }
              placeholder="Add key evaluation points or instructions..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

          {/* CANCEL INTERVIEW ONLY IN RESCHEDULE */}

          <div>
            {isReschedule && (
              <button
                type="button"
                onClick={
                  handleCancelInterview
                }
                disabled={
                  submitting ||
                  cancelling
                }
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Cancel Interview"}
              </button>
            )}
          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={onClose}
              disabled={
                submitting ||
                cancelling
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                submitting ||
                cancelling
              }
              className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isReschedule
                ? "Reschedule Interview"
                : "Schedule Interview"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ScheduleInterviewModal;