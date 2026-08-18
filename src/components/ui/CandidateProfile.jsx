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

  // ==========================
  // INTERVIEW STATES
  // ==========================
  const [showInterviewForm, setShowInterviewForm] =
    useState(false);

  const [interviewData, setInterviewData] = useState({
    round: "",
    mode: "",
    date: "",
    time: "",
    duration: "",
    interviewer: "",
  });

  const [interviewError, setInterviewError] =
    useState("");

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
  // OPEN INTERVIEW FORM
  // ==========================
  const handleScheduleClick = () => {
    setInterviewError("");

    setInterviewData({
      round: "",
      mode: "",
      date: "",
      time: "",
      duration: "",
      interviewer: "",
    });

    setShowInterviewForm(true);
  };

  // ==========================
  // INTERVIEW INPUT CHANGE
  // ==========================
  const handleInterviewChange = (field, value) => {
    setInterviewData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================
  // SUBMIT INTERVIEW
  // ==========================
  const handleInterviewSubmit = () => {
    if (
      !interviewData.round ||
      !interviewData.mode ||
      !interviewData.date ||
      !interviewData.time ||
      !interviewData.duration ||
      !interviewData.interviewer
    ) {
      setInterviewError(
        "Please fill all interview fields."
      );
      return;
    }

    if (onScheduleInterview) {
      onScheduleInterview(
        candidate,
        interviewData
      );
    }

    setShowInterviewForm(false);
  };

  return (
    <>
      {/* ==========================
          CANDIDATE PROFILE MODAL
      ========================== */}
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

              {isRejected ? (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  This candidate has been rejected.
                </div>
              ) : (
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
                disabled={isRejected}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Schedule Interview
              </button>

            </div>

          </div>

        </div>

      </div>

      
      {showInterviewForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <h2 className="text-base font-bold text-slate-800">
                Schedule Interview
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowInterviewForm(false)
                }
                className="text-xl leading-none text-slate-400 transition hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <div className="space-y-4 px-6 py-5">

              {/* CANDIDATE */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Candidate
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  {candidate.name}
                </div>
              </div>

              {/* ROUND */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Interview Round
                </label>

                <select
                  value={interviewData.round}
                  onChange={(e) =>
                    handleInterviewChange(
                      "round",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">
                    Select Round
                  </option>

                  <option value="HR">
                    HR Interview
                  </option>

                  <option value="Technical">
                    Technical Interview
                  </option>

                  <option value="Final">
                    Final Interview
                  </option>
                </select>
              </div>

              {/* MODE */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Interview Mode
                </label>

                <select
                  value={interviewData.mode}
                  onChange={(e) =>
                    handleInterviewChange(
                      "mode",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">
                    Select Mode
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="In-person">
                    In-person
                  </option>
                </select>
              </div>

              {/* DATE + TIME */}
              <div className="grid grid-cols-2 gap-3">

                {/* DATE */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Date
                  </label>

                  <input
                    type="date"
                    value={interviewData.date}
                    onChange={(e) =>
                      handleInterviewChange(
                        "date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* TIME */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Time
                  </label>

                  <input
                    type="time"
                    value={interviewData.time}
                    onChange={(e) =>
                      handleInterviewChange(
                        "time",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* DURATION */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Duration
                </label>

                <select
                  value={interviewData.duration}
                  onChange={(e) =>
                    handleInterviewChange(
                      "duration",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">
                    Select Duration
                  </option>

                  <option value="30">
                    30 Minutes
                  </option>

                  <option value="45">
                    45 Minutes
                  </option>

                  <option value="60">
                    60 Minutes
                  </option>
                </select>
              </div>

              {/* INTERVIEWER */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Interviewer
                </label>

           <input
           type="text"
           placeholder="Enter interviewer name"
           value={interviewData.interviewer}
           onChange={(e) => {
            const value = e.target.value;

             if (/^[A-Za-z\s]*$/.test(value)) {
               handleInterviewChange(
               "interviewer",
               value
                  );
                }
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
                  
              </div>

              {/* ERROR */}
              {interviewError && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
                  {interviewError}
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setShowInterviewForm(false)
                }
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleInterviewSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Schedule Interview
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default CandidateProfile;