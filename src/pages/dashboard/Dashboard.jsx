const Dashboard = () => {
  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f5f7fb] px-8 py-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-base text-gray-500">
          Hiring overview -- updated 6 minutes ago.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Employees</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">60</h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Candidates</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">10</h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Interviews</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">6</h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Open Jobs</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">4</h2>
        </div>
      </div>


      <div className="mt-8 flex h-105 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            COMING SOON...
          </h2>

          <p className="mt-3 text-gray-500">
            Dashboard widgets and analytics will appear here.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;