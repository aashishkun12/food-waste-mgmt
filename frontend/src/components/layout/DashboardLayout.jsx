import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="flex">

            {/* Sidebar */}
            <Sidebar />

            {/* Page Content */}
            <div className="min-w-0 flex-1 overflow-x-auto bg-gray-100 min-h-screen p-3 pt-16 md:p-6">
                <Outlet />
            </div>

        </div>
    );
};

export default DashboardLayout;