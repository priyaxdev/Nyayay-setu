import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, Search, Filter } from "lucide-react";

const allComplaints = [
  { id: "CMP12345", type: "Theft", desc: "Lost my mobile phone near Metro Station.", status: "Under Review", date: "17 May 2026" },
  { id: "CMP12298", type: "Theft", desc: "Two-wheeler theft reported in Sector 12.", status: "FIR Registered", date: "10 May 2026" },
  { id: "CMP12201", type: "Fraud", desc: "Received a phishing call asking for OTP.", status: "FIR Draft Generated", date: "02 May 2026" },
  { id: "CMP12150", type: "Property Damage", desc: "Vehicle damaged during a protest march.", status: "Complaint Submitted", date: "28 Apr 2026" },
  { id: "CMP12099", type: "Assault", desc: "Minor altercation outside a local market.", status: "Closed", date: "15 Apr 2026" },
];

const statusStyles: Record<string, string> = {
  "Complaint Submitted": "bg-blue-100 text-blue-800",
  "Under Review": "bg-amber-100 text-amber-800",
  "FIR Draft Generated": "bg-purple-100 text-purple-800",
  "Officer Verification": "bg-orange-100 text-orange-800",
  "FIR Registered": "bg-green-100 text-green-800",
  "Closed": "bg-slate-200 text-slate-700",
};

const filters = ["All", "Under Review", "FIR Registered", "Closed"];

export default function MyComplaints() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allComplaints.filter((c) => {
    const matchesFilter = activeFilter === "All" || c.status === activeFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
              <p className="text-sm text-slate-500 mt-1">All complaints filed by you</p>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by complaint ID or keyword..."
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter size={16} className="text-slate-400 flex-shrink-0" />
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition ${
                    activeFilter === f
                      ? "bg-green-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Complaint list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No complaints found.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/track-fir/${c.id}`)}
                  className="w-full flex items-center justify-between border border-slate-200 rounded-lg p-4 text-left hover:border-green-700 transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800">{c.id}</p>
                      <span className="text-xs text-slate-400">· {c.type}</span>
                    </div>
                    <p className="text-sm text-slate-500">{c.desc}</p>
                    <p className="text-xs text-slate-400 mt-1">{c.date}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0 ml-3 ${
                      statusStyles[c.status] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}