function getScoreClass(score) {
  if (score >= 80) {
    return "bg-emerald-50 text-emerald-600";
  }

  if (score >= 60) {
    return "bg-blue-50 text-blue-600";
  }

  return "bg-red-50 text-red-500";
}

function CandidateCard({ candidate, onClick }) {
  const skills = candidate.skills || [];
  const tags = candidate.tags || [];

  return (
    <div
      onClick={() => onClick(candidate)}
      className="
        w-full
        max-w-[900px]
        cursor-pointer
        rounded-[9px]
        border
        border-slate-200
        bg-white
        px-6
        py-4
        shadow-sm
        transition
        hover:border-slate-300
        hover:shadow-md
      "
    >
      {/* NAME + SCORE */}
      <div className="flex items-center justify-between gap-5">
        <h3 className="truncate text-[13px] font-bold text-slate-900">
          {candidate.name}
        </h3>

        <span
          className={`
            shrink-0
            rounded-[5px]
            px-1.5
            py-[6px]
            text-[9px]
            font-bold
            ${getScoreClass(candidate.score)}
          `}
        >
          {candidate.score}
        </span>
      </div>

      {/* EXPERIENCE / SKILLS */}
      <p className="mt-[2px] truncate text-[11px] text-slate-500">
        {candidate.experience}

        {skills.length > 0 && (
          <>
            <span className="mx-1">·</span>
            {skills.slice(0, 2).join("/")}
          </>
        )}
      </p>

      {/* TAGS */}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="
                rounded-[4px]
                bg-slate-100
                px-2
                py-[3px]
                text-[8px]
                font-lg
                text-slate-600
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidateCard;