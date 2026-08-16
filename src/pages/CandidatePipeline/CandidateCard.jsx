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
        mb-3
        cursor-pointer
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-3
        shadow-sm
        transition
        hover:border-slate-300
        hover:shadow-md
      "
    >
      {/* NAME + SCORE */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-[14px] font-bold text-slate-900">
          {candidate.name}
        </h3>

        <span
          className={`
            shrink-0
            rounded-full
            px-2.5
            py-1
            text-[12px]
            font-bold
            ${getScoreClass(candidate.score)}
          `}
        >
          {candidate.score}
        </span>
      </div>

      <p className="mt-1 truncate text-[12.5px] text-slate-500">
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
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="
                rounded-md
                bg-slate-100
                px-2
                py-1
                text-[11px]
                font-medium
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