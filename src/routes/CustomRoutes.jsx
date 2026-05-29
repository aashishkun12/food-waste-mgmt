import { Routes, Route } from "react-router-dom";

import Mainlayout from "../layout/Mainlayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

import Home from "../pages/Home";
import Contact from "../pages/Contact";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "../auth/ProtectedRoute";
import AuthRoute from "../auth/AuthRoute";

const CustomRoutes = () => {

    return (
        <Routes>

            {/* MAIN WEBSITE */}
            <Route element={<Mainlayout />}>

                <Route path="/" element={<Home />} />

                <Route path="/contact" element={<Contact />} />

            </Route>

            {/* AUTH */}
            {/* AUTH ROUTES */}
            <Route element={<AuthRoute />}>

                <Route element={<AuthLayout />}>

                    <Route path="/login" element={<Login />} />

                    <Route path="/signup" element={<Signup />} />

                </Route>

            </Route>

            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                </Route>

            </Route>

        </Routes>
    );
};

export default CustomRoutes;