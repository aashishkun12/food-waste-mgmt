import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    // If user not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If logged in
    return <Outlet />;
};

export default ProtectedRoute;