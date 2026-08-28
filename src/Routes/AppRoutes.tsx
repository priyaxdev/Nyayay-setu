import { Routes, Route } from "react-router";
import Welcome from "../pages/onboarding/Welcome";
import ChooseLanguage from "../pages/onboarding/ChooseLanguage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import PoliceLogin from "../pages/auth/PoliceLogin";
import PoliceSignup from "../pages/auth/PoliceSignup";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import SubmitComplaint from "../pages/citizen/SubmitComplaint";
import MyComplaints from "../pages/citizen/MyComplaints";
import TrackFIR from "../pages/citizen/TrackFIR";
import Profile from "../pages/citizen/Profile";
import HelpSupport from "../pages/citizen/HelpSupport";
import NearbyStation from "../pages/citizen/NearbyStation";
import PoliceDashboard from "../pages/police/PoliceDashboard";
import ComplaintDetail from "../pages/police/ComplaintDetail";
import ManageComplaints from "../pages/police/ManageComplaints";
import Analytics from "../pages/police/Analytics";
import PoliceSettings from "../pages/police/PoliceSettings";
import FIRManagement from "../pages/police/FIRManagement";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/language" element={<ChooseLanguage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/police/login" element={<PoliceLogin />} />
      <Route path="/police/signup" element={<PoliceSignup />} />

      {/* Citizen protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRole="CITIZEN"><CitizenDashboard /></ProtectedRoute>} />
      <Route path="/submit-complaint" element={<ProtectedRoute allowedRole="CITIZEN"><SubmitComplaint /></ProtectedRoute>} />
      <Route path="/my-complaints" element={<ProtectedRoute allowedRole="CITIZEN"><MyComplaints /></ProtectedRoute>} />
      <Route path="/track-fir/:id" element={<ProtectedRoute allowedRole="CITIZEN"><TrackFIR /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute allowedRole="CITIZEN"><HelpSupport /></ProtectedRoute>} />
      <Route path="/nearby-stations" element={<ProtectedRoute allowedRole="CITIZEN"><NearbyStation /></ProtectedRoute>} />

      {/* Police protected routes */}
      <Route path="/police/dashboard" element={<ProtectedRoute allowedRole="POLICE"><PoliceDashboard /></ProtectedRoute>} />
      <Route path="/police/complaints/:id" element={<ProtectedRoute allowedRole="POLICE"><ComplaintDetail /></ProtectedRoute>} />
      <Route path="/police/complaints" element={<ProtectedRoute allowedRole="POLICE"><ManageComplaints /></ProtectedRoute>} />
      <Route path="/police/analytics" element={<ProtectedRoute allowedRole="POLICE"><Analytics /></ProtectedRoute>} />
      <Route path="/police/settings" element={<ProtectedRoute allowedRole="POLICE"><PoliceSettings /></ProtectedRoute>} />
      <Route path="/police/fir-management" element={<ProtectedRoute allowedRole="POLICE"><FIRManagement /></ProtectedRoute>} />
    </Routes>
  );
}