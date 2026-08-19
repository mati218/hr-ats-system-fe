import { useState } from "react";
import ScoreCircle from "./ScoreCircle";
import { rejectCandidate } from "../../lib/api/candidateApi";

const PIPELINE_STAGES = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
];

function CandidateProfile({
  isOpen,
  candidate,
  onClose,
  onScheduleInterview,
  onReject,
}) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState("");
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !candidate) {
    return null;
  }

  const isRejected = candidate.stage === "Rejected";

  const currentStageIndex = PIPELINE_STAGES.indexOf(
    candidate.stage
  );

  const interviewScheduled =
    !isRejected &&
    currentStageIndex >=
      PIPELINE_STAGES.indexOf("Interview");

  const progressPercent =
    currentStageIndex < 0
      ? 0
      : (currentStageIndex /
          (PIPELINE_STAGES.length - 1)) *
        100;

  const initials =
    candidate.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  const getResumeUrl = () => {
    if (!candidate?.resumeUrl) {
      return "";
    }

    if (
      candidate.resumeUrl.startsWith("http://") ||
      candidate.resumeUrl.startsWith("https://")
    ) {
      return candidate.resumeUrl;
    }

    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:5000/api";

    const backendUrl = apiBaseUrl.replace(
      /\/api\/?$/,
      ""
    );

    return `${backendUrl}${
      candidate.resumeUrl.startsWith("/")
        ? ""
        : "/"
    }${candidate.resumeUrl}`;
  };

  const resumeUrl = getResumeUrl();

  const resumeName =
    candidate?.resumeName ||
    candidate?.resumeUrl?.split("/").pop() ||
    "Download Resume.pdf";

  const handleDownloadResume = async () => {
    if (!resumeUrl || downloading) {
      return;
    }

    try {
      setDownloading(true);

      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error(
          "Unable to download resume."
        );
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
      console.error(
        "RESUME DOWNLOAD ERROR:",
        error
      );

      alert(
        "Unable to download resume. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleReject = async () => {
    if (isRejected || rejecting) {
      return;
    }

    const candidateId =
      candidate._id ||
      candidate.id ||
      candidate.candidateId;

    if (!candidateId) {
      setRejectError(
        "Candidate ID not found."
      );
      return;
    }

    try {
      setRejecting(true);
      setRejectError("");

      const response =
        await rejectCandidate(candidateId);

      const updatedCandidate =
        response?.data?.data || {
          ...candidate,
          stage: "Rejected",
        };

      if (onReject) {
        onReject(updatedCandidate);
      }

      onClose();
    } catch (error) {
      console.error(
        "REJECT CANDIDATE ERROR:",
        error?.response?.data || error
      );

      setRejectError(
        error?.response?.data?.message ||
          "Failed to reject candidate."
      );
    } finally {
      setRejecting(false);
    }
  };

  const handleScheduleInterview = () => {
    if (isRejected || interviewScheduled) {
      return;
    }

    if (onScheduleInterview) {
      onScheduleInterview(candidate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[840px] overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-base font-bold text-slate-800">
            Candidate Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-slate-400 transition hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto">

          {/* Candidate Header */}
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
                  {candidate.experience ||
                    "Experience not specified"}
                </p>
              </div>

            </div>

            <ScoreCircle
              score={candidate.score || 0}
              color={
                isRejected
                  ? "#c83b3b"
                  : "#159570"
              }
            />
          </div>

          {/* Pipeline Stage */}
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
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />

                {PIPELINE_STAGES.map(
                  (stage, index) => {
                    const isDone =
                      index < currentStageIndex;

                    const isCurrent =
                      index === currentStageIndex;

                    return (
                      <div
                        key={stage}
                        className="relative z-10 flex flex-col items-center"
                      >
                        <div
                          className={
                            "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold " +
                            (isDone
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                              ? "bg-blue-600 text-white"
                              : "border-2 border-slate-200 bg-white text-slate-400")
                          }
                        >
                          {isDone
                            ? "✓"
                            : isCurrent
                            ? "•"
                            : index + 1}
                        </div>

                        <span className="mt-1.5 text-[11px] font-medium text-slate-500">
                          {stage}
                        </span>
                      </div>
                    );
                  }
                )}

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
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Email
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.email || "—"}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Phone
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.phone || "—"}
                </div>
              </div>

            </div>

            {/* Resume */}
            <div className="mt-3">
              {resumeUrl ? (
                <div className="flex items-center gap-2">

                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <span className="text-base">
                      📄
                    </span>

                    <span className="truncate text-xs font-semibold text-slate-700">
                      {resumeName}
                    </span>
                  </div>

                  {/* View */}
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    View
                  </a>

                  {/* Download */}
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloading}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloading
                      ? "Downloading..."
                      : "Download Resume"}
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
                candidate.skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <span className="text-xs text-slate-400">
                  No skills recorded
                </span>
              )}
            </div>
          </div>

          {/* Recruiter Notes */}
          <div className="mt-6 px-6 pb-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Recruiter Notes
            </h4>

            {candidate.notes?.length ? (
              <div className="space-y-2">
                {candidate.notes.map(
                  (note, index) => (
                    <div
                      key={
                        note._id || index
                      }
                      className="rounded-xl bg-slate-100 px-3.5 py-3 text-sm text-slate-500"
                    >
                      <span className="font-semibold text-slate-800">
                        {note.author}
                      </span>

                      {" — "}

                      {note.text}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No notes yet.
              </p>
            )}
          </div>

          {/* Reject Error */}
          {rejectError && (
            <div className="mx-6 mb-5 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              {rejectError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">

          {/* Reject Button */}
          <div>
            {!isRejected && (
              <button
                type="button"
                onClick={handleReject}
                disabled={rejecting}
                className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejecting
                  ? "Rejecting..."
                  : "Reject Candidate"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            {/* Schedule Interview */}
            {!isRejected &&
              !interviewScheduled && (
                <button
                  type="button"
                  onClick={
                    handleScheduleInterview
                  }
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