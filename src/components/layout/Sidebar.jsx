import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role;

    const menuItems = {
        ADMIN: [
            { name: "Dashboard", path: "/dashboard" },
            { name: "Donors", path: "/donors" },
            { name: "Waste Items", path: "/waste" },
            { name: "Centers", path: "/centers" },
            { name: "Reports", path: "/reports" },
            { name: "Users", path: "/users" },
        ],

        OPERATOR: [
            { name: "Dashboard", path: "/dashboard" },
            { name: "Donors", path: "/donors" },
            { name: "Waste Items", path: "/waste" },
            { name: "Centers", path: "/centers" },
            { name: "Reports", path: "/reports" },
        ],

        DONOR: [
            { name: "Dashboard", path: "/dashboard" },
        ],
    };

    const handleLogout = () => {

        // Remove logged in user
        localStorage.removeItem("user");

        // Redirect to login page
        navigate("/");
    };

    return (
        <div className="w-64 min-h-screen bg-green-800 text-white p-5 flex flex-col justify-between">

            <div>

                <h1 className="text-2xl font-bold mb-10">
                    Food Waste
                </h1>

                <div className="flex flex-col gap-4">

                    {menuItems[role]?.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="hover:text-green-300 transition"
                        >
                            {item.name}
                        </Link>
                    ))}

                </div>

            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 p-2 rounded mt-10"
            >
                Logout
            </button>

        </div>
    );
};

export default Sidebar;