import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, FileText, MapPin, Calendar, User } from "lucide-react";

const steps = [
  { key: "submitted", label: "Complaint Submitted", desc: "Your complaint has been received." },
  { key: "review", label: "Under Review", desc: "Officer is reviewing the details." },
  { key: "draft", label: "FIR Draft Generated", desc: "AI has drafted the FIR for review." },
  { key: "verify", label: "Officer Verification", desc: "Officer is verifying the draft." },
  { key: "registered", label: "FIR Registered / Closed", desc: "FIR has been officially registered." },
];

// Mock data - baad mein ye API se aayega, id ke basis pe
const complaintData = {
  id: "CMP12345",
  type: "Theft",
  desc: "Lost my mobile phone near Metro Station while boarding the evening bus around 6:30 PM.",
  location: "Rajiv Chowk Metro Station, New Delhi",
  date: "17 May 2026",
  complainant: "Priya Sharma",
  currentStepIndex: 1, // 0-indexed, matches `steps` array above
};

export default function TrackFIR() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{id ?? complaintData.id}</h1>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">
              {steps[complaintData.currentStepIndex].label}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-6">{complaintData.type} complaint</p>

          {/* Complaint details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Date filed</p>
                <p className="text-slate-700 font-medium">{complaintData.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-slate-700 font-medium">{complaintData.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 col-span-2">
              <User size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Complainant</p>
                <p className="text-slate-700 font-medium">{complaintData.complainant}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{complaintData.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical stepper */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7">
          <h2 className="font-semibold text-slate-800 mb-6">Status Timeline</h2>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isDone = i <= complaintData.currentStepIndex;
              const isLast = i === steps.length - 1;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDone ? "bg-green-700" : "bg-slate-200"
                      }`}
                    >
                      {isDone && <Check className="text-white" size={16} strokeWidth={3} />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[32px] ${isDone ? "bg-green-700" : "bg-slate-200"}`} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={`text-sm font-semibold ${isDone ? "text-slate-800" : "text-slate-400"}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${isDone ? "text-slate-500" : "text-slate-400"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}