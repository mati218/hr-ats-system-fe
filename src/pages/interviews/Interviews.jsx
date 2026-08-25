import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchAllInterviews,
  confirmInterview,
  cancelInterview,
  rescheduleInterview,
  completeInterview,
  scheduleInterview,
} from "../../lib/api/interviewApi";

import ScheduleInterviewModal from "../../components/ui/ScheduleInterviewModal";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  const [showReschedule, setShowReschedule] =
    useState(false);

  const [showScheduleNew, setShowScheduleNew] =
    useState(false);

  // =====================================================
  // LOAD INTERVIEWS
  // =====================================================

  const loadInterviews = async () => {
    try {
      setLoading(true);

      const response = await fetchAllInterviews();

      setInterviews(response?.data?.data || []);
    } catch (error) {
      console.error(
        "GET INTERVIEWS ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  // =====================================================
  // SCHEDULE NEW
  // =====================================================

  const handleScheduleNew = async (
    candidatePayload,
    interviewPayload
  ) => {
    try {
      await scheduleInterview({
        candidateId: candidatePayload?._id,
        ...interviewPayload,
      });

      toast.success(
        "Interview scheduled as pending."
      );

      setShowScheduleNew(false);

      await loadInterviews();
    } catch (error) {
      console.error(
        "SCHEDULE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to schedule interview."
      );

      throw error;
    }
  };

  // =====================================================
  // CONFIRM
  // Pending → Confirmed
  // =====================================================

  const handleConfirm = async (interview) => {
    const id =
      interview?._id || interview?.id;

    if (!id) return;

    try {
      await confirmInterview(id);

      toast.success(
        "Interview confirmed successfully."
      );

      await loadInterviews();
    } catch (error) {
      console.error(
        "CONFIRM ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to confirm interview."
      );
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = async (interview) => {
    const id =
      interview?._id || interview?.id;

    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?"
    );

    if (!confirmed) return;

    try {
      await cancelInterview(id);

      toast.success(
        "Interview cancelled successfully."
      );

      await loadInterviews();
    } catch (error) {
      console.error(
        "CANCEL ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel interview."
      );
    }
  };

  // =====================================================
  // COMPLETE
  // Confirmed → Completed
  // =====================================================

  const handleComplete = async (interview) => {
    const id =
      interview?._id || interview?.id;

    if (!id) return;

    const confirmed = window.confirm(
      "Mark this interview as completed?"
    );

    if (!confirmed) return;

    try {
      await completeInterview(id);

      toast.success(
        "Interview marked as completed."
      );

      await loadInterviews();
    } catch (error) {
      console.error(
        "COMPLETE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to complete interview."
      );
    }
  };

  // =====================================================
  // RESCHEDULE
  // =====================================================

  const handleReschedule = async (
    candidatePayload,
    interviewPayload
  ) => {
    try {
      const id =
        selectedInterview?._id ||
        selectedInterview?.id;

      if (!id) return;

      await rescheduleInterview(id, {
        date: interviewPayload.date,
        time: interviewPayload.time,
      });

      toast.success(
        "Interview rescheduled successfully."
      );

      setShowReschedule(false);
      setSelectedInterview(null);

      await loadInterviews();
    } catch (error) {
      console.error(
        "RESCHEDULE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to reschedule interview."
      );

      throw error;
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800";

      case "Confirmed":
        return "bg-emerald-100 text-emerald-700";

      case "Cancelled":
        return "bg-rose-100 text-rose-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDateBadge = (dateStr) => {
    if (!dateStr) return "N/A";

    const dateObj = new Date(dateStr);

    if (isNaN(dateObj.getTime())) {
      return dateStr;
    }

    return dateObj.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading interviews...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Interviews
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Manage scheduled interviews
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowScheduleNew(true)
          }
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <span className="text-sm">+</span>

          Schedule Interview
        </button>
      </div>

      {/* EMPTY */}

      {interviews.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-700">
            No interviews scheduled
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Schedule an interview to see it here.
          </p>
        </div>
      )}

      {/* LIST */}

      {interviews.length > 0 && (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {interviews.map((interview) => {
            const candidate =
              interview.candidateId;

            const interviewer =
              interview.interviewerId;

            const status =
              interview.status;

            return (
              <div
                key={interview._id}
                className="flex flex-col gap-3 p-3 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >

                {/* LEFT */}

                <div className="flex items-center gap-3">

                  <div className="flex min-w-[100px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-2 py-2 text-center">

                    <span className="text-xs font-semibold text-slate-900">
                      {interview.time || "N/A"}
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      {formatDateBadge(
                        interview.date
                      )}
                    </span>

                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {candidate?.name ||
                        "Unknown Candidate"}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {candidate?.role ||
                        "No role"}

                      {interview.round &&
                        ` · ${interview.round}`}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-wrap items-center gap-2">

                  {/* MODE */}

                  {interview.mode && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {interview.mode}
                    </span>
                  )}

                  {/* INTERVIEWER */}

                  <span className="text-xs font-medium text-slate-600">
                    {interviewer?.name ||
                      interviewer?.username ||
                      "Unknown"}
                  </span>

                  {/* STATUS */}

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                      status
                    )}`}
                  >
                    {status}
                  </span>

                  {/* ================================= */}
                  {/* PENDING ACTIONS */}
                  {/* ================================= */}

                  {status === "Pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirm(
                            interview
                          )
                        }
                        className="rounded-lg  bg-emerald-600 font-semibold px-3 py-1 text-xs text-white hover:bg-emerald-800"
                      >
                        Confirm
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(
                            interview
                          )
                        }
                        className="rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInterview(
                            interview
                          );
                          setShowReschedule(
                            true
                          );
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Reschedule
                      </button>
                    </>
                  )}

                  {/* ================================= */}
                  {/* CONFIRMED ACTIONS */}
                  {/* ================================= */}

                  {status === "Confirmed" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleComplete(
                            interview
                          )
                        }
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Complete
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(
                            interview
                          )
                        }
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInterview(
                            interview
                          );
                          setShowReschedule(
                            true
                          );
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Reschedule
                      </button>
                    </>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* ========================================= */}
      {/* RESCHEDULE MODAL */}
      {/* ========================================= */}

      {showReschedule &&
        selectedInterview && (
          <ScheduleInterviewModal
            isOpen={showReschedule}
            candidate={
              selectedInterview.candidateId
            }
            interview={selectedInterview}
            mode="reschedule"
            onClose={() => {
              setShowReschedule(false);
              setSelectedInterview(null);
            }}
            onSubmit={handleReschedule}
            onCancelInterview={
              handleCancel
            }
          />
        )}

      {/* ========================================= */}
      {/* NEW INTERVIEW MODAL */}
      {/* ========================================= */}

      {showScheduleNew && (
        <ScheduleInterviewModal
          isOpen={showScheduleNew}
          mode="schedule"
          onClose={() =>
            setShowScheduleNew(false)
          }
          onSubmit={handleScheduleNew}
        />
      )}

    </div>
  );
}

export default Interviews;