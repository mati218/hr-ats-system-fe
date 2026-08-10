import ScoreCircle from "./ScoreCircle";

function CandidateProfile({ isOpen, candidate, onClose }) {
  if (!isOpen || !candidate) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className=" max-h-[95vh] overflow-y-auto rounded-2xl bg-white text-left shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
          <h2 className="text-1xl font-bold text-slate-900"> Candidate Profile </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 hover:text-slate-800">  × </button>
        </div>
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
              {candidate.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-slate-900">
                {candidate.name}</h3>
              <p className="text-base text-slate-500">
                Applied for {candidate.role} · {candidate.experience}
              </p>
            </div>
          </div>
          <ScoreCircle
            score={candidate.score}
            color={candidate.color}/>
        </div>
        <div className="px-8">
          <h4 className="mb-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
            Pipeline Stage </h4>
          <div className="relative flex items-start justify-between">
            <div className="absolute left-8 right-8 top-4 h-1 bg-slate-200"></div>
            <div className="absolute left-8 top-4 h-1 w-[42%] bg-emerald-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">  ✓
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">
                Applied
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                ✓
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">
                Screening
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                ✓
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">
                Shortlisted
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                •
              </div>

              <span className="mt-2 text-xs font-medium text-slate-600">
                Interview
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 text-xs font-bold text-slate-400">
                5
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">
                Offer
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 text-xs font-bold text-slate-400">  6
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">
                Hired
              </span>
            </div>

          </div>
        </div>
        <div className="mt-8 px-8">
          <h4 className="mb-4 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
            Contact & Documents
          </h4>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="text-left">
              <label className="mb-2 block font-semibold text-slate-700">
                Email
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">sara.iqbal@mail.com
              </div>
            </div>
            <div className="text-left">
              <label className="mb-2 block font-semibold text-slate-700">
                Phone
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                +92 300 1234567
              </div>
            </div>

          </div>

          {/* Resume */}
          <button
            type="button"
            className="mt-4 rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
          >
            📄 Download Resume.pdf
          </button>

        </div>
        <div className="mt-8 px-8">
          <h4 className="mb-4 text-left text-sm font-bold uppercase tracking-wide text-slate-500"> Skills Matched </h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills?.map((skill) => (
              <span key={skill}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600" >{skill} </span>
            ))}
          </div>
        </div>
        <div className="mt-7 px-8">
          <h4 className="mb-4 text-left text-sm font-bold uppercase tracking-wide text-slate-500"> Recruiter Notes </h4>
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-100 px-5 py-4 text-left text-slate-600">
              <span className="font-bold text-slate-800">Ayesha Khan </span>
              <span> {" "} — Strong portfolio, great communication in screening call.
              </span>
            </div>
            <div className="rounded-xl bg-slate-100 px-5 py-4 text-left text-slate-600">
              <span className="font-bold text-slate-800">
                Zeeshan Raza </span>
              <span> {" "}— Recommended Hire after technical round, solid system design fundamentals.</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="rounded-xl bg-red-50 px-5 py-3 font-semibold text-red-600 hover:bg-red-100" > Reject Candidate
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50" >
              Close</button>
            <button
              type="button"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Schedule Interview</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;