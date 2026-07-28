import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main>
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;