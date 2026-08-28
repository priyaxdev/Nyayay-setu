import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  SettingsIcon,
  LogOut,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  FolderCheck,
} from "lucide-react";

const allComplaints = [
  { id: "CMP12345", complainant: "Rohit Sharma", type: "Theft", location: "Lajpat Nagar, Delhi", status: "Under Review", priority: "High", date: "18 May 2026" },
  { id: "CMP12346", complainant: "Anjali Verma", type: "Assault", location: "Karol Bagh, Delhi", status: "FIR Drafted", priority: "High", date: "18 May 2026" },
  { id: "CMP12347", complainant: "Mohit Kumar", type: "Harassment", location: "Patel Nagar, Delhi", status: "Submitted", priority: "Medium", date: "17 May 2026" },
  { id: "CMP12348", complainant: "Neha Singh", type: "Fraud", location: "Dwarka, Delhi", status: "FIR Registered", priority: "Low", date: "17 May 2026" },
  { id: "CMP12349", complainant: "Suresh Yadav", type: "Theft", location: "Rohini, Delhi", status: "Closed", priority: "Low", date: "16 May 2026" },
  { id: "CMP12350", complainant: "Kavita Rao", type: "Cyber Fraud", location: "Saket, Delhi", status: "Under Review", priority: "Medium", date: "16 May 2026" },
  { id: "CMP12351", complainant: "Arjun Mehta", type: "Property Damage", location: "Vasant Kunj, Delhi", status: "Submitted", priority: "Low", date: "15 May 2026" },
];

const statusStyles: Record<string, string> = {
  "Under Review": "bg-blue-100 text-blue-800",
  "FIR Drafted": "bg-amber-100 text-amber-800",
  Submitted: "bg-slate-100 text-slate-700",
  "FIR Registered": "bg-green-100 text-green-800",
  Closed: "bg-emerald-100 text-emerald-800",
};

const priorityStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

const statusFilters = ["All", "Submitted", "Under Review", "FIR Drafted", "FIR Registered", "Closed"];

export default function ManageComplaints() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/police/dashboard" },
  { icon: ClipboardList, label: "Complaints", path: "/police/complaints" },
  { icon: FolderCheck, label: "FIR Management", path: "/police/fir-management" },
  { icon: BarChart3, label: "Analytics", path: "/police/analytics" },
  { icon: SettingsIcon, label: "Settings", path: "/police/settings" },
];

  const filtered = allComplaints.filter((c) => {
    const matchesFilter = activeFilter === "All" || c.status === activeFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.complainant.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
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
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-6 py-4 text-sm text-blue-200 border-t border-blue-900 hover:text-white transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Manage Complaints</h1>
          <p className="text-sm text-slate-500 mt-1">
            View, track, and manage all citizen complaints and FIRs.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          {/* Search + filters */}
          <div className="flex flex-col lg:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by complaint ID, complainant, or type..."
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter size={16} className="text-slate-400 flex-shrink-0" />
              {statusFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer ${
                    activeFilter === f
                      ? "bg-blue-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-200 text-xs">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Complainant</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold flex items-center gap-1">
                    Priority <ArrowUpDown size={11} />
                  </th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                      <td className="py-3.5 font-mono font-semibold text-slate-800">{c.id}</td>
                      <td className="py-3.5 text-slate-600">{c.complainant}</td>
                      <td className="py-3.5 text-slate-600">{c.type}</td>
                      <td className="py-3.5 text-slate-500">{c.location}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${priorityStyles[c.priority]}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 text-xs">{c.date}</td>
                      <td className="py-3.5">
                        <button
                          onClick={() => navigate(`/police/complaints/${c.id}`)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 transition cursor-pointer"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}