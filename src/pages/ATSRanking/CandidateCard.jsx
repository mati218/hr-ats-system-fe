import ScoreCircle from "./ScoreCircle";

function CandidateCard({ candidate, onMoveOffer, onViewResume }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-10 py-5">
      <div className="flex items-center gap-8">
        <h2 className="w-3 font-bold text-slate-400 gap-2">
          {candidate.rank}
        </h2>
        <ScoreCircle
          score={candidate.score}
          color={candidate.color}/>
        <div>
          <h3 className="text-1xl font-bold text-slate-700  text-left">{candidate.name}</h3>

          <p className=" text-sm text-slate-500 text-left">
            {candidate.experience} • {candidate.role}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">

            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600"> {skill} </span>  ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={onViewResume} className="rounded-xl border border-slate-300 bg-white font-bold px-2 py-1 ">View Resume</button>
        <button onClick={onMoveOffer} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white ">
  Move to Offer</button>

      </div>

    </div>
  );
}

export default CandidateCard;