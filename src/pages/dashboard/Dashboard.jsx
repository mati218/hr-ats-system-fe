import StatCard from "../../components/ui/StatCard";
import HiringFunnel from "../../components/ui/HiringFunnel";
import RecentApplications from "../../components/ui/RecentApplications";

const stats = [
  {
    title: "OPEN ROLES",
    value: "14",
    sub: "▲ 3 this month",
    color: "text-green-600",
  },
  {
    title: "ACTIVE CANDIDATES",
    value: "238",
    sub: "▲ 41 this week",
    color: "text-green-600",
  },
  {
    title: "OFFER ACCEPTANCE",
    value: "78%",
    sub: "▲ 5 pts vs Q2",
    color: "text-green-600",
    progress: true,
  },
  {
    title: "AVG. TIME TO HIRE",
    value: "18d",
    sub: "▼ 2d faster",
    color: "text-red-500",
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6 flex items-start justify-between  text-left">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Hiring overview — updated 6 minutes ago
          </p>
        </div>
        <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">
          + New Requisition
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.sub}
            subtitleColor={item.color}
            showProgress={item.progress}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HiringFunnel />
        </div>
        <RecentApplications />
      </div>
    </div>
  );
}

export default Dashboard;