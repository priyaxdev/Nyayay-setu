// import { useNavigate, useLocation } from "react-router";
// import {
//   LayoutDashboard,
//   ClipboardList,
//   BarChart3,
//   SettingsIcon,
//   LogOut,
//   ShieldCheck,
//   TrendingUp,
//   MapPin,
//   Clock,
//   AlertTriangle,
//   FolderCheck,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import { useAuth } from "../../context/AuthContext";

// const monthlyTrend = [
//   { month: "Jan", complaints: 210 },
//   { month: "Feb", complaints: 185 },
//   { month: "Mar", complaints: 240 },
//   { month: "Apr", complaints: 260 },
//   { month: "May", complaints: 320 },
// ];

// const crimeByType = [
//   { type: "Theft", count: 420 },
//   { type: "Assault", count: 310 },
//   { type: "Fraud", count: 250 },
//   { type: "Harassment", count: 190 },
//   { type: "Others", count: 130 },
// ];

// const hotspots = [
//   { area: "Rajiv Chowk", incidents: 84, trend: "up", riskLevel: "High" },
//   { area: "Karol Bagh", incidents: 61, trend: "up", riskLevel: "High" },
//   { area: "Lajpat Nagar", incidents: 47, trend: "down", riskLevel: "Medium" },
//   { area: "Dwarka Sector 12", incidents: 38, trend: "up", riskLevel: "Medium" },
//   { area: "Rohini", incidents: 22, trend: "down", riskLevel: "Low" },
// ];

// const timePatterns = [
//   { slot: "6 AM - 10 AM", pct: 12 },
//   { slot: "10 AM - 2 PM", pct: 18 },
//   { slot: "2 PM - 6 PM", pct: 22 },
//   { slot: "6 PM - 10 PM", pct: 34 },
//   { slot: "10 PM - 6 AM", pct: 14 },
// ];

// const riskStyles: Record<string, string> = {
//   High: "bg-red-100 text-red-700",
//   Medium: "bg-amber-100 text-amber-700",
//   Low: "bg-green-100 text-green-700",
// };

// export default function Analytics() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/police/login");
//   };

//   const navItems = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/police/dashboard" },
//   { icon: ClipboardList, label: "Complaints", path: "/police/complaints" },
//   { icon: FolderCheck, label: "FIR Management", path: "/police/fir-management" },
//   { icon: BarChart3, label: "Analytics", path: "/police/analytics" },
//   { icon: SettingsIcon, label: "Settings", path: "/police/settings" },
// ];

//   return (
//     <div className="min-h-screen bg-slate-100 flex">
//       {/* Sidebar */}
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

//       {/* Main content */}
//       <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-slate-900">Monthly Crime Analytics</h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Identify hotspots, recurring patterns, and rising trends to support resource allocation.
//           </p>
//         </div>

//         {/* Top summary cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
//             <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-2">
//               <AlertTriangle size={17} />
//             </div>
//             <p className="text-xl font-bold text-slate-900">3 Zones</p>
//             <p className="text-xs text-slate-500">Flagged as high-risk this month</p>
//           </div>
//           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
//             <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
//               <TrendingUp size={17} />
//             </div>
//             <p className="text-xl font-bold text-slate-900">+18%</p>
//             <p className="text-xs text-slate-500">Complaints vs last month</p>
//           </div>
//           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
//             <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
//               <Clock size={17} />
//             </div>
//             <p className="text-xl font-bold text-slate-900">6-10 PM</p>
//             <p className="text-xs text-slate-500">Peak incident time window</p>
//           </div>
//           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
//             <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center mb-2">
//               <MapPin size={17} />
//             </div>
//             <p className="text-xl font-bold text-slate-900">Rajiv Chowk</p>
//             <p className="text-xs text-slate-500">Most reported area</p>
//           </div>
//         </div>

