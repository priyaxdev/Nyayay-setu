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
  Search,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const registeredFIRs = [
  { id: "CMP12348", complainant: "Neha Singh", type: "Fraud", location: "Dwarka, Delhi", status: "FIR Registered", officer: "Insp. R. Verma", date: "17 May 2026" },
  { id: "CMP12340", complainant: "Ramesh Iyer", type: "Theft", location: "Saket, Delhi", status: "FIR Registered", officer: "Insp. A. Kumar", date: "12 May 2026" },
  { id: "CMP12335", complainant: "Sunita Devi", type: "Assault", location: "Nehru Place, Delhi", status: "FIR Registered", officer: "Insp. A. Kumar", date: "10 May 2026" },
  { id: "CMP12349", complainant: "Suresh Yadav", type: "Theft", location: "Rohini, Delhi", status: "Closed", officer: "Insp. R. Verma", date: "16 May 2026" },
  { id: "CMP12320", complainant: "Meena Kapoor", type: "Harassment", location: "Janakpuri, Delhi", status: "Closed", officer: "Insp. A. Kumar", date: "05 May 2026" },
];

const statusStyles: Record<string, string> = {
  "FIR Registered": "bg-green-100 text-green-800",
  Closed: "bg-slate-200 text-slate-700",
};

const filters = ["All", "FIR Registered", "Closed"];

export default function FIRManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const handleLogout = () => {
    logout();
    navigate("/police/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/police/dashboard" },
    { icon: ClipboardList, label: "Complaints", path: "/police/complaints" },
    { icon: FolderCheck, label: "FIR Management", path: "/police/fir-management" },
    { icon: BarChart3, label: "Analytics", path: "/police/analytics" },
    { icon: SettingsIcon, label: "Settings", path: "/police/settings" },
  ];

  const filtered = registeredFIRs.filter((f) => {
    const matchesFilter = activeFilter === "All" || f.status === activeFilter;
    const matchesSearch =
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.complainant.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex">
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
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-blue-200 border-t border-blue-900 hover:text-white transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">FIR Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage all registered FIRs — update status or close resolved cases.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by FIR ID or complainant..."
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div className="flex items-center gap-2">
              {filters.map((f) => (
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-200 text-xs">
                  <th className="pb-3 font-semibold">FIR ID</th>
                  <th className="pb-3 font-semibold">Complainant</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Officer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                      No FIRs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((f) => (
                    <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                      <td className="py-3.5 font-mono font-semibold text-slate-800">{f.id}</td>
                      <td className="py-3.5 text-slate-600">{f.complainant}</td>
                      <td className="py-3.5 text-slate-600">{f.type}</td>
                      <td className="py-3.5 text-slate-500">{f.location}</td>
                      <td className="py-3.5 text-slate-500">{f.officer}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[f.status]}`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 text-xs">{f.date}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/police/complaints/${f.id}`)}
                            className="text-slate-400 hover:text-blue-800 transition cursor-pointer"
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                          {f.status !== "Closed" && (
                            <button
                              className="text-slate-400 hover:text-green-700 transition cursor-pointer"
                              title="Close case"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          <button
                            className="text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Reopen / flag"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
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