import { Routes, Route } from "react-router";
import Welcome from "../pages/onboarding/Welcome";
import ChooseLanguage from "../pages/onboarding/ChooseLanguage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/language" element={<ChooseLanguage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<CitizenDashboard />} />
      <Route path="/submit-complaint" element={<SubmitComplaint />} />
      <Route path="/my-complaints" element={<MyComplaints />} />
      <Route path="/track-fir/:id" element={<TrackFIR />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/help" element={<HelpSupport />} />
      <Route path="/nearby-stations" element={<NearbyStation />} />
      <Route path="/police/dashboard" element={<PoliceDashboard />} />
      <Route path="/police/complaints/:id" element={<ComplaintDetail />} />
      <Route path="/police/complaints" element={<ManageComplaints />} />
      <Route path="/police/analytics" element={<Analytics />} />
      <Route path="/police/settings" element={<PoliceSettings />} />
      <Route path="/police/fir-management" element={<FIRManagement />} />
    </Routes>
  );
}