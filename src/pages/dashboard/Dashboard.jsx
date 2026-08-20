import StatCard from "../../components/ui/StatCard";
import HiringFunnel from "../../components/ui/HiringFunnel";
import RecentApplications from "../../components/ui/RecentApplications";

function Dashboard() {
  return (
   <div className="min-h-screen bg-slate-50 p-8">
  {/* Heading */}
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Dashboard
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Hiring overview — updated 6 minutes ago
      </p>
    </div>

    <button className="rounded-lg bg-blue-700 px-4 py-1 text-sm font-semibold text-white transition hover:bg-blue-700">
      + New Requisition
    </button>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
    <StatCard
      title="Open Roles"
      value="14"
      subtitle="▲ 3 this month"
    />

    <StatCard
      title="Active Candidates"
      value="238"
      subtitle="▲ 41 this week"
    />

    <StatCard
      title="Offer Acceptance"
      value="78%"
      subtitle="▲ 5 pts vs Q2"
      showProgress
    />

    <StatCard
      title="Avg. Time to Hire"
      value="18d"
      subtitle="▼ 2d faster"
      subtitleColor="text-red-500"
    />
  </div>

  {/* Funnel + Recent Applications */}
  <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
    <HiringFunnel />

    <RecentApplications />
  </div>
</div>
  );
}

export default Dashboard;