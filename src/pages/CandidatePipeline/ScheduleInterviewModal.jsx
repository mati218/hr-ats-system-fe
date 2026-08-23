import { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";

import { toast } from "sonner";
import { getUsersLookup } from "../../lib/api/lookupApi";

const INITIAL_FORM = {
  round: "Technical",
  mode: "Video Call",
  date: "",
  time: "",
  duration: "45 minutes",
  interviewerId: "",
  location: "",
  notes: "",
};

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

    default:
      return form;
  }
}

function ScheduleInterviewModal({
  isOpen,
  candidate,
  onClose,
  onSubmit,
}) {
  const [form, dispatchForm] =
    useReducer(
      formReducer,
      INITIAL_FORM
    );

  const [interviewers, setInterviewers] =
    useState([]);

  const [
    loadingInterviewers,
    setLoadingInterviewers,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadInterviewers =
      async () => {
        try {
          setLoadingInterviewers(true);

          const response =
            await getUsersLookup(
              "Interviewer"
            );

          const users =
            response?.data?.data || [];

          const normalizedUsers =
            Array.isArray(users)
              ? users.map((user) => ({
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
                }))
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
  // RESET FORM
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dispatchForm({
      type: "reset",
    });
  }, [isOpen, candidate]);

  const update = (field, value) => {
    dispatchForm({
      type: "update",
      field,
      value,
    });
  };

  const handleSubmit = async () => {
    const candidateId =
      candidate?.candidateId ||
      candidate?._id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    if (!form.date) {
      toast.error("Please select interview date.");
      return;
    }

    if (!form.time) {
      toast.error("Please select interview time.");
      return;
    }

    if (!form.interviewerId) {
      toast.error("Please select interviewer.");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit(
        {
          ...candidate,
          _id: candidateId,
          candidateId: candidateId,
        },
        form
      );
    } catch (error) {
      console.error(
        "SCHEDULE ERROR:",
        error?.response?.data ||
          error
      );

      // Parent also handles API error.
      // This handles validation/component errors.
      if (
        error?.response?.data?.message
      ) {
        toast.error(
          error.response.data.message
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !candidate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-3">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Schedule Interview
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Schedule an interview for this candidate.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-xl leading-none text-slate-400 hover:text-slate-800 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Candidate
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {candidate.name ||
                "Unknown Candidate"}
            </div>
          </div>

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
                disabled={submitting}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="Screening">
                  Screening
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
                disabled={submitting}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
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

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Date
              </label>

              <input
                type="date"
                value={form.date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
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
                disabled={submitting}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
              >
                <option value="30 minutes">
                  30 minutes
                </option>

                <option value="45 minutes">
                  45 minutes
                </option>

                <option value="60 minutes">
                  60 minutes
                </option>

                <option value="90 minutes">
                  90 minutes
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Interviewer
              </label>

              <select
                value={form.interviewerId}
                onChange={(e) =>
                  update(
                    "interviewerId",
                    e.target.value
                  )
                }
                disabled={
                  loadingInterviewers ||
                  submitting
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
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

              {!loadingInterviewers &&
                interviewers.length ===
                  0 && (
                  <p className="mt-1 text-[11px] text-red-500">
                    No interviewer users found.
                  </p>
                )}
            </div>
          </div>

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
              disabled={submitting}
              placeholder="Zoom link or office address"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>

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
              disabled={submitting}
              placeholder="Focus areas, prior round notes, etc."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              loadingInterviewers ||
              interviewers.length === 0
            }
            className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Scheduling..."
              : "Schedule Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleInterviewModal;