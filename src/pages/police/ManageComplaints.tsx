import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
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
  FolderCheck,
  RefreshCw,
} from "lucide-react";
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

const statusFilters = ["All", "Submitted", "Under Review", "FIR Drafted", "FIR Registered", "Closed"];

export default function ManageComplaints() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetchMyComplaints();
      setComplaints(res.complaints || []);
    } catch (err) {
      console.warn("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

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

  const matchesStatusFilter = (c: Complaint, filter: string) => {
    if (filter === "All") return true;
    const st = (c.status || "").toUpperCase();
    if (filter === "Submitted") return st === "SUBMITTED";
    if (filter === "Under Review") return st === "UNDER_REVIEW" || st === "INVESTIGATING" || st === "ASSIGNED";
    if (filter === "FIR Drafted") return st === "FIR_DRAFT_GENERATED" || st === "OFFICER_VERIFICATION";
    if (filter === "FIR Registered") return st === "FIR_REGISTERED";
    if (filter === "Closed") return st === "CLOSED" || st === "RESOLVED";
    return true;
  };

  const filtered = complaints.filter((c) => {
    const matchesFilter = matchesStatusFilter(c, activeFilter);
    const complainantName =
      c.victimName ||
      c.victim?.name ||
      (c.user && typeof c.user === "object" ? c.user.name : "") ||
      "";
    const term = search.toLowerCase();
    const matchesSearch =
      c.complaintId.toLowerCase().includes(term) ||
      complainantName.toLowerCase().includes(term) ||
      (c.incidentType || "").toLowerCase().includes(term) ||
      (c.location || "").toLowerCase().includes(term) ||
      (c.description || "").toLowerCase().includes(term);
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
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-blue-200 border-t border-blue-900 hover:text-white transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Complaints</h1>
            <p className="text-sm text-slate-500 mt-1">
              Live complaint feed from MongoDB ({complaints.length} total records)
            </p>
          </div>
          <button
            onClick={loadComplaints}
            title="Refresh database records"
            className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3.5 py-2 shadow-xs hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
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
                placeholder="Search by complaint ID, complainant, location, or keyword..."
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
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && complaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <RefreshCw className="animate-spin mx-auto mb-2 text-blue-800" size={20} />
                      Loading complaints from database...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                      {search || activeFilter !== "All"
                        ? "No complaints match your search / filter criteria."
                        : "No complaints found in database."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const complainantName =
                      c.victimName ||
                      c.victim?.name ||
                      (c.user && typeof c.user === "object" ? c.user.name : "") ||
                      "Citizen Complainant";
                    const displayDate =
                      c.date ||
                      (c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent");
                    const statusLabel = c.status.replace(/_/g, " ");

                    return (
                      <tr key={c.complaintId} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                        <td className="py-3.5 font-mono font-semibold text-slate-800">{c.complaintId}</td>
                        <td className="py-3.5 text-slate-600">{complainantName}</td>
                        <td className="py-3.5 text-slate-600 capitalize">{c.incidentType || "General"}</td>
                        <td className="py-3.5 text-slate-500 truncate max-w-[140px]">{c.location || "Delhi"}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              statusStyles[c.status] || "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 text-xs">{displayDate}</td>
                        <td className="py-3.5">
                          <button
                            onClick={() => navigate(`/police/complaints/${c.complaintId}`)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 transition cursor-pointer"
                          >
                            <Eye size={14} />
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}