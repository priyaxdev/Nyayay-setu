// import { useNavigate, useLocation } from "react-router";
// import { useState, useEffect } from "react";
// import {
//   Home,
//   FileEdit,
//   ClipboardList,
//   FileText,
//   User,
//   HelpCircle,
//   LogOut,
//   MessageSquare,
//   Mic,
//   Check,
//   Circle,
//   ArrowRight,
//   MapPin,
//   Clock,
// } from "lucide-react";
// import { fetchMyComplaints, type Complaint } from "../../services/api";
// import { useAuth } from "../../context/AuthContext";
// import LanguageSelector from "../../components/ui/LanguageSelector";

// const defaultSteps = [
//   { label: "Complaint Submitted" },
//   { label: "Under Review" },
//   { label: "FIR Draft Generated" },
//   { label: "Officer Verification" },
//   { label: "FIR Registered / Closed" },
// ];

// const statusStepMap: Record<string, number> = {
//   SUBMITTED: 0,
//   UNDER_REVIEW: 1,
//   FIR_DRAFT_GENERATED: 2,
//   OFFICER_VERIFICATION: 3,
//   FIR_REGISTERED: 4,
//   CLOSED: 4,
//   "Complaint Submitted": 0,
//   "Under Review": 1,
//   "FIR Draft Generated": 2,
//   "Officer Verification": 3,
//   "FIR Registered": 4,
//   Closed: 4,
// };

// export default function CitizenDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   const [complaints, setComplaints] = useState<Complaint[]>([]);

