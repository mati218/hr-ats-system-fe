import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchAllInterviews,
  cancelInterview,
  rescheduleInterview,
  completeInterview,
  scheduleInterview,
} from "../../lib/api/interviewApi";
import ScheduleInterviewModal from "../../components/ui/ScheduleInterviewModal";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showScheduleNew, setShowScheduleNew] = useState(false);

  // ===================================================
  // LOAD INTERVIEWS
  // ===================================================

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const response = await fetchAllInterviews();
      setInterviews(response?.data || []);
    } catch (error) {
      console.error(
        "GET INTERVIEWS ERROR:",
        error?.response?.data || error
      );
      toast.error(
        error?.response?.data?.message || "Failed to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  // ===================================================
  // SCHEDULE NEW INTERVIEW
  // ===================================================

  const handleScheduleNew = async (candidatePayload, interviewPayload) => {
    try {
      await scheduleInterview({
        candidateId: candidatePayload?._id,
        ...interviewPayload,
      });
      toast.success("Interview scheduled successfully.");
      setShowScheduleNew(false);
      await loadInterviews();
    } catch (error) {
      console.error("SCHEDULE ERROR:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to schedule interview."
      );
      throw error;
    }
  };

  // ===================================================
  // CANCEL INTERVIEW
  // ===================================================

  const handleCancel = async (interviewToCancel) => {
    const targetId = interviewToCancel?._id || interviewToCancel?.id || interviewToCancel;
    if (!targetId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?"
    );
    if (!confirmed) return;

    try {
      await cancelInterview(targetId);
      toast.success("Interview cancelled successfully.");
      setShowReschedule(false);
      setSelectedInterview(null);
      await loadInterviews();
    } catch (error) {
      console.error("CANCEL INTERVIEW ERROR:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to cancel interview."
      );
    }
  };

  // ===================================================
  // RESCHEDULE INTERVIEW (Date & Time Only)
  // ===================================================

  const handleReschedule = async (candidatePayload, interviewPayload) => {
    try {
      const targetId = selectedInterview?._id || selectedInterview?.id;
      await rescheduleInterview(targetId, {
        date: interviewPayload.date,
        time: interviewPayload.time,
      });
      toast.success("Interview rescheduled successfully.");
      setShowReschedule(false);
      setSelectedInterview(null);
      await loadInterviews();
    } catch (error) {
      console.error("RESCHEDULE ERROR:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to reschedule interview."
      );
      throw error;
    }
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
      case "scheduled":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Helper for Date Formatting
  const formatDateBadge = (dateStr) => {
    if (!dateStr) return "N/A";
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;

    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading interviews...
      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interviews
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Week of Jul 14 – Jul 18
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleNew(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Schedule Interview
        </button>
      </div>

      {/* EMPTY STATE */}
      {interviews.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-700">
            No interviews scheduled
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Interviews scheduled from Candidate Pipeline will appear here.
          </p>
        </div>
      )}

      {/* INTERVIEWS LIST CONTAINER */}
      {interviews.length > 0 && (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {interviews.map((interview) => {
            const candidate = interview.candidateId;
            const interviewer = interview.interviewerId;

            return (
              <div
                key={interview._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 transition-colors"
              >
                {/* LEFT: TIME & MAIN INFO */}
                <div className="flex items-center gap-5">
                  {/* TIME BADGE CARD */}
                  <div className="flex min-w-[100px] flex-col items-center justify-center rounded-xl bg-slate-100/80 px-3 py-2 text-center border border-slate-200/60">
                    <span className="text-sm font-bold text-slate-900 leading-tight">
                      {interview.time || "10:00"}
                    </span>
                    <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
                      {formatDateBadge(interview.date)}
                    </span>
                  </div>

                  {/* CANDIDATE & ROLE INFO */}
                  <div>
                    <h2 className="text-base font-bold capitalize text-slate-900 leading-tight">
                      {candidate?.name || candidate?.fullName || "ayesha tariq"}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {candidate?.role || "Senior Frontend Developer"}
                      {interview.round && ` · ${interview.round}`}
                    </p>
                  </div>
                </div>

                {/* RIGHT: MODE, INTERVIEWER, STATUS & ACTIONS */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* MODE BADGE */}
                  {interview.mode && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {interview.mode}
                    </span>
                  )}

                  {/* INTERVIEWER NAME */}
                  <span className="text-xs font-medium text-slate-600">
                    {interviewer?.name || interviewer?.username || "hamza"}
                  </span>

                  {/* STATUS BADGE */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                      interview.status
                    )}`}
                  >
                    {interview.status || "Scheduled"}
                  </span>

                  {/* RESCHEDULE ACTION BUTTON */}
                  {interview.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInterview(interview);
                        setShowReschedule(true);
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showReschedule && selectedInterview && (
        <ScheduleInterviewModal
          isOpen={showReschedule}
          candidate={selectedInterview.candidateId}
          interview={selectedInterview}
          mode="reschedule"
          onClose={() => {
            setShowReschedule(false);
            setSelectedInterview(null);
          }}
          onSubmit={handleReschedule}
          onCancelInterview={handleCancel}
        />
      )}

      {/* NEW INTERVIEW MODAL */}
      {showScheduleNew && (
        <ScheduleInterviewModal
          isOpen={showScheduleNew}
          mode="schedule"
          onClose={() => setShowScheduleNew(false)}
          onSubmit={handleScheduleNew}
        />
      )}
    </div>
  );
}

export default Interviews;