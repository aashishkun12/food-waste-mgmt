import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    // If logged in → redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not logged in → allow access
    return <Outlet />;
};

export default AuthRoute;