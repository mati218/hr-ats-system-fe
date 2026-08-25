import { useState } from "react";
import ScoreCircle from "./ScoreCircle";
import {
  completeScreening,
  rejectCandidate,
  updateInterviewStatus,
  updateOfferStatus,
} from "../../lib/api/candidateApi";

const PIPELINE_STAGES = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Interview",
  "Offer Sent",
  "Hired",
];

function CandidateProfile({
  isOpen,
  candidate,
  onClose,
  onScheduleInterview,
  onReject,
  onRefresh,
  onAcceptOffer,
  onOpenOfferModal, // Callback to trigger Offer Letter Modal
}) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);

  if (!isOpen || !candidate) {
    return null;
  }

  const candidateId = candidate._id || candidate.id || candidate.candidateId;
  const isRejected = candidate.stage === "Rejected";
  const currentStageIndex = PIPELINE_STAGES.indexOf(candidate.stage);

  const interviewScheduled =
    !isRejected && currentStageIndex >= PIPELINE_STAGES.indexOf("Interview");

  const progressPercent =
    currentStageIndex < 0
      ? 0
      : (currentStageIndex / (PIPELINE_STAGES.length - 1)) * 100;

  const initials =
    candidate.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  const getResumeUrl = () => {
    if (!candidate?.resumeUrl) return "";
    if (/^https?:\/\//i.test(candidate.resumeUrl)) {
      return candidate.resumeUrl;
    }
    return "";
  };

  const resumeUrl = getResumeUrl();
  const resumeName =
    candidate?.originalResumeName || candidate?.resumeName || "Resume.pdf";

  const handleDownloadResume = async () => {
    if (!resumeUrl || downloading) return;

    try {
      setDownloading(true);
      const response = await fetch(resumeUrl);
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resumeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("RESUME DOWNLOAD ERROR:", error);
      alert("Unable to download resume. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleReject = async () => {
    if (isRejected || rejecting) return;
    if (!candidateId) {
      setRejectError("Candidate ID not found.");
      return;
    }

    try {
      setRejecting(true);
      setRejectError("");

      const response = await rejectCandidate(candidateId);
      const updatedCandidate = response?.data?.data || {
        ...candidate,
        stage: "Rejected",
      };

      if (onReject) onReject(updatedCandidate);
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("REJECT ERROR:", error?.response?.data || error);
      setRejectError(
        error?.response?.data?.message || "Failed to reject candidate."
      );
    } finally {
      setRejecting(false);
    }
  };

const handleScheduleInterview = async (
  candidate,
  form
) => {
  try {
    await scheduleInterview({
      candidateId:
        candidate.candidateId ||
        candidate._id,

      round: form.round,

      mode: form.mode,

      date: form.date,

      time: form.time,

      duration: form.duration,

      interviewerId: form.interviewerId,

      location: form.location || "",

      notes: form.notes || "",
    });

    toast.success(
      "Interview scheduled successfully"
    );

    // reload candidates
    await loadCandidates();

    setSchedulingCandidate(null);
  } catch (error) {
    console.error(
      "SCHEDULE INTERVIEW ERROR:",
      error?.response?.data || error
    );

    toast.error(
      error?.response?.data?.message ||
        "Failed to schedule interview"
    );
  }
};

  const handleScreeningDecision = async (status) => {
    try {
      setDecisionLoading(true);
      setRejectError("");
      await completeScreening(candidateId, status);
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      setRejectError(
        error?.response?.data?.message || "Failed to update screening."
      );
    } finally {
      setDecisionLoading(false);
    }
  };

  const handlePassInterview = () => {
    if (onOpenOfferModal) {
      onOpenOfferModal(candidate);
    }
  };

  const handleOfferDecision = async (status) => {
    if (status === "Accepted" && onAcceptOffer) {
      onAcceptOffer(candidate);
      return;
    }

    try {
      setDecisionLoading(true);
      setRejectError("");

      await updateOfferStatus(candidateId, {
        status,
        rejectionReason: status === "Rejected" ? "Candidate declined offer" : "",
      });

      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      setRejectError(
        error?.response?.data?.message || "Failed to update offer status."
      );
    } finally {
      setDecisionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-210 overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-base font-bold text-slate-800">Candidate Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-slate-400 transition hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto">
          {/* Candidate Info Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-base font-bold text-white">
                {initials}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {candidate.name}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Applied for {candidate.role}
                  {" · "}
                  {candidate.experience || "Experience not specified"}
                </p>
              </div>
            </div>

            <ScoreCircle
              score={candidate.score || 0}
              color={isRejected ? "#c83b3b" : "#159570"}
            />
          </div>

          {/* Pipeline Progress Bar */}
          <div className="px-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Pipeline Stage
            </h4>

            {isRejected ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                This candidate has been rejected.
              </div>
            ) : (
              <div className="relative flex items-start justify-between pb-3">
                <div className="absolute left-3 right-3 top-3 h-0.5 bg-slate-200" />
                <div
                  className="absolute left-3 top-3 h-0.5 bg-emerald-500"
                  style={{ width: `${progressPercent}%` }}
                />

                {PIPELINE_STAGES.map((stage, index) => {
                  const isDone = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div key={stage} className="relative z-10 flex flex-col items-center">
                      <div
                        className={
                          "flex h-5.5 w-5.5 items-center justify-center rounded-full text-[10px] font-bold " +
                          (isDone
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-blue-600 text-white"
                            : "border-2 border-slate-200 bg-white text-slate-400")
                        }
                      >
                        {isDone ? "✓" : isCurrent ? "•" : index + 1}
                      </div>

                      <span className="mt-1.5 text-[11px] font-medium text-slate-500">
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact & Documents */}
          <div className="mt-6 px-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Contact & Documents
            </h4>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.email || "—"}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Phone</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.phone || "—"}
                </div>
              </div>
            </div>

            {/* Resume Button */}
            <div className="mt-3">
              {resumeUrl ? (
                <div className="flex items-center gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <span className="text-base">📄</span>
                    <span className="truncate text-xs font-semibold text-slate-700">
                      {resumeName}
                    </span>
                  </div>

                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloading}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloading ? "Downloading..." : "Download Resume"}
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-400">
                  No resume uploaded.
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6 px-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Skills Matched
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.length ? (
                candidate.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No skills recorded</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6 px-6 pb-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Recruiter Notes
            </h4>
            {candidate.notes?.length ? (
              <div className="space-y-2">
                {candidate.notes.map((note, index) => (
                  <div
                    key={note._id || index}
                    className="rounded-xl bg-slate-100 px-3.5 py-3 text-sm text-slate-500"
                  >
                    <span className="font-semibold text-slate-800">{note.author}</span>
                    {" — "}
                    {note.text}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No notes yet.</p>
            )}
          </div>

          {/* Error Banner */}
          {rejectError && (
            <div className="mx-6 mb-5 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              {rejectError}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {!isRejected && (
              <button
                type="button"
                onClick={handleReject}
                disabled={rejecting || decisionLoading}
                className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejecting ? "Rejecting..." : "Reject Candidate"}
              </button>
            )}

            {/* Screening Stage Actions */}
            {candidate.stage === "Screening" && (
              <button
                type="button"
                disabled={decisionLoading}
                onClick={() => handleScreeningDecision("Passed")}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                Pass Screening
              </button>
            )}

            {candidate.stage === "Interview" && (
  <button
    type="button"
    disabled={decisionLoading}
    onClick={handlePassInterview}
    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
  >
    Pass Interview
  </button>
)}

            {/* Offer Stage Actions */}
            {candidate.stage === "Offer Sent" && (
              <>
                <button
                  type="button"
                  disabled={decisionLoading}
                  onClick={() => handleOfferDecision("Accepted")}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  Offer Accepted (Mark as Hired)
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            {!isRejected && !interviewScheduled && (
              <button
                type="button"
                onClick={handleScheduleInterview}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Schedule Interview
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CandidateProfile;