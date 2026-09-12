// import { useNavigate } from "react-router";
// import { useState, useEffect } from "react";
// import { ArrowLeft, Search, Filter, Plus, RefreshCw, AlertCircle, Calendar, MapPin } from "lucide-react";
// import { fetchMyComplaints, type Complaint } from "../../services/api";

// const statusLabelMap: Record<string, string> = {
//   SUBMITTED: "Complaint Submitted",
//   UNDER_REVIEW: "Under Review",
//   FIR_DRAFT_GENERATED: "FIR Draft Generated",
//   OFFICER_VERIFICATION: "Officer Verification",
//   FIR_REGISTERED: "FIR Registered",
//   CLOSED: "Closed",
//   "Complaint Submitted": "Complaint Submitted",
//   "Under Review": "Under Review",
//   "FIR Draft Generated": "FIR Draft Generated",
//   "Officer Verification": "Officer Verification",
//   "FIR Registered": "FIR Registered",
//   Closed: "Closed",
// };

// const statusStyles: Record<string, string> = {
//   "Complaint Submitted": "bg-blue-100 text-blue-800 border-blue-200",
//   "Under Review": "bg-amber-100 text-amber-800 border-amber-200",
//   "FIR Draft Generated": "bg-purple-100 text-purple-800 border-purple-200",
//   "Officer Verification": "bg-orange-100 text-orange-800 border-orange-200",
//   "FIR Registered": "bg-green-100 text-green-800 border-green-200",
//   Closed: "bg-slate-200 text-slate-700 border-slate-300",
// };

// const filters = ["All", "Under Review", "FIR Registered", "Closed"];

// export default function MyComplaints() {
//   const navigate = useNavigate();
//   const [complaints, setComplaints] = useState<Complaint[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [search, setSearch] = useState("");

//   const loadComplaints = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchMyComplaints();
//       setComplaints(res.complaints || []);
//     } catch (err) {
//       console.warn("API fetch error, keeping local view:", err);
//       setError("Could not connect to live server. Displaying local records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadComplaints();
//   }, []);

//   const filtered = complaints.filter((c) => {
//     const formattedStatus = statusLabelMap[c.status] || c.status;
//     const matchesFilter = activeFilter === "All" || formattedStatus === activeFilter;
//     const matchesSearch =
//       c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
//       (c.description || "").toLowerCase().includes(search.toLowerCase()) ||
//       (c.incidentType || "").toLowerCase().includes(search.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-8">
//       <div className="w-full max-w-4xl mx-auto">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium transition"
//         >
//           <ArrowLeft size={18} />
//           Back to dashboard
//         </button>

