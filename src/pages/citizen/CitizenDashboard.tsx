import { useNavigate, useLocation } from "react-router";
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
  Globe,
  Check,
  Circle,
} from "lucide-react";

const steps = [
  { label: "Complaint Submitted", done: true },
  { label: "Under Review", done: true },
  { label: "FIR Draft Generated", done: false },
  { label: "Officer Verification", done: false },
  { label: "FIR Registered / Closed", done: false },
];

const recentComplaints = [
  { id: "CMP12345", desc: "Lost my mobile phone near Metro Station.", status: "Under Review", date: "17 May 2026" },
  { id: "CMP12298", desc: "Two-wheeler theft reported in Sector 12.", status: "FIR Registered", date: "10 May 2026" },
];

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: FileEdit, label: "Submit Complaint", path: "/submit-complaint" },
    { icon: ClipboardList, label: "My Complaints", path: "/my-complaints" },
    { icon: FileText, label: "FIR Status", path: "/my-complaints" }, 
    { icon: User, label: "Profile", path: "/profile" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" }, 
  ];


  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-60 bg-green-900 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-green-800">
          <p className="font-bold text-base leading-none">  Nyayay Setu</p>
          <p className="text-xs text-green-300 mt-1">Citizen · Police · Safety</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
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
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-6 py-4 text-sm text-green-200 border-t border-green-800 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">How can we help you today?</h1>
            <p className="text-sm text-slate-500 mt-1">Submit your complaint in the way you are comfortable with.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-2">
            <Globe size={16} />
            English
          </div>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/submit-complaint")}
            className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-green-700 transition"
          >
            <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <MessageSquare className="text-blue-700" size={22} />
            </div>
            <p className="font-semibold text-slate-800">Text Complaint</p>
            <p className="text-xs text-slate-500 mt-1">Type your complaint</p>
          </button>

          <button
            onClick={() => navigate("/submit-complaint?mode=voice")}
            className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-green-700 transition"
          >
            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <Mic className="text-green-700" size={22} />
            </div>
            <p className="font-semibold text-slate-800">Voice Complaint</p>
            <p className="text-xs text-slate-500 mt-1">Record your complaint</p>
          </button>

          <button className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-green-700 transition">
            <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
              <Globe className="text-orange-700" size={22} />
            </div>
            <p className="font-semibold text-slate-800">Choose Language</p>
            <p className="text-xs text-slate-500 mt-1">Auto-detects and translates</p>
          </button>
        </div>

        {/* FIR status tracker */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-slate-800 mb-5">Track Your FIR Status</h2>
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.done ? "bg-green-700" : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {step.done ? (
                      <Check className="text-white" size={16} strokeWidth={3} />
                    ) : (
                      <Circle className="text-slate-300" size={10} fill="currentColor" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 text-center w-24 leading-tight">{step.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-6 ${step.done ? "bg-green-700" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Recent Activities</h2>
            <button
              onClick={() => navigate("/my-complaints")}
              className="text-sm text-green-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentComplaints.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border border-slate-100 rounded-lg p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.id}</p>
                  <p className="text-sm text-slate-500">{c.desc}</p>
                  <p className="text-xs text-slate-400 mt-1">{c.date}</p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    c.status === "FIR Registered"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}