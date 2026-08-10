function ScoreCircle({ score, color }) {
  const borderColor =
    color === "green"
      ? "border-emerald-600"
      : "border-amber-500";
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-[5px] ${borderColor}`}>
      <span className="text-lg font-bold text-slate-900"> {score}</span>
    </div>);}
export default ScoreCircle;