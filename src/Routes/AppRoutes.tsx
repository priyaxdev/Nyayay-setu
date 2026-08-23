// src/routes/AppRoutes.tsx
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
    </Routes>
  );
}