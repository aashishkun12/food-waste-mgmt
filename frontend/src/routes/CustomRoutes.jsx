import { Routes, Route, Navigate } from "react-router-dom";

import Mainlayout from "../layout/Mainlayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

import Home from "../pages/Home";
import Contact from "../pages/Contact";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";

import Users from "../pages/users/UsersPage";
import DonorDetails from "../pages/donors/DonorDetailsPage";
import Donors from "../pages/donors/FoodDonorsPage";
import Waste from "../pages/waste/WasteItemsPage";
import Centers from "../pages/centers/Centers";
import DispatchWastePage from "../pages/dispatch/DispatchWastePage";
import Processors from "../pages/processors/ProcessorsPage";
import Reports from "../pages/reports/Reports";
import ProfilePage from "../pages/profile/ProfilePage";
import DonationHistoryPage from "../pages/donors/DonationHistoryPage";

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
      <Route element={<AuthRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* DASHBOARD (PROTECTED) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/donor-details" element={<DonorDetails />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/centers" element={<Centers />} />
          <Route path="/dispatch_waste" element={<DispatchWastePage />} />
          <Route path="/processors" element={<Processors />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/donation-history" element={<DonationHistoryPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Route>
      </Route>

    </Routes>
  );
};

export default CustomRoutes;