//         <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
//               <p className="text-sm text-slate-500 mt-1">
//                 Real-time tracking of all complaints & FIRs filed by you
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={loadComplaints}
//                 title="Refresh list"
//                 className="p-2.5 text-slate-500 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
//               >
//                 <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//               </button>
//               <button
//                 onClick={() => navigate("/submit-complaint")}
//                 className="bg-green-800 hover:bg-green-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition shadow-xs"
//               >
//                 <Plus size={16} />
//                 File Complaint
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
//               <AlertCircle size={16} className="flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Search + filter */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by complaint ID (e.g. CMP-2026...), keyword, or incident type..."
//                 className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//               />
//             </div>
//             <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
//               <Filter size={16} className="text-slate-400 flex-shrink-0" />
//               {filters.map((f) => (
//                 <button
//                   key={f}
//                   onClick={() => setActiveFilter(f)}
//                   className={`px-3.5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer ${
//                     activeFilter === f
//                       ? "bg-green-800 text-white shadow-xs"
//                       : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                   }`}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Complaint list */}
//           {loading && complaints.length === 0 ? (
//             <div className="text-center py-16">
//               <RefreshCw className="animate-spin text-green-700 mx-auto mb-2" size={24} />
//               <p className="text-sm text-slate-500">Loading complaints from database...</p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="text-center py-14 border border-dashed border-slate-200 rounded-xl">
//               <p className="text-sm font-semibold text-slate-700">No complaints found</p>
//               <p className="text-xs text-slate-400 mt-1 mb-4">
//                 {search ? "No records matched your search query." : "You haven't filed any complaints yet."}
//               </p>
//               <button
//                 onClick={() => navigate("/submit-complaint")}
//                 className="bg-green-800 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition"
//               >
//                 File a Complaint Now
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {filtered.map((c) => {
//                 const label = statusLabelMap[c.status] || c.status;
//                 const badgeStyle = statusStyles[label] || "bg-slate-100 text-slate-700 border-slate-200";
//                 const displayDate = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent");

//                 return (
//                   <button
//                     key={c.complaintId}
//                     onClick={() => navigate(`/track-fir/${c.complaintId}`)}
//                     className="w-full flex flex-col sm:flex-row sm:items-center justify-between border border-slate-200 hover:border-green-700 rounded-xl p-4.5 text-left transition bg-white hover:bg-green-50/20 group shadow-xs cursor-pointer gap-3"
//                   >
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//                         <span className="text-sm font-bold text-slate-900 group-hover:text-green-900 transition font-mono">
//                           {c.complaintId}
//                         </span>
//                         <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium capitalize">
//                           {c.incidentType || "General Incident"}
//                         </span>
//                         {c.stolenItem && (
//                           <span className="text-xs text-slate-400">· Stolen: {c.stolenItem}</span>
//                         )}
//                       </div>
//                       <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
//                         {c.description || "No description provided."}
//                       </p>
//                       <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
//                         <span className="flex items-center gap-1">
//                           <Calendar size={13} />
//                           {displayDate}
//                         </span>
//                         {c.location && (
//                           <span className="flex items-center gap-1 truncate max-w-[200px]">
//                             <MapPin size={13} />
//                             {c.location}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex sm:flex-col items-end justify-between sm:justify-center flex-shrink-0">
//                       <span
//                         className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${badgeStyle}`}
//                       >
//                         {label}
//                       </span>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Plus, RefreshCw, AlertCircle, Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchMyComplaints, type Complaint } from "../../services/api";

const statusLabelMap: Record<string, string> = {
  SUBMITTED: "Complaint Submitted",
  UNDER_REVIEW: "Under Review",
  FIR_DRAFT_GENERATED: "FIR Draft Generated",
  OFFICER_VERIFICATION: "Officer Verification",
  FIR_REGISTERED: "FIR Registered",
  CLOSED: "Closed",
  "Complaint Submitted": "Complaint Submitted",
  "Under Review": "Under Review",
  "FIR Draft Generated": "FIR Draft Generated",
  "Officer Verification": "Officer Verification",
  "FIR Registered": "FIR Registered",
  Closed: "Closed",
};

// Display-only translation lookup — the English labels above are still
// used internally for matching/filtering, this only changes what's shown.
const STATUS_DISPLAY_KEY: Record<string, string> = {
  "Complaint Submitted": "myComplaints.statusSubmitted",
  "Under Review": "myComplaints.statusUnderReview",
  "FIR Draft Generated": "myComplaints.statusFirDraft",
  "Officer Verification": "myComplaints.statusOfficerVerification",
  "FIR Registered": "myComplaints.statusFirRegistered",
  Closed: "myComplaints.statusClosed",
};

const statusStyles: Record<string, string> = {
  "Complaint Submitted": "bg-blue-100 text-blue-800 border-blue-200",
  "Under Review": "bg-amber-100 text-amber-800 border-amber-200",
  "FIR Draft Generated": "bg-purple-100 text-purple-800 border-purple-200",
  "Officer Verification": "bg-orange-100 text-orange-800 border-orange-200",
  "FIR Registered": "bg-green-100 text-green-800 border-green-200",
  Closed: "bg-slate-200 text-slate-700 border-slate-300",
};

const filters = ["All", "Under Review", "FIR Registered", "Closed"];

const FILTER_DISPLAY_KEY: Record<string, string> = {
  All: "myComplaints.filterAll",
  "Under Review": "myComplaints.statusUnderReview",
  "FIR Registered": "myComplaints.statusFirRegistered",
  Closed: "myComplaints.statusClosed",
};

export default function MyComplaints() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const loadComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyComplaints();
      setComplaints(res.complaints || []);
    } catch (err) {
      console.warn("API fetch error, keeping local view:", err);
      setError(t("myComplaints.connectionError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    const formattedStatus = statusLabelMap[c.status] || c.status;
    const matchesFilter = activeFilter === "All" || formattedStatus === activeFilter;
    const matchesSearch =
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.incidentType || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium transition"
        >
          <ArrowLeft size={18} />
          {t("common.backToDashboard")}
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("myComplaints.title")}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {t("myComplaints.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadComplaints}
                title={t("myComplaints.refreshTitle")}
                className="p-2.5 text-slate-500 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={() => navigate("/submit-complaint")}
                className="bg-green-800 hover:bg-green-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus size={16} />
                {t("myComplaints.fileComplaint")}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("myComplaints.searchPlaceholder")}
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter size={16} className="text-slate-400 flex-shrink-0" />
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer ${
                    activeFilter === f
                      ? "bg-green-800 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t(FILTER_DISPLAY_KEY[f])}
                </button>
              ))}
            </div>
          </div>

          {/* Complaint list */}
          {loading && complaints.length === 0 ? (
            <div className="text-center py-16">
              <RefreshCw className="animate-spin text-green-700 mx-auto mb-2" size={24} />
              <p className="text-sm text-slate-500">{t("myComplaints.loading")}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm font-semibold text-slate-700">{t("myComplaints.noneFound")}</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                {search ? t("myComplaints.noSearchMatch") : t("myComplaints.noneFiledYet")}
              </p>
              <button
                onClick={() => navigate("/submit-complaint")}
                className="bg-green-800 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition"
              >
                {t("myComplaints.fileNow")}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => {
                const label = statusLabelMap[c.status] || c.status;
                const displayLabel = STATUS_DISPLAY_KEY[label] ? t(STATUS_DISPLAY_KEY[label]) : label;
                const badgeStyle = statusStyles[label] || "bg-slate-100 text-slate-700 border-slate-200";
                const displayDate = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : t("dashboard.recentFallback"));

                return (
                  <button
                    key={c.complaintId}
                    onClick={() => navigate(`/track-fir/${c.complaintId}`)}
                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between border border-slate-200 hover:border-green-700 rounded-xl p-4.5 text-left transition bg-white hover:bg-green-50/20 group shadow-xs cursor-pointer gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-green-900 transition font-mono">
                          {c.complaintId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium capitalize">
                          {c.incidentType || t("dashboard.genericIncident")}
                        </span>
                        {c.stolenItem && (
                          <span className="text-xs text-slate-400">· {t("myComplaints.stolenLabel")}: {c.stolenItem}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {c.description || t("dashboard.noDescription")}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {displayDate}
                        </span>
                        {c.location && (
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <MapPin size={13} />
                            {c.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center flex-shrink-0">
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${badgeStyle}`}
                      >
                        {displayLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}