import ScoreCircle from "./ScoreCircle";


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
  if (!isOpen || !candidate) {
    return null;
  }

  const isRejected = candidate.stage === "Rejected";

  const currentStageIndex = PIPELINE_STAGES.indexOf(
    candidate.stage
  );

  const progressPercent = isRejected
    ? 100
    : currentStageIndex < 0
    ? 0
    : (currentStageIndex / (PIPELINE_STAGES.length - 1)) * 100;

  const initials =
    candidate.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  async function handleReject() {
    await onReject(candidate);
  }

  function handleScheduleClick() {
    onScheduleInterview(candidate);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-900">
            Candidate Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-slate-400 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-900">
                {candidate.name}
              </h3>

              <p className="max-w-[360px] truncate text-xs text-slate-500">
                Applied for {candidate.role}
                {" · "}
                {candidate.experience || "Experience not specified"}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <ScoreCircle
              score={candidate.score}
              color={isRejected ? "#dc2626" : "#2563eb"}
            />
          </div>
        </div>
        <div className="px-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Pipeline Stage
          </h4>

          {isRejected ? (
            <div className="mb-2 rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
              This candidate has been rejected.
            </div>
          ) : (
            <div className="relative flex items-start justify-between">
              <div className="absolute left-5 right-5 top-3.5 h-0.5 bg-slate-200" />
              <div
                className="absolute left-5 top-3.5 h-0.5 bg-emerald-500"
                style={{
                  width: `calc(${progressPercent}% - ${
                    progressPercent === 0 ? 0 : 2.5
                  }rem)`,
                }}
              />

              {PIPELINE_STAGES.map((stage, index) => {
                const isDone = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div
                    key={stage}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={
                        "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold " +
                        (isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-blue-600 text-white"
                          : "border-2 border-slate-200 bg-slate-100 text-slate-400")
                      }
                    >
                      {isDone
                        ? "✓"
                        : isCurrent
                        ? "•"
                        : index + 1}
                    </div>

                    <span className="mt-1.5 text-[10px] font-medium text-slate-600">
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div className="mt-6 px-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Contact & Documents
          </h4>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Email
              </label>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {candidate.email || "—"}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Phone
              </label>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {candidate.phone || "—"}
              </div>
            </div>
          </div>

          {candidate.resumeUrl && (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              📄 Download Resume.pdf
            </a>
          )}
        </div>

        {/* SKILLS */}
        <div className="mt-6 px-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Skills Matched
          </h4>

          <div className="flex flex-wrap gap-1.5">
            {candidate.skills?.length ? (
              candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                No skills recorded
              </span>
            )}
          </div>
        </div>
        <div className="mt-6 px-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Recruiter Notes
          </h4>

          <div className="space-y-2">
            {candidate.notes?.length ? (
              candidate.notes.map((note, index) => (
                <div
                  key={note._id || index}
                  className="rounded-lg bg-slate-100 px-3 py-2.5 text-xs text-slate-600"
                >
                  <span className="font-bold text-slate-800">
                    {note.author}
                  </span>

                  <span>
                    {" — "}
                    {note.text}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">
                No notes yet.
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            onClick={handleReject}
            disabled={isRejected}
            className="rounded-lg bg-red-50 px-2 py-2 text-xs font-small text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {isRejected ? "Rejected" : "Reject Candidate"}
          </button>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-small text-slate-800 hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleScheduleClick}
              disabled={isRejected}
              className="rounded-lg bg-blue-700 px-2 py-1 text-xs font-small text-white hover:bg-blue-700 disabled:opacity-50"
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