// import { useNavigate, useLocation } from "react-router";
// import { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   ClipboardList,
//   FolderCheck,
//   BarChart3,
//   FileBarChart,
//   SettingsIcon,
//   LogOut,
//   Eye,
//   Plus,
//   Bot,
//   Sparkles,
//   ShieldCheck,
//   RefreshCw,
// } from "lucide-react";
// import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { fetchMyComplaints, type Complaint } from "../../services/api";
// import { useAuth } from "../../context/AuthContext";

// const statusStyles: Record<string, string> = {
//   SUBMITTED: "bg-slate-100 text-slate-700",
//   Submitted: "bg-slate-100 text-slate-700",
//   UNDER_REVIEW: "bg-blue-100 text-blue-800",
//   "Under Review": "bg-blue-100 text-blue-800",
//   INVESTIGATING: "bg-blue-100 text-blue-800",
//   ASSIGNED: "bg-blue-100 text-blue-800",
//   FIR_DRAFT_GENERATED: "bg-amber-100 text-amber-800",
//   "FIR Drafted": "bg-amber-100 text-amber-800",
//   "FIR Draft Generated": "bg-amber-100 text-amber-800",
//   OFFICER_VERIFICATION: "bg-orange-100 text-orange-800",
//   "Officer Verification": "bg-orange-100 text-orange-800",
//   FIR_REGISTERED: "bg-green-100 text-green-800",
//   "FIR Registered": "bg-green-100 text-green-800",
//   CLOSED: "bg-emerald-100 text-emerald-800",
//   Closed: "bg-emerald-100 text-emerald-800",
//   RESOLVED: "bg-emerald-100 text-emerald-800",
// };

// const pieColors = ["#1e3a8a", "#2563eb", "#f59e0b", "#0d9488", "#7c3aed", "#94a3b8"];

// export default function PoliceDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();
//   const [complaints, setComplaints] = useState<Complaint[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetchMyComplaints();
//       setComplaints(res.complaints || []);
//     } catch (err) {
//       console.warn("Could not load complaints for police dashboard:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

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

//   // Dynamic stats calculated from real MongoDB records
//   const totalCount = complaints.length;
//   const underReviewCount = complaints.filter(
//     (c) =>
//       c.status === "UNDER_REVIEW" ||
//       c.status === "Under Review" ||
//       c.status === "INVESTIGATING" ||
//       c.status === "ASSIGNED"
//   ).length;
//   const firDraftedCount = complaints.filter(
//     (c) =>
//       c.status === "FIR_DRAFT_GENERATED" ||
//       c.status === "FIR Drafted" ||
//       c.status === "FIR Draft Generated" ||
//       c.status === "OFFICER_VERIFICATION"
//   ).length;
//   const firRegisteredCount = complaints.filter(
//     (c) => c.status === "FIR_REGISTERED" || c.status === "FIR Registered"
//   ).length;
//   const closedCount = complaints.filter(
//     (c) => c.status === "CLOSED" || c.status === "Closed" || c.status === "RESOLVED"
//   ).length;

//   const dynamicStats = [
//     { label: "Total Complaints", value: totalCount.toString(), change: `${totalCount} records`, note: "In Database" },
//     { label: "Under Review", value: underReviewCount.toString(), change: `${underReviewCount} pending`, note: "Active cases" },
//     { label: "FIR Drafted", value: firDraftedCount.toString(), change: `${firDraftedCount} ready`, note: "Needs review" },
//     { label: "FIR Registered", value: firRegisteredCount.toString(), change: `${firRegisteredCount} active`, note: "Registered" },
//     { label: "Closed Cases", value: closedCount.toString(), change: `${closedCount} resolved`, note: "Completed" },
//   ];

//   // Dynamic incident types
//   const typeMap: Record<string, number> = {};
//   complaints.forEach((c) => {
//     const t = c.incidentType || "General Incident";
//     typeMap[t] = (typeMap[t] || 0) + 1;
//   });

//   const dynamicTypes = Object.entries(typeMap)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5)
//     .map(([name, value], i) => ({
//       name,
//       value,
//       color: pieColors[i % pieColors.length],
//     }));

