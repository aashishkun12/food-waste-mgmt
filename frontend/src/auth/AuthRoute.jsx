import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
    const token = localStorage.getItem("wfms_token");
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        localStorage.removeItem("user");
    }

    if (token && user) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not logged in → allow access
    return <Outlet />;
};

export default AuthRoute;