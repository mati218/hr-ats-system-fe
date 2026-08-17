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

  if (!isOpen || !candidate) {
    return null;
  }

  const isRejected = candidate.stage === "Rejected";

  const currentStageIndex = PIPELINE_STAGES.indexOf(
    candidate.stage
  );

  const progressPercent =
    currentStageIndex < 0
      ? 0
      : (currentStageIndex /
          (PIPELINE_STAGES.length - 1)) *
        100;

  const initials = candidate.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ==========================
  // REJECT CANDIDATE
  // ==========================
  const handleReject = async () => {
    if (isRejected || rejecting) {
      return;
    }

    const candidateId =
      candidate.candidateId ||
      candidate._id ||
      candidate.id;

    if (!candidateId) {
      setRejectError("Candidate ID not found.");
      return;
    }

    try {
      setRejecting(true);
      setRejectError("");

      await rejectCandidate(candidateId);

      if (onReject) {
        onReject({
          ...candidate,
          stage: "Rejected",
        });
      }

      onClose();
    } catch (error) {
      console.error(
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

  // ==========================
  // SCHEDULE INTERVIEW
  // ==========================
  const handleScheduleClick = () => {
    if (onScheduleInterview) {
      onScheduleInterview(candidate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      {/* MODAL */}
      <div className="w-full max-w-190 overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ==========================
            HEADER
        ========================== */}
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

        {/* ==========================
            CONTENT
        ========================== */}
        <div className="max-h-[75vh] overflow-y-auto">

          {/* ==========================
              NAME + SCORE
          ========================== */}
          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              {/* AVATAR */}
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

            {/* SCORE */}
            <ScoreCircle
              score={candidate.score}
              color={
                isRejected
                  ? "#c83b3b"
                  : "#159570"
              }
            />

          </div>

          {/* ==========================
              PIPELINE STAGE
          ========================== */}
          <div className="px-6">

            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Pipeline Stage
            </h4>

            {/* REJECTED VIEW */}
            {isRejected ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                This candidate has been rejected.
              </div>
            ) : (

              /* NORMAL PIPELINE */
              <div className="relative flex items-start justify-between pb-3">

                {/* BACKGROUND LINE */}
                <div className="absolute left-3 right-3 top-3 h-0.5 bg-slate-200" />

                {/* PROGRESS LINE */}
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
                            "flex h-5.5 w-5.5 items-center justify-center rounded-full text-[10px] font-bold " +
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

          {/* ==========================
              CONTACT & DOCUMENTS
          ========================== */}
          <div className="mt-6 px-6">

            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Contact & Documents
            </h4>

            <div className="grid grid-cols-2 gap-3">

              {/* EMAIL */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Email
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.email || "—"}
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Phone
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.phone || "—"}
                </div>
              </div>

            </div>

            {candidate.resumeUrl && (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                📄 Download Resume.pdf
              </a>
            )}

          </div>

          {/* ==========================
              SKILLS MATCHED
          ========================== */}
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

          {/* ==========================
              RECRUITER NOTES
          ========================== */}
          <div className="mt-6 px-6 pb-6">

            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Recruiter Notes
            </h4>

            {candidate.notes?.length ? (
              <div className="space-y-2">

                {candidate.notes.map(
                  (note, index) => (
                    <div
                      key={note._id || index}
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

          {/* ==========================
              ERROR
          ========================== */}
          {rejectError && (
            <div className="mx-6 mb-5 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              {rejectError}
            </div>
          )}

        </div>

        {/* ==========================
            FOOTER
        ========================== */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">

          {/* LEFT BUTTON */}
          {isRejected ? (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-400"
            >
              Rejected
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReject}
              disabled={rejecting}
              className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              {rejecting
                ? "Rejecting..."
                : "Reject Candidate"}
            </button>
          )}

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleScheduleClick}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Schedule Interview
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CandidateProfile;