//   const chartTypes = dynamicTypes.length > 0 ? dynamicTypes : [
//     { name: "Complaints", value: 1, color: "#1e3a8a" },
//   ];

//   const topReasonsList = Object.entries(typeMap)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5)
//     .map(([label, value]) => ({ label, value }));

//   const trendMap: Record<string, number> = {};
//   complaints.forEach((c) => {
//     const d = c.createdAt
//       ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
//       : c.date || "Recent";
//     trendMap[d] = (trendMap[d] || 0) + 1;
//   });

//   const dynamicTrend = Object.entries(trendMap)
//     .slice(-5)
//     .map(([date, value]) => ({ date, value }));

//   const trendData = dynamicTrend.length >= 2 ? dynamicTrend : [
//     { date: "Start", value: Math.max(1, Math.floor(totalCount / 2)) },
//     { date: "Current", value: totalCount },
//   ];

//   const recentList = complaints.slice(0, 6);

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
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navItems.map((item, i) => (
//             <button
//               key={item.label + i}
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
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
//             <p className="text-sm text-slate-500 mt-1">
//               Live Overview of Citizen Complaints in MongoDB
//             </p>
//           </div>
//           <div className="flex items-center gap-3 flex-wrap">
//             <button
//               onClick={loadData}
//               title="Refresh database records"
//               className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3.5 py-2 shadow-xs hover:bg-slate-50 transition cursor-pointer"
//             >
//               <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
//               Refresh Data
//             </button>
//             <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg pl-1.5 pr-3.5 py-1.5 shadow-xs">
//               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">
//                 {(user?.name || "Officer")
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")
//                   .slice(0, 2)
//                   .toUpperCase()}
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-slate-800 leading-none">
//                   {user?.name || "Police Officer"}
//                 </p>
//                 <p className="text-[10px] text-slate-400 mt-0.5">Delhi Police</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//           {dynamicStats.map((s) => (
//             <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
//               <p className="text-xs text-slate-500">{s.label}</p>
//               <div className="flex items-center gap-2 mt-1">
//                 <p className="text-2xl font-bold text-slate-900">{s.value}</p>
//               </div>
//               <p className="text-[11px] text-slate-400 mt-1">{s.note}</p>
//             </div>
//           ))}
//         </div>

//         {/* Charts row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//           {/* Pie chart */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-3">Complaints by Type</h2>
//             <div className="flex items-center gap-4">
//               <div className="w-28 h-28 flex-shrink-0">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={chartTypes}
//                       dataKey="value"
//                       innerRadius={28}
//                       outerRadius={50}
//                       paddingAngle={2}
//                     >
//                       {chartTypes.map((entry, i) => (
//                         <Cell key={i} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="space-y-1.5 flex-1 max-h-36 overflow-y-auto">
//                 {chartTypes.map((c) => {
//                   const total = chartTypes.reduce((sum, x) => sum + x.value, 0) || 1;
//                   const pct = Math.round((c.value / total) * 100);
//                   return (
//                     <div key={c.name} className="flex items-center justify-between text-xs">
//                       <span className="flex items-center gap-1.5 text-slate-600 truncate max-w-[110px]" title={c.name}>
//                         <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
//                         <span className="truncate">{c.name}</span>
//                       </span>
//                       <span className="font-semibold text-slate-800 flex-shrink-0">
//                         {c.value} <span className="text-slate-400">· {pct}%</span>
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Line chart */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-3">Complaints Trend</h2>
//             <div className="h-40">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={trendData}>
//                   <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Top reasons */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-3">Top Incident Types</h2>
//             <div className="space-y-2.5">
//               {topReasonsList.length === 0 ? (
//                 <p className="text-xs text-slate-400">No records yet.</p>
//               ) : (
//                 topReasonsList.map((r) => (
//                   <div key={r.label} className="flex items-center justify-between text-xs">
//                     <span className="text-slate-600 truncate max-w-[160px]">{r.label}</span>
//                     <span className="font-bold text-slate-800">{r.value}</span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Recent complaints + quick access */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-x-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-sm font-bold text-slate-800">Recent Complaints</h2>
//               <button
//                 onClick={() => navigate("/police/complaints")}
//                 className="text-xs font-semibold text-blue-800 hover:text-blue-950 transition cursor-pointer"
//               >
//                 View All ({complaints.length})
//               </button>
//             </div>
//             <table className="w-full text-xs">
//               <thead>
//                 <tr className="text-slate-400 text-left border-b border-slate-100">
//                   <th className="pb-2 font-medium">ID</th>
//                   <th className="pb-2 font-medium">Complainant</th>
//                   <th className="pb-2 font-medium">Type</th>
//                   <th className="pb-2 font-medium">Location</th>
//                   <th className="pb-2 font-medium">Status</th>
//                   <th className="pb-2 font-medium">Submitted On</th>
//                   <th className="pb-2 font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentList.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-8 text-slate-400">
//                       {loading ? "Loading complaints..." : "No complaints found."}
//                     </td>
//                   </tr>
//                 ) : (
//                   recentList.map((c) => {
//                     const complainantName =
//                       c.victimName ||
//                       c.victim?.name ||
//                       (c.user && typeof c.user === "object" ? c.user.name : null) ||
//                       "Citizen Complainant";
//                     const displayDate = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent");
//                     const statusLabel = c.status.replace(/_/g, " ");

//                     return (
//                       <tr key={c.complaintId} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
//                         <td className="py-3 font-mono font-semibold text-slate-800">{c.complaintId}</td>
//                         <td className="py-3 text-slate-600">{complainantName}</td>
//                         <td className="py-3 text-slate-600 capitalize">{c.incidentType || "General"}</td>
//                         <td className="py-3 text-slate-500 truncate max-w-[120px]">{c.location || "Delhi"}</td>
//                         <td className="py-3">
//                           <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[c.status] || "bg-slate-100 text-slate-700"}`}>
//                             {statusLabel}
//                           </span>
//                         </td>
//                         <td className="py-3 text-slate-400">{displayDate}</td>
//                         <td className="py-3">
//                           <button
//                             onClick={() => navigate(`/police/complaints/${c.complaintId}`)}
//                             className="text-slate-400 hover:text-blue-800 transition cursor-pointer"
//                             title="Review Complaint"
//                           >
//                             <Eye size={15} />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Quick access */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
//             <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Access</h2>
//             <div className="space-y-2">
//               <button
//                 onClick={() => navigate("/police/complaints")}
//                 className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
//               >
//                 <Plus size={16} className="text-blue-800" />
//                 New Complaint
//               </button>
//               <button
//                 onClick={() => navigate("/police/complaints")}
//                 className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
//               >
//                 <Bot size={16} className="text-blue-800" />
//                 AI Legal Assistant
//               </button>
//               <button
//                 onClick={() => navigate("/police/complaints")}
//                 className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
//               >
//                 <Sparkles size={16} className="text-blue-800" />
//                 Generate FIR Draft
//               </button>
//               <button
//                 onClick={() => navigate("/police/analytics")}
//                 className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
//               >
//                 <BarChart3 size={16} className="text-blue-800" />
//                 Analytics Dashboard
//               </button>
//               <button
//                 onClick={() => navigate("/police/analytics")}
//                 className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
//               >
//                 <FileBarChart size={16} className="text-blue-800" />
//                 View Reports
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FolderCheck,
  BarChart3,
  FileBarChart,
  SettingsIcon,
  LogOut,
  Eye,
  Plus,
  Bot,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { fetchMyComplaints, type Complaint } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-slate-100 text-slate-700",
  Submitted: "bg-slate-100 text-slate-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  "Under Review": "bg-blue-100 text-blue-800",
  INVESTIGATING: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  FIR_DRAFT_GENERATED: "bg-amber-100 text-amber-800",
  "FIR Drafted": "bg-amber-100 text-amber-800",
  "FIR Draft Generated": "bg-amber-100 text-amber-800",
  OFFICER_VERIFICATION: "bg-orange-100 text-orange-800",
  "Officer Verification": "bg-orange-100 text-orange-800",
  FIR_REGISTERED: "bg-green-100 text-green-800",
  "FIR Registered": "bg-green-100 text-green-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
  Closed: "bg-emerald-100 text-emerald-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
};

const pieColors = ["#1e3a8a", "#2563eb", "#f59e0b", "#0d9488", "#7c3aed", "#94a3b8"];

export default function PoliceDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchMyComplaints();
      setComplaints(res.complaints || []);
    } catch (err) {
      console.warn("Could not load complaints for police dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const totalCount = complaints.length;
  const underReviewCount = complaints.filter(
    (c) =>
      c.status === "UNDER_REVIEW" ||
      c.status === "Under Review" ||
      c.status === "INVESTIGATING" ||
      c.status === "ASSIGNED"
  ).length;
  const firDraftedCount = complaints.filter(
    (c) =>
      c.status === "FIR_DRAFT_GENERATED" ||
      c.status === "FIR Drafted" ||
      c.status === "FIR Draft Generated" ||
      c.status === "OFFICER_VERIFICATION"
  ).length;
  const firRegisteredCount = complaints.filter(
    (c) => c.status === "FIR_REGISTERED" || c.status === "FIR Registered"
  ).length;
  const closedCount = complaints.filter(
    (c) => c.status === "CLOSED" || c.status === "Closed" || c.status === "RESOLVED"
  ).length;

  const dynamicStats = [
    { label: t("policeDashboard.statTotal"), value: totalCount.toString(), note: t("policeDashboard.noteInDatabase") },
    { label: t("policeDashboard.statUnderReview"), value: underReviewCount.toString(), note: t("policeDashboard.noteActiveCases") },
    { label: t("policeDashboard.statFirDrafted"), value: firDraftedCount.toString(), note: t("policeDashboard.noteNeedsReview") },
    { label: t("policeDashboard.statFirRegistered"), value: firRegisteredCount.toString(), note: t("policeDashboard.noteRegistered") },
    { label: t("policeDashboard.statClosed"), value: closedCount.toString(), note: t("policeDashboard.noteCompleted") },
  ];

  const typeMap: Record<string, number> = {};
  complaints.forEach((c) => {
    const key = c.incidentType || t("dashboard.genericIncident");
    typeMap[key] = (typeMap[key] || 0) + 1;
  });

  const dynamicTypes = Object.entries(typeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], i) => ({ name, value, color: pieColors[i % pieColors.length] }));

  const chartTypes = dynamicTypes.length > 0 ? dynamicTypes : [{ name: t("policeDashboard.complaintsLabel"), value: 1, color: "#1e3a8a" }];

  const topReasonsList = Object.entries(typeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));

  const trendMap: Record<string, number> = {};
  complaints.forEach((c) => {
    const d = c.createdAt
      ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : c.date || t("dashboard.recentFallback");
    trendMap[d] = (trendMap[d] || 0) + 1;
  });

  const dynamicTrend = Object.entries(trendMap).slice(-5).map(([date, value]) => ({ date, value }));

  const trendData = dynamicTrend.length >= 2 ? dynamicTrend : [
    { date: t("policeDashboard.trendStart"), value: Math.max(1, Math.floor(totalCount / 2)) },
    { date: t("policeDashboard.trendCurrent"), value: totalCount },
  ];

  const recentList = complaints.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-blue-950 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-blue-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <p className="font-bold text-base leading-none">{t("policeNav.title")}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <button
              key={item.label + i}
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("policeDashboard.title")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("policeDashboard.subtitle")}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadData}
              title={t("policeDashboard.refreshTitle")}
              className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3.5 py-2 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              {t("policeDashboard.refreshData")}
            </button>
            <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg pl-1.5 pr-3.5 py-1.5 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">
                {(user?.name || "Officer").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || t("policeDashboard.defaultOfficerName")}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t("policeDashboard.delhiPolice")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {dynamicStats.map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <p className="text-xs text-slate-500">{s.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3">{t("policeDashboard.complaintsByType")}</h2>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartTypes} dataKey="value" innerRadius={28} outerRadius={50} paddingAngle={2}>
                      {chartTypes.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex-1 max-h-36 overflow-y-auto">
                {chartTypes.map((c) => {
                  const total = chartTypes.reduce((sum, x) => sum + x.value, 0) || 1;
                  const pct = Math.round((c.value / total) * 100);
                  return (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600 truncate max-w-[110px]" title={c.name}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="truncate">{c.name}</span>
                      </span>
                      <span className="font-semibold text-slate-800 flex-shrink-0">
                        {c.value} <span className="text-slate-400">· {pct}%</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3">{t("policeDashboard.complaintsTrend")}</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3">{t("policeDashboard.topIncidentTypes")}</h2>
            <div className="space-y-2.5">
              {topReasonsList.length === 0 ? (
                <p className="text-xs text-slate-400">{t("policeDashboard.noRecordsYet")}</p>
              ) : (
                topReasonsList.map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[160px]">{r.label}</span>
                    <span className="font-bold text-slate-800">{r.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">{t("policeDashboard.recentComplaints")}</h2>
              <button
                onClick={() => navigate("/police/complaints")}
                className="text-xs font-semibold text-blue-800 hover:text-blue-950 transition cursor-pointer"
              >
                {t("dashboard.viewAll")} ({complaints.length})
              </button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-100">
                  <th className="pb-2 font-medium">{t("policeDashboard.colId")}</th>
                  <th className="pb-2 font-medium">{t("policeDashboard.colComplainant")}</th>
                  <th className="pb-2 font-medium">{t("policeDashboard.colType")}</th>
                  <th className="pb-2 font-medium">{t("policeDashboard.colLocation")}</th>
                  <th className="pb-2 font-medium">{t("policeDashboard.colStatus")}</th>
                  <th className="pb-2 font-medium">{t("policeDashboard.colSubmittedOn")}</th>
                  <th className="pb-2 font-medium">{t("policeDashboard.colAction")}</th>
                </tr>
              </thead>
              <tbody>
                {recentList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      {loading ? t("policeDashboard.loadingComplaints") : t("policeDashboard.noComplaintsFound")}
                    </td>
                  </tr>
                ) : (
                  recentList.map((c) => {
                    const complainantName =
                      c.victimName ||
                      c.victim?.name ||
                      (c.user && typeof c.user === "object" ? c.user.name : null) ||
                      t("policeDashboard.defaultComplainant");
                    const displayDate = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : t("dashboard.recentFallback"));
                    const statusLabel = c.status.replace(/_/g, " ");

                    return (
                      <tr key={c.complaintId} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                        <td className="py-3 font-mono font-semibold text-slate-800">{c.complaintId}</td>
                        <td className="py-3 text-slate-600">{complainantName}</td>
                        <td className="py-3 text-slate-600 capitalize">{c.incidentType || t("policeDashboard.general")}</td>
                        <td className="py-3 text-slate-500 truncate max-w-[120px]">{c.location || "Delhi"}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[c.status] || "bg-slate-100 text-slate-700"}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">{displayDate}</td>
                        <td className="py-3">
                          <button
                            onClick={() => navigate(`/police/complaints/${c.complaintId}`)}
                            className="text-slate-400 hover:text-blue-800 transition cursor-pointer"
                            title={t("policeDashboard.reviewComplaint")}
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{t("policeDashboard.quickAccess")}</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/police/complaints")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <Plus size={16} className="text-blue-800" />
                {t("policeDashboard.newComplaint")}
              </button>
              <button
                onClick={() => navigate("/police/complaints")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <Bot size={16} className="text-blue-800" />
                {t("policeDashboard.aiLegalAssistant")}
              </button>
              <button
                onClick={() => navigate("/police/complaints")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <Sparkles size={16} className="text-blue-800" />
                {t("policeDashboard.generateFirDraft")}
              </button>
              <button
                onClick={() => navigate("/police/analytics")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <BarChart3 size={16} className="text-blue-800" />
                {t("policeDashboard.analyticsDashboard")}
              </button>
              <button
                onClick={() => navigate("/police/analytics")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <FileBarChart size={16} className="text-blue-800" />
                {t("policeDashboard.viewReports")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}