const Dashboard = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="p-10">

            <h1 className="text-3xl font-bold mb-4">
                Dashboard
            </h1>

            <div className="bg-white shadow rounded p-6">

                <h2 className="text-xl font-semibold">
                    Welcome, {user?.username}
                </h2>

                <p className="text-gray-600 mt-2">
                    Role: {user?.role}
                </p>

            </div>

        </div>
    );
};

export default Dashboard;