//         {/* Charts row */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-4">Monthly Complaint Trend</h2>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={monthlyTrend}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                   <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="complaints" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 4 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-4">Recurring Crime Types</h2>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={crimeByType}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                   <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Hotspots + time patterns */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-4">Crime Hotspots</h2>
//             <div className="space-y-3">
//               {hotspots.map((h) => (
//                 <div key={h.area} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
//                   <div className="flex items-center gap-2.5">
//                     <MapPin size={15} className="text-slate-400" />
//                     <div>
//                       <p className="text-sm font-semibold text-slate-800">{h.area}</p>
//                       <p className="text-xs text-slate-400">{h.incidents} incidents this month</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${riskStyles[h.riskLevel]}`}>
//                       {h.riskLevel}
//                     </span>
//                     <TrendingUp
//                       size={14}
//                       className={h.trend === "up" ? "text-red-500" : "text-green-500 rotate-180"}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-4">Incidents by Time of Day</h2>
//             <div className="space-y-3">
//               {timePatterns.map((t) => (
//                 <div key={t.slot}>
//                   <div className="flex items-center justify-between text-xs mb-1">
//                     <span className="text-slate-600 font-medium">{t.slot}</span>
//                     <span className="text-slate-800 font-bold">{t.pct}%</span>
//                   </div>
//                   <div className="w-full bg-slate-100 rounded-full h-2">
//                     <div
//                       className="bg-blue-800 h-2 rounded-full transition-all"
//                       style={{ width: `${t.pct}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  SettingsIcon,
  LogOut,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  AlertTriangle,
  FolderCheck,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const monthlyTrend = [
  { month: "Jan", complaints: 210 },
  { month: "Feb", complaints: 185 },
  { month: "Mar", complaints: 240 },
  { month: "Apr", complaints: 260 },
  { month: "May", complaints: 320 },
];

const crimeByType = [
  { type: "Theft", count: 420 },
  { type: "Assault", count: 310 },
  { type: "Fraud", count: 250 },
  { type: "Harassment", count: 190 },
  { type: "Others", count: 130 },
];

const hotspots = [
  { area: "Rajiv Chowk", incidents: 84, trend: "up", riskLevel: "High" },
  { area: "Karol Bagh", incidents: 61, trend: "up", riskLevel: "High" },
  { area: "Lajpat Nagar", incidents: 47, trend: "down", riskLevel: "Medium" },
  { area: "Dwarka Sector 12", incidents: 38, trend: "up", riskLevel: "Medium" },
  { area: "Rohini", incidents: 22, trend: "down", riskLevel: "Low" },
];

const timePatterns = [
  { slot: "6 AM - 10 AM", pct: 12 },
  { slot: "10 AM - 2 PM", pct: 18 },
  { slot: "2 PM - 6 PM", pct: 22 },
  { slot: "6 PM - 10 PM", pct: 34 },
  { slot: "10 PM - 6 AM", pct: 14 },
];

const riskStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

export default function Analytics() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { logout } = useAuth();

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

  const riskLabelKey: Record<string, string> = {
    High: "analytics.riskHigh",
    Medium: "analytics.riskMedium",
    Low: "analytics.riskLow",
  };

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

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{t("analytics.title")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("analytics.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-2">
              <AlertTriangle size={17} />
            </div>
            <p className="text-xl font-bold text-slate-900">{t("analytics.zonesFlagged")}</p>
            <p className="text-xs text-slate-500">{t("analytics.zonesFlaggedDesc")}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
              <TrendingUp size={17} />
            </div>
            <p className="text-xl font-bold text-slate-900">+18%</p>
            <p className="text-xs text-slate-500">{t("analytics.vsLastMonth")}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
              <Clock size={17} />
            </div>
            <p className="text-xl font-bold text-slate-900">6-10 PM</p>
            <p className="text-xs text-slate-500">{t("analytics.peakTimeWindow")}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center mb-2">
              <MapPin size={17} />
            </div>
            <p className="text-xl font-bold text-slate-900">Rajiv Chowk</p>
            <p className="text-xs text-slate-500">{t("analytics.mostReportedArea")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{t("analytics.monthlyTrend")}</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{t("analytics.recurringTypes")}</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crimeByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{t("analytics.crimeHotspots")}</h2>
            <div className="space-y-3">
              {hotspots.map((h) => (
                <div key={h.area} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{h.area}</p>
                      <p className="text-xs text-slate-400">{h.incidents} {t("analytics.incidentsThisMonth")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${riskStyles[h.riskLevel]}`}>
                      {t(riskLabelKey[h.riskLevel])}
                    </span>
                    <TrendingUp size={14} className={h.trend === "up" ? "text-red-500" : "text-green-500 rotate-180"} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{t("analytics.incidentsByTime")}</h2>
            <div className="space-y-3">
              {timePatterns.map((t2) => (
                <div key={t2.slot}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{t2.slot}</span>
                    <span className="text-slate-800 font-bold">{t2.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-800 h-2 rounded-full transition-all" style={{ width: `${t2.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}