import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  ClipboardList,
  FolderCheck,
  BarChart3,
  FileBarChart,
  SettingsIcon,
  LogOut,
  Bell,
  Filter,
  TrendingUp,
  Eye,
  Plus,
  Bot,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext";

const stats = [
  { label: "Total Complaints", value: "1,520", change: "+12%", note: "This Month" },
  { label: "Under Review", value: "450", change: "+8%", note: "Pending" },
  { label: "FIR Drafted", value: "210", change: "+10%", note: "This Month" },
  { label: "FIR Registered", value: "320", change: "+15%", note: "This Month" },
  { label: "Closed Cases", value: "750", change: "+9%", note: "This Month" },
];

const complaintsByType = [
  { name: "Theft", value: 420, color: "#1e3a8a" },
  { name: "Assault", value: 310, color: "#2563eb" },
  { name: "Harassment", value: 250, color: "#f59e0b" },
  { name: "Fraud", value: 190, color: "#0d9488" },
  { name: "Others", value: 350, color: "#94a3b8" },
];

const trendData = [
  { date: "1 May", value: 60 },
  { date: "8 May", value: 90 },
  { date: "15 May", value: 75 },
  { date: "22 May", value: 130 },
  { date: "31 May", value: 160 },
];

const topReasons = [
  { label: "Vehicle Theft", value: 180 },
  { label: "Mobile Snatching", value: 150 },
  { label: "Physical Assault", value: 120 },
  { label: "Cyber Fraud", value: 100 },
  { label: "Public Harassment", value: 80 },
];

const recentComplaints = [
  { id: "CMP12345", complainant: "Rohit Sharma", type: "Theft", location: "Lajpat Nagar, Delhi", status: "Under Review", date: "18 May 2026" },
  { id: "CMP12346", complainant: "Anjali Verma", type: "Assault", location: "Karol Bagh, Delhi", status: "FIR Drafted", date: "18 May 2026" },
  { id: "CMP12347", complainant: "Mohit Kumar", type: "Harassment", location: "Patel Nagar, Delhi", status: "Submitted", date: "17 May 2026" },
  { id: "CMP12348", complainant: "Neha Singh", type: "Fraud", location: "Dwarka, Delhi", status: "FIR Registered", date: "17 May 2026" },
  { id: "CMP12349", complainant: "Suresh Yadav", type: "Theft", location: "Rohini, Delhi", status: "Closed", date: "16 May 2026" },
];

const statusStyles: Record<string, string> = {
  "Under Review": "bg-blue-100 text-blue-800",
  "FIR Drafted": "bg-amber-100 text-amber-800",
  Submitted: "bg-slate-100 text-slate-700",
  "FIR Registered": "bg-green-100 text-green-800",
  Closed: "bg-emerald-100 text-emerald-800",
};

export default function PoliceDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/police/dashboard" },
  { icon: ClipboardList, label: "Complaints", path: "/police/complaints" },
  { icon: FolderCheck, label: "FIR Management", path: "/police/fir-management" },
  { icon: BarChart3, label: "Analytics", path: "/police/analytics" },
  { icon: SettingsIcon, label: "Settings", path: "/police/settings" },
];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-blue-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <p className="font-bold text-base leading-none">Police Dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <button
              key={item.label + i}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                location.pathname === item.path
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-900/60"
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
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of Complaints</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3.5 py-2 shadow-xs cursor-pointer">
              <Filter size={15} />
              01 May 2026 - 31 May 2026
            </button>
            <button className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-500 shadow-xs cursor-pointer">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg pl-1.5 pr-3.5 py-1.5 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">
                {(user?.name || "Inspector A")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {user?.name || "Inspector A. Kumar"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Delhi Police</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <p className="text-xs text-slate-500">{s.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  {s.change}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{s.note}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Pie chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Complaints by Type</h2>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complaintsByType}
                      dataKey="value"
                      innerRadius={28}
                      outerRadius={50}
                      paddingAngle={2}
                    >
                      {complaintsByType.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex-1">
                {complaintsByType.map((c) => {
                  const total = complaintsByType.reduce((sum, x) => sum + x.value, 0);
                  const pct = Math.round((c.value / total) * 100);
                  return (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {c.value} <span className="text-slate-400">· {pct}%</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Complaints Trend</h2>
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

          {/* Top reasons */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Top Reasons</h2>
            <div className="space-y-2.5">
              {topReasons.map((r) => (
                <div key={r.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{r.label}</span>
                  <span className="font-bold text-slate-800">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent complaints + quick access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-x-auto">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Recent Complaints</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-100">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Complainant</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Submitted On</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                    <td className="py-3 font-mono font-semibold text-slate-800">{c.id}</td>
                    <td className="py-3 text-slate-600">{c.complainant}</td>
                    <td className="py-3 text-slate-600">{c.type}</td>
                    <td className="py-3 text-slate-500">{c.location}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{c.date}</td>
                    <td className="py-3">
                      <button
                        onClick={() => navigate(`/police/complaints/${c.id}`)}
                        className="text-slate-400 hover:text-blue-800 transition cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick access */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Access</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/police/complaints")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <Plus size={16} className="text-blue-800" />
                New Complaint
              </button>
              <button
                onClick={() => navigate("/police/complaints")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <Bot size={16} className="text-blue-800" />
                AI Legal Assistant
              </button>
              <button
                onClick={() => navigate("/police/complaints")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <Sparkles size={16} className="text-blue-800" />
                Generate FIR Draft
              </button>
              <button
                onClick={() => navigate("/police/analytics")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <BarChart3 size={16} className="text-blue-800" />
                Analytics Dashboard
              </button>
              <button
                onClick={() => navigate("/police/analytics")}
                className="w-full flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-3 py-2.5 transition cursor-pointer"
              >
                <FileBarChart size={16} className="text-blue-800" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}