// import { useNavigate, useLocation } from "react-router";
// import { useState } from "react";
// import {
//   LayoutDashboard,
//   ClipboardList,
//   FolderCheck,
//   BarChart3,
//   Settings as SettingsIcon,
//   LogOut,
//   ShieldCheck,
//   User,
//   Bell,
//   Lock,
//   Save,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// export default function PoliceSettings() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();
//   const [notifyNewComplaint, setNotifyNewComplaint] = useState(true);
//   const [notifyHighPriority, setNotifyHighPriority] = useState(true);

//   const handleLogout = () => {
//     logout();
//     navigate("/police/login");
//   };

//   const navItems = [
//     { icon: LayoutDashboard, label: "Dashboard", path: "/police/dashboard" },
//     { icon: ClipboardList, label: "Complaints", path: "/police/complaints" },
//     { icon: FolderCheck, label: "FIR Management", path: "/police/fir-management" },
//     { icon: BarChart3, label: "Analytics", path: "/police/analytics" },
//     { icon: SettingsIcon, label: "Settings", path: "/police/settings" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-100 flex">
//       <aside className="w-64 bg-blue-950 text-white flex flex-col flex-shrink-0">
//         <div className="px-5 py-5 border-b border-blue-900 flex items-center gap-2.5">
//           <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
//             <ShieldCheck size={20} />
//           </div>
//           <p className="font-bold text-base leading-none">Police Dashboard</p>
//         </div>
//         <nav className="flex-1 px-3 py-4 space-y-1">
//           {navItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => navigate(item.path)}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
//                 location.pathname === item.path
//                   ? "bg-blue-800 text-white"
//                   : "text-blue-100 hover:bg-blue-900/60"
//               }`}
//             >
//               <item.icon size={17} />
//               {item.label}
//             </button>
//           ))}
//         </nav>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-6 py-4 text-sm text-blue-200 border-t border-blue-900 hover:text-white transition cursor-pointer"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </aside>

//       <main className="flex-1 p-6 lg:p-8 max-w-3xl">
//         <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
//         <p className="text-sm text-slate-500 mb-6">Manage your officer profile and preferences.</p>

//         {/* Officer profile */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-xs">
//           <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <User size={17} className="text-blue-800" />
//             Officer Profile
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name</label>
//               <input
//                 type="text"
//                 defaultValue={user?.name || "Inspector A. Kumar"}
//                 className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1.5">Badge Number</label>
//               <input
//                 type="text"
//                 defaultValue="DL-4521"
//                 className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1.5">Station</label>
//               <input
//                 type="text"
//                 defaultValue="Rajiv Chowk Police Station"
//                 className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
//               <input
//                 type="email"
//                 defaultValue={user?.email || ""}
//                 disabled
//                 className="w-full border border-slate-300 bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Notification preferences */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-xs">
//           <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <Bell size={17} className="text-blue-800" />
//             Notification Preferences
//           </h2>
//           <div className="space-y-4">
//             <label className="flex items-center justify-between cursor-pointer">
//               <div>
//                 <p className="text-sm font-medium text-slate-800">New complaint alerts</p>
//                 <p className="text-xs text-slate-400">Get notified when a new complaint is filed</p>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={notifyNewComplaint}
//                 onChange={(e) => setNotifyNewComplaint(e.target.checked)}
//                 className="w-4 h-4 accent-blue-800"
//               />
//             </label>
//             <label className="flex items-center justify-between cursor-pointer">
//               <div>
//                 <p className="text-sm font-medium text-slate-800">High priority escalations</p>
//                 <p className="text-xs text-slate-400">Immediate alert for high-risk complaints</p>
//               </div>
//               <input
//                 type="checkbox"
//                 checked={notifyHighPriority}
//                 onChange={(e) => setNotifyHighPriority(e.target.checked)}
//                 className="w-4 h-4 accent-blue-800"
//               />
//             </label>
//           </div>
//         </div>

//         {/* Security */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-xs">
//           <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <Lock size={17} className="text-blue-800" />
//             Security
//           </h2>
//           <button className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer">
//             Change Password
//           </button>
//         </div>

//         <button className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-3.5 text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer">
//           <Save size={16} />
//           Save Changes
//         </button>
//       </main>
//     </div>
//   );
// }
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FolderCheck,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  User,
  Bell,
  Lock,
  Save,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function PoliceSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [notifyNewComplaint, setNotifyNewComplaint] = useState(true);
  const [notifyHighPriority, setNotifyHighPriority] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/police/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: t("policeNav.dashboard"), path: "/police/dashboard" },
    { icon: ClipboardList, label: t("policeNav.complaints"), path: "/police/complaints" },
    { icon: FolderCheck, label: t("policeNav.firManagement"), path: "/police/fir-management" },
    { icon: BarChart3, label: t("policeNav.analytics"), path: "/police/analytics" },
    { icon: SettingsIcon, label: t("policeNav.settings"), path: "/police/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-blue-950 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-blue-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <p className="font-bold text-base leading-none">{t("policeNav.title")}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                location.pathname === item.path ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-900/60"
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-blue-200 border-t border-blue-900 hover:text-white transition cursor-pointer"
        >
          <LogOut size={18} />
          {t("policeNav.logout")}
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{t("policeSettings.title")}</h1>
        <p className="text-sm text-slate-500 mb-6">{t("policeSettings.subtitle")}</p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-xs">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User size={17} className="text-blue-800" />
            {t("policeSettings.officerProfile")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{t("auth.fullNameLabel")}</label>
              <input
                type="text"
                defaultValue={user?.name || "Inspector A. Kumar"}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{t("policeAuth.badgeLabel")}</label>
              <input
                type="text"
                defaultValue="DL-4521"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{t("policeAuth.stationLabel")}</label>
              <input
                type="text"
                defaultValue="Rajiv Chowk Police Station"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{t("auth.emailLabel")}</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="w-full border border-slate-300 bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-xs">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bell size={17} className="text-blue-800" />
            {t("policeSettings.notificationPrefs")}
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-800">{t("policeSettings.newComplaintAlerts")}</p>
                <p className="text-xs text-slate-400">{t("policeSettings.newComplaintAlertsDesc")}</p>
              </div>
              <input
                type="checkbox"
                checked={notifyNewComplaint}
                onChange={(e) => setNotifyNewComplaint(e.target.checked)}
                className="w-4 h-4 accent-blue-800"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-800">{t("policeSettings.highPriorityEscalations")}</p>
                <p className="text-xs text-slate-400">{t("policeSettings.highPriorityEscalationsDesc")}</p>
              </div>
              <input
                type="checkbox"
                checked={notifyHighPriority}
                onChange={(e) => setNotifyHighPriority(e.target.checked)}
                className="w-4 h-4 accent-blue-800"
              />
            </label>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-xs">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lock size={17} className="text-blue-800" />
            {t("policeSettings.security")}
          </h2>
          <button className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer">
            {t("policeSettings.changePassword")}
          </button>
        </div>

        <button className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-3.5 text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer">
          <Save size={16} />
          {t("policeSettings.saveChanges")}
        </button>
      </main>
    </div>
  );
}