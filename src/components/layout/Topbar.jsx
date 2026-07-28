import { FaBars, FaMagnifyingGlass } from "react-icons/fa6";

function Topbar({ toggle }) {
  return (
    <header className="sticky top-0 h-16 w-full bg-white border-b border-slate-200">
      <div className="flex h-full items-center justify-between px-8">

       
        <div className="flex items-center gap-4 flex-1">

         
          <button
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white lg:hidden"
          >
            <FaBars />
          </button>

         
          <div className="hidden sm:flex h-10 w-90 items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
            <FaMagnifyingGlass className="text-slate-400 text-sm" />

            <input
              type="search"
              placeholder="Search candidates, jobs, requisition ID..."
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="hidden sm:block rounded-xl bg-violet-100 px-4 py-2">
            <p className="text-sm font-semibold text-violet-700">
              Super Admin
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
            SA
          </div>

        </div>

      </div>
    </header>
  );
}

export default Topbar;