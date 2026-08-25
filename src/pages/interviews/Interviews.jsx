import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchAllInterviews,
  cancelInterview,
  rescheduleInterview,
  completeInterview,
  scheduleInterview,
  updateInterviewStatus,
} from "../../lib/api/interviewApi";

import ScheduleInterviewModal from "../../components/ui/ScheduleInterviewModal";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedInterview, setSelectedInterview] = useState(null);

  const [showReschedule, setShowReschedule] = useState(false);
  const [showScheduleNew, setShowScheduleNew] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  // =====================================================
  // NORMALIZE API RESPONSE
  // =====================================================

  const normalizeInterviews = (response) => {
    const data =
      response?.data?.data ||
      response?.data?.interviews ||
      response?.data ||
      [];

    return Array.isArray(data) ? data : [];
  };

  // =====================================================
  // LOAD INTERVIEWS
  // =====================================================

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchAllInterviews();

      const interviewData = normalizeInterviews(response);

      setInterviews(interviewData);
    } catch (error) {
      console.error(
        "GET INTERVIEWS ERROR:",
        error?.response?.data || error
      );

      setInterviews([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load interviews."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  // =====================================================
  // SCHEDULE NEW INTERVIEW
  //
  // New interview should normally start as:
  //
  // Pending
  //
  // =====================================================

  const handleScheduleNew = async (
    candidatePayload,
    interviewPayload
  ) => {
    try {
      const candidateId =
        candidatePayload?._id ||
        candidatePayload?.id ||
        candidatePayload?.candidateId;

      if (!candidateId) {
        toast.error("Candidate ID not found.");
        return;
      }

      await scheduleInterview({
        candidateId,

        round: interviewPayload?.round,
        mode: interviewPayload?.mode,
        date: interviewPayload?.date,
        time: interviewPayload?.time,
        duration: Number(interviewPayload?.duration),

        interviewerId:
          interviewPayload?.interviewerId,

        location:
          interviewPayload?.location || "",

        notes:
          interviewPayload?.notes || "",

        // Important:
        // Backend should create the interview
        // with status = "Pending".
      });

      toast.success(
        "Interview scheduled successfully."
      );

      setShowScheduleNew(false);

      await loadInterviews();
    } catch (error) {
      console.error(
        "SCHEDULE INTERVIEW ERROR:",
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
  // CONFIRM INTERVIEW
  //
  // Pending → Confirmed
  // =====================================================

  const handleConfirm = async (interview) => {
    const interviewId =
      interview?._id ||
      interview?.id;

    if (!interviewId) {
      toast.error("Interview ID not found.");
      return;
    }

    try {
      setActionLoading(true);

      await updateInterviewStatus(
        interviewId,
        "Confirmed"
      );

      toast.success(
        "Interview confirmed successfully."
      );

      await loadInterviews();
    } catch (error) {
      console.error(
        "CONFIRM INTERVIEW ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to confirm interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CANCEL INTERVIEW
  //
  // Pending / Confirmed → Cancelled
  // =====================================================

  const handleCancel = async (
    interviewToCancel
  ) => {
    const targetId =
      interviewToCancel?._id ||
      interviewToCancel?.id ||
      interviewToCancel;

    if (!targetId) {
      toast.error("Interview ID not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await cancelInterview(targetId);

      toast.success(
        "Interview cancelled successfully."
      );

      setShowReschedule(false);
      setSelectedInterview(null);

      await loadInterviews();
    } catch (error) {
      console.error(
        "CANCEL INTERVIEW ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // COMPLETE INTERVIEW
  //
  // Confirmed → Completed
  // =====================================================

  const handleComplete = async (interview) => {
    const interviewId =
      interview?._id ||
      interview?.id;

    if (!interviewId) {
      toast.error("Interview ID not found.");
      return;
    }

    const confirmed = window.confirm(
      "Mark this interview as completed?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await completeInterview(interviewId);

      toast.success(
        "Interview marked as completed."
      );

      await loadInterviews();
    } catch (error) {
      console.error(
        "COMPLETE INTERVIEW ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to complete interview."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // RESCHEDULE
  //
  // Only Pending / Confirmed
  // =====================================================

  const handleReschedule = async (
    candidatePayload,
    interviewPayload
  ) => {
    try {
      const targetId =
        selectedInterview?._id ||
        selectedInterview?.id;

      if (!targetId) {
        toast.error(
          "Interview ID not found."
        );
        return;
      }

      await rescheduleInterview(
        targetId,
        {
          date:
            interviewPayload?.date,

          time:
            interviewPayload?.time,
        }
      );

      toast.success(
        "Interview rescheduled successfully."
      );

      setShowReschedule(false);
      setSelectedInterview(null);

      await loadInterviews();
    } catch (error) {
      console.error(
        "RESCHEDULE INTERVIEW ERROR:",
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
  // OPEN RESCHEDULE MODAL
  // =====================================================

  const handleOpenReschedule = (
    interview
  ) => {
    const status =
      interview?.status?.toLowerCase();

    if (
      status === "completed" ||
      status === "cancelled"
    ) {
      toast.error(
        "This interview cannot be rescheduled."
      );

      return;
    }

    setSelectedInterview(interview);
    setShowReschedule(true);
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (status) => {
    switch (
      status?.toLowerCase()
    ) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "pending":
      case "scheduled":
        return "bg-amber-100 text-amber-800";

      case "cancelled":
      case "canceled":
        return "bg-rose-100 text-rose-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {
    if (!status) return "Pending";

    if (
      status.toLowerCase() ===
      "scheduled"
    ) {
      return "Pending";
    }

    return status;
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDateBadge = (
    dateStr
  ) => {
    if (!dateStr) return "N/A";

    const dateObj =
      new Date(dateStr);

    if (
      Number.isNaN(
        dateObj.getTime()
      )
    ) {
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">
          Loading interviews...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interviews
          </h1>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage scheduled candidate interviews
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowScheduleNew(true)
          }
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Schedule Interview
        </button>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {interviews.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <p className="text-base font-semibold text-slate-700">
            No interviews scheduled
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Interviews scheduled from Candidate Pipeline
            will appear here.
          </p>

        </div>
      )}

      {/* =================================================
          INTERVIEW LIST
      ================================================= */}

      {interviews.length > 0 && (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

          {interviews.map(
            (interview) => {

              const candidate =
                interview?.candidateId;

              const interviewer =
                interview?.interviewerId;

              const status =
                interview?.status?.toLowerCase() ||
                "pending";

              const isPending =
                status === "pending" ||
                status === "scheduled";

              const isConfirmed =
                status === "confirmed";

              const isCompleted =
                status === "completed";

              const isCancelled =
                status === "cancelled" ||
                status === "canceled";

              return (
                <div
                  key={interview._id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between"
                >

                  {/* =================================================
                      LEFT SIDE
                  ================================================= */}

                  <div className="flex items-center gap-5">

                    {/* DATE/TIME */}

                    <div className="flex min-w-25 flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100/80 px-3 py-2 text-center">

                      <span className="text-sm font-bold leading-tight text-slate-900">
                        {interview.time || "N/A"}
                      </span>

                      <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
                        {formatDateBadge(
                          interview.date
                        )}
                      </span>

                    </div>

                    {/* CANDIDATE */}

                    <div>

                      <h2 className="text-base font-bold capitalize leading-tight text-slate-900">
                        {candidate?.name ||
                          candidate?.fullName ||
                          "Unknown Candidate"}
                      </h2>

                      <p className="mt-1 text-xs font-medium text-slate-500">

                        {candidate?.role ||
                          "Candidate"}

                        {interview.round &&
                          ` · ${interview.round}`}

                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      RIGHT SIDE
                  ================================================= */}

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">

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
                        "Unknown Interviewer"}
                    </span>

                    {/* STATUS */}

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                        interview.status
                      )}`}
                    >
                      {getStatusText(
                        interview.status
                      )}
                    </span>

                    {/* =================================================
                        PENDING ACTIONS
                    ================================================= */}

                    {isPending && (
                      <>
                        <button
                          type="button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleConfirm(
                              interview
                            )
                          }
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Confirm
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleOpenReschedule(
                              interview
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                        >
                          Reschedule
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleCancel(
                              interview
                            )
                          }
                          className="rounded-lg bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {/* =================================================
                        CONFIRMED ACTIONS
                    ================================================= */}

                    {isConfirmed && (
                      <>
                        <button
                          type="button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleComplete(
                              interview
                            )
                          }
                          className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          Complete
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleOpenReschedule(
                              interview
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          Reschedule
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            handleCancel(
                              interview
                            )
                          }
                          className="rounded-lg bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {/* =================================================
                        COMPLETED
                    ================================================= */}

                    {isCompleted && (
                      <span className="text-xs font-semibold text-blue-600">
                        Interview Completed
                      </span>
                    )}

                    {/* =================================================
                        CANCELLED
                    ================================================= */}

                    {isCancelled && (
                      <span className="text-xs font-semibold text-rose-600">
                        Interview Cancelled
                      </span>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =================================================
          RESCHEDULE MODAL
      ================================================= */}

      {showReschedule &&
        selectedInterview && (
          <ScheduleInterviewModal
            isOpen={showReschedule}
            candidate={
              selectedInterview.candidateId
            }
            interview={
              selectedInterview
            }
            mode="reschedule"

            onClose={() => {
              setShowReschedule(false);
              setSelectedInterview(null);
            }}

            onSubmit={
              handleReschedule
            }

            onCancelInterview={
              handleCancel
            }
          />
        )}

      {/* =================================================
          NEW INTERVIEW MODAL
      ================================================= */}

      {showScheduleNew && (
        <ScheduleInterviewModal
          isOpen={showScheduleNew}
          mode="schedule"

          onClose={() =>
            setShowScheduleNew(false)
          }

          onSubmit={
            handleScheduleNew
          }
        />
      )}

    </div>
  );
}

export default Interviews;