//   useEffect(() => {
//     fetchMyComplaints()
//       .then((res) => {
//         if (res.complaints) {
//           setComplaints(res.complaints);
//         }
//       })
//       .catch((err) => {
//         console.warn("Could not load complaints for dashboard:", err);
//       });
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const navItems = [
//     { icon: Home, label: "Home", path: "/dashboard" },
//     { icon: FileEdit, label: "Submit Complaint", path: "/submit-complaint" },
//     { icon: ClipboardList, label: "My Complaints", path: "/my-complaints" },
//     { icon: FileText, label: "FIR Status", path: "/my-complaints" },
//     { icon: User, label: "Profile", path: "/profile" },
//     { icon: HelpCircle, label: "Help & Support", path: "/help" },
//   ];

//   const latestComplaint = complaints.length > 0 ? complaints[0] : null;
//   const currentStepIndex = latestComplaint
//     ? statusStepMap[latestComplaint.status] ?? 1
//     : 1;

//   const recentList = complaints.slice(0, 3);

//   return (
//     <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
//       {/* Sidebar */}
//       <aside className="w-full md:w-60 bg-green-900 text-white flex flex-col flex-shrink-0">
//         <div className="px-5 py-5 border-b border-green-800 flex items-center justify-between md:block">
//           <div>
//             <p className="font-bold text-base leading-none">Nyayay Setu</p>
//             <p className="text-xs text-green-300 mt-1">Citizen · Police · Safety</p>
//           </div>
//         </div>
//         <nav className="flex-1 px-3 py-4 space-y-1">
//           {navItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => navigate(item.path)}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
//                 location.pathname === item.path
//                   ? "bg-green-800 text-white"
//                   : "text-green-100 hover:bg-green-800/60"
//               }`}
//             >
//               <item.icon size={18} />
//               {item.label}
//             </button>
//           ))}
//         </nav>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-6 py-4 text-sm text-green-200 border-t border-green-800 hover:text-white transition cursor-pointer"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 md:p-8 overflow-y-auto">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               How can we help you today{user?.name ? `, ${user.name}` : ""}?
//             </h1>
//             <p className="text-sm text-slate-500 mt-1">
//               Submit your complaint in the way you are comfortable with.
//             </p>
//           </div>
//           <LanguageSelector />
//         </div>

//         {/* Action cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <button
//             onClick={() => navigate("/submit-complaint")}
//             className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-700 transition shadow-xs group cursor-pointer"
//           >
//             <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition text-blue-700">
//               <MessageSquare size={22} />
//             </div>
//             <p className="font-bold text-slate-800 group-hover:text-green-900 transition">
//               Text Complaint & AI Assistant
//             </p>
//             <p className="text-xs text-slate-500 mt-1">
//               Describe in natural language with NyayaBot
//             </p>
//           </button>

//           <button
//             onClick={() => navigate("/submit-complaint")}
//             className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-700 transition shadow-xs group cursor-pointer"
//           >
//             <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition text-emerald-700">
//               <Mic size={22} />
//             </div>
//             <p className="font-bold text-slate-800 group-hover:text-green-900 transition">
//               Voice Complaint
//             </p>
//             <p className="text-xs text-slate-500 mt-1">Record or speak in your own language</p>
//           </button>

//           <button
//   onClick={() => navigate("/nearby-stations")}
//   className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-700 transition shadow-xs group cursor-pointer"
// >
//   <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-3 transition text-amber-700">
//     <MapPin size={22} />
//   </div>
//   <p className="font-bold text-slate-800 group-hover:text-green-900 transition">
//     Nearby Police Stations
//   </p>
//   <p className="text-xs text-slate-500 mt-1">Find the closest station for help</p>
// </button>
//         </div>

//         {/* FIR status tracker */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
//             <div>
//               <h2 className="font-bold text-slate-900 text-base">Latest Complaint Progress</h2>
//               {latestComplaint ? (
//                 <p className="text-xs text-slate-500 mt-0.5">
//                   Tracking <span className="font-mono font-semibold text-green-900">{latestComplaint.complaintId}</span> · {latestComplaint.incidentType || "Incident"}
//                 </p>
//               ) : (
//                 <p className="text-xs text-slate-400 mt-0.5">Sample FIR Progression Workflow</p>
//               )}
//             </div>
//             {latestComplaint && (
//               <button
//                 onClick={() => navigate(`/track-fir/${latestComplaint.complaintId}`)}
//                 className="text-xs font-semibold text-green-800 hover:text-green-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
//               >
//                 View Full Details <ArrowRight size={14} />
//               </button>
//             )}
//           </div>

//           <div className="flex items-center overflow-x-auto pb-4 sm:pb-0">
//             {defaultSteps.map((step, i) => {
//               const isDone = i <= currentStepIndex;
//               return (
//                 <div key={step.label} className="flex items-center flex-1 last:flex-none min-w-[110px]">
//                   <div className="flex flex-col items-center gap-2">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                         isDone ? "bg-green-700 text-white" : "border-2 border-slate-300 bg-white"
//                       }`}
//                     >
//                       {isDone ? (
//                         <Check size={16} strokeWidth={3} />
//                       ) : (
//                         <Circle className="text-slate-300" size={10} fill="currentColor" />
//                       )}
//                     </div>
//                     <p
//                       className={`text-xs text-center w-24 leading-tight font-medium ${
//                         isDone ? "text-slate-800" : "text-slate-400"
//                       }`}
//                     >
//                       {step.label}
//                     </p>
//                   </div>
//                   {i < defaultSteps.length - 1 && (
//                     <div
//                       className={`flex-1 h-0.5 mb-6 transition-all ${
//                         i < currentStepIndex ? "bg-green-700" : "bg-slate-200"
//                       }`}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Recent activities */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="font-bold text-slate-900 text-base">Recent Activities</h2>
//               <p className="text-xs text-slate-400">Recently filed complaints and updates</p>
//             </div>
//             <button
//               onClick={() => navigate("/my-complaints")}
//               className="text-xs font-semibold text-green-800 hover:text-green-950 flex items-center gap-1 transition cursor-pointer"
//             >
//               View All ({complaints.length}) <ArrowRight size={14} />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {recentList.length === 0 ? (
//               <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
//                 <p className="text-xs text-slate-500">No complaints filed yet.</p>
//                 <button
//                   onClick={() => navigate("/submit-complaint")}
//                   className="mt-2 text-xs text-green-800 font-semibold hover:underline"
//                 >
//                   File your first complaint
//                 </button>
//               </div>
//             ) : (
//               recentList.map((c) => {
//                 const displayDate = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent");
//                 return (
//                   <div
//                     key={c.complaintId}
//                     onClick={() => navigate(`/track-fir/${c.complaintId}`)}
//                     className="flex flex-col sm:flex-row sm:items-center justify-between border border-slate-200 hover:border-green-700 rounded-xl p-4 transition bg-white hover:bg-slate-50/60 cursor-pointer gap-2"
//                   >
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="text-sm font-bold text-slate-900 font-mono">
//                           {c.complaintId}
//                         </p>
//                         <span className="text-xs text-slate-400 capitalize">
//                           · {c.incidentType || "General Incident"}
//                         </span>
//                       </div>
//                       <p className="text-xs text-slate-600 line-clamp-1">
//                         {c.description || "No description provided."}
//                       </p>
//                       <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
//                         <Clock size={11} />
//                         {displayDate}
//                       </p>
//                     </div>
//                     <span
//                       className={`text-xs font-medium px-3 py-1 rounded-full self-start sm:self-center ${
//                         c.status.includes("REGISTERED")
//                           ? "bg-green-100 text-green-800"
//                           : c.status.includes("DRAFT")
//                           ? "bg-purple-100 text-purple-800"
//                           : "bg-amber-100 text-amber-800"
//                       }`}
//                     >
//                       {c.status.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  Home,
  FileEdit,
  ClipboardList,
  FileText,
  User,
  HelpCircle,
  LogOut,
  MessageSquare,
  Mic,
  Check,
  Circle,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchMyComplaints, type Complaint } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LanguageSelector from "../../components/ui/LanguageSelector";

const statusStepMap: Record<string, number> = {
  SUBMITTED: 0,
  UNDER_REVIEW: 1,
  FIR_DRAFT_GENERATED: 2,
  OFFICER_VERIFICATION: 3,
  FIR_REGISTERED: 4,
  CLOSED: 4,
  "Complaint Submitted": 0,
  "Under Review": 1,
  "FIR Draft Generated": 2,
  "Officer Verification": 3,
  "FIR Registered": 4,
  Closed: 4,
};

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    fetchMyComplaints()
      .then((res) => {
        if (res.complaints) {
          setComplaints(res.complaints);
        }
      })
      .catch((err) => {
        console.warn("Could not load complaints for dashboard:", err);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const defaultSteps = [
    { label: t("dashboard.stepSubmitted") },
    { label: t("dashboard.stepUnderReview") },
    { label: t("dashboard.stepFirDraft") },
    { label: t("dashboard.stepOfficerVerification") },
    { label: t("dashboard.stepFirRegistered") },
  ];

  const navItems = [
    { icon: Home, label: t("dashboard.navHome"), path: "/dashboard" },
    { icon: FileEdit, label: t("dashboard.navSubmitComplaint"), path: "/submit-complaint" },
    { icon: ClipboardList, label: t("dashboard.navMyComplaints"), path: "/my-complaints" },
    { icon: FileText, label: t("dashboard.navFirStatus"), path: "/my-complaints" },
    { icon: User, label: t("dashboard.navProfile"), path: "/profile" },
    { icon: HelpCircle, label: t("dashboard.navHelpSupport"), path: "/help" },
  ];

  const latestComplaint = complaints.length > 0 ? complaints[0] : null;
  const currentStepIndex = latestComplaint
    ? statusStepMap[latestComplaint.status] ?? 1
    : 1;

  const recentList = complaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-green-900 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-green-800 flex items-center justify-between md:block">
          <div>
            <p className="font-bold text-base leading-none">Nyayay Setu</p>
            <p className="text-xs text-green-300 mt-1">{t("dashboard.appTagline")}</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                location.pathname === item.path
                  ? "bg-green-800 text-white"
                  : "text-green-100 hover:bg-green-800/60"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-green-200 border-t border-green-800 hover:text-white transition cursor-pointer"
        >
          <LogOut size={18} />
          {t("dashboard.logout")}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("dashboard.greeting")}{user?.name ? `, ${user.name}` : ""}?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("dashboard.greetingSubtitle")}
            </p>
          </div>
          <LanguageSelector />
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/submit-complaint")}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-700 transition shadow-xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition text-blue-700">
              <MessageSquare size={22} />
            </div>
            <p className="font-bold text-slate-800 group-hover:text-green-900 transition">
              {t("dashboard.cardTextTitle")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t("dashboard.cardTextDesc")}
            </p>
          </button>

          <button
            onClick={() => navigate("/submit-complaint")}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-700 transition shadow-xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition text-emerald-700">
              <Mic size={22} />
            </div>
            <p className="font-bold text-slate-800 group-hover:text-green-900 transition">
              {t("dashboard.cardVoiceTitle")}
            </p>
            <p className="text-xs text-slate-500 mt-1">{t("dashboard.cardVoiceDesc")}</p>
          </button>

          <button
            onClick={() => navigate("/nearby-stations")}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-green-700 transition shadow-xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-3 transition text-amber-700">
              <MapPin size={22} />
            </div>
            <p className="font-bold text-slate-800 group-hover:text-green-900 transition">
              {t("dashboard.cardStationsTitle")}
            </p>
            <p className="text-xs text-slate-500 mt-1">{t("dashboard.cardStationsDesc")}</p>
          </button>
        </div>

        {/* FIR status tracker */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-base">{t("dashboard.latestProgress")}</h2>
              {latestComplaint ? (
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("dashboard.tracking")} <span className="font-mono font-semibold text-green-900">{latestComplaint.complaintId}</span> · {latestComplaint.incidentType || t("dashboard.genericIncident")}
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.sampleWorkflow")}</p>
              )}
            </div>
            {latestComplaint && (
              <button
                onClick={() => navigate(`/track-fir/${latestComplaint.complaintId}`)}
                className="text-xs font-semibold text-green-800 hover:text-green-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                {t("dashboard.viewFullDetails")} <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center overflow-x-auto pb-4 sm:pb-0">
            {defaultSteps.map((step, i) => {
              const isDone = i <= currentStepIndex;
              return (
                <div key={step.label} className="flex items-center flex-1 last:flex-none min-w-[110px]">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isDone ? "bg-green-700 text-white" : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isDone ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <Circle className="text-slate-300" size={10} fill="currentColor" />
                      )}
                    </div>
                    <p
                      className={`text-xs text-center w-24 leading-tight font-medium ${
                        isDone ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {i < defaultSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mb-6 transition-all ${
                        i < currentStepIndex ? "bg-green-700" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">{t("dashboard.recentActivities")}</h2>
              <p className="text-xs text-slate-400">{t("dashboard.recentActivitiesSubtitle")}</p>
            </div>
            <button
              onClick={() => navigate("/my-complaints")}
              className="text-xs font-semibold text-green-800 hover:text-green-950 flex items-center gap-1 transition cursor-pointer"
            >
              {t("dashboard.viewAll")} ({complaints.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentList.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-500">{t("dashboard.noComplaintsYet")}</p>
                <button
                  onClick={() => navigate("/submit-complaint")}
                  className="mt-2 text-xs text-green-800 font-semibold hover:underline"
                >
                  {t("dashboard.fileFirstComplaint")}
                </button>
              </div>
            ) : (
              recentList.map((c) => {
                const displayDate = c.date || (c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : t("dashboard.recentFallback"));
                return (
                  <div
                    key={c.complaintId}
                    onClick={() => navigate(`/track-fir/${c.complaintId}`)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between border border-slate-200 hover:border-green-700 rounded-xl p-4 transition bg-white hover:bg-slate-50/60 cursor-pointer gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          {c.complaintId}
                        </p>
                        <span className="text-xs text-slate-400 capitalize">
                          · {c.incidentType || t("dashboard.genericIncident")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {c.description || t("dashboard.noDescription")}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={11} />
                        {displayDate}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full self-start sm:self-center ${
                        c.status.includes("REGISTERED")
                          ? "bg-green-100 text-green-800"
                          : c.status.includes("DRAFT")
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}