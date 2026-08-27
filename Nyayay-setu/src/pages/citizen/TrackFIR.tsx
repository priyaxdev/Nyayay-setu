import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  FileText,
  MapPin,
  Calendar,
  User,
  Shield,
  RefreshCw,
  AlertCircle,
  Package,
} from "lucide-react";
import { fetchComplaintById, type Complaint } from "../../services/api";

const steps = [
  { key: "SUBMITTED", label: "Complaint Submitted", desc: "Your complaint has been received and logged in the system." },
  { key: "UNDER_REVIEW", label: "Under Review", desc: "Assigned officer is reviewing the incident details." },
  { key: "FIR_DRAFT_GENERATED", label: "FIR Draft Generated", desc: "AI engine drafted the legal FIR statement." },
  { key: "OFFICER_VERIFICATION", label: "Officer Verification", desc: "Police officer is verifying and validating the FIR draft." },
  { key: "FIR_REGISTERED", label: "FIR Registered / Closed", desc: "FIR has been officially registered or resolved." },
];

const statusStepIndexMap: Record<string, number> = {
  SUBMITTED: 0,
  "Complaint Submitted": 0,
  UNDER_REVIEW: 1,
  "Under Review": 1,
  FIR_DRAFT_GENERATED: 2,
  "FIR Draft Generated": 2,
  OFFICER_VERIFICATION: 3,
  "Officer Verification": 3,
  FIR_REGISTERED: 4,
  "FIR Registered": 4,
  CLOSED: 4,
  Closed: 4,
};

const statusBadgeStyles: Record<string, string> = {
  0: "bg-blue-100 text-blue-800 border-blue-200",
  1: "bg-amber-100 text-amber-800 border-amber-200",
  2: "bg-purple-100 text-purple-800 border-purple-200",
  3: "bg-orange-100 text-orange-800 border-orange-200",
  4: "bg-green-100 text-green-800 border-green-200",
};

export default function TrackFIR() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComplaint = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchComplaintById(id);
      setComplaint(res.complaint);
    } catch (err) {
      console.warn("Could not load from API:", err);
      setError("Unable to find this complaint on server. Showing preview.");
      // Provide fallback mock display if ID is missing in live DB
      setComplaint({
        complaintId: id,
        user: "demo_user",
        conversationId: "conv_fallback",
        incidentType: "Theft",
        description: "Complaint record tracking preview for reference ID " + id,
        date: "2026-05-17",
        time: "18:30",
        location: "Rajiv Chowk Metro Station, New Delhi",
        victim: { name: "Priya Sharma", contact: "+91 98765 43210" },
        accused: { description: "Unknown individual" },
        stolenItem: "Mobile Phone",
        language: "en",
        status: "UNDER_REVIEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const currentStep = complaint ? (statusStepIndexMap[complaint.status] ?? 0) : 0;
  const currentStepLabel = steps[currentStep]?.label || "Submitted";
  const badgeStyle = statusBadgeStyles[currentStep] || "bg-slate-100 text-slate-700";

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Complaints
          </button>
          <button
            onClick={loadComplaint}
            title="Refresh status"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-xs transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && !complaint ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
            <RefreshCw className="animate-spin text-green-700 mx-auto mb-3" size={28} />
            <p className="text-sm font-medium text-slate-700">Fetching complaint status...</p>
          </div>
        ) : (
          <>
            {/* Complaint Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 mb-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                    Complaint & FIR Status
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                    {complaint?.complaintId}
                  </h1>
                </div>
                <span
                  className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border self-start sm:self-auto ${badgeStyle}`}
                >
                  {currentStepLabel}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <Shield size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Incident Category</p>
                    <p className="text-slate-800 font-semibold capitalize">
                      {complaint?.incidentType || "General Incident"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Incident</p>
                    <p className="text-slate-800 font-semibold">
                      {complaint?.date || "Not specified"}
                      {complaint?.time ? ` (${complaint.time})` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-slate-800 font-semibold">
                      {complaint?.location || "Not specified"}
                    </p>
                  </div>
                </div>

                {complaint?.stolenItem ? (
                  <div className="flex items-start gap-2.5">
                    <Package size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Stolen Property</p>
                      <p className="text-slate-800 font-semibold capitalize">
                        {complaint.stolenItem}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <User size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Complainant</p>
                      <p className="text-slate-800 font-semibold">
                        {complaint?.victim?.name || "Citizen"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2.5">
                  <FileText size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">Incident Statement</p>
                    <p className="text-sm text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-100">
                      "{complaint?.description || "No statement recorded."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Stepper Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <h2 className="font-bold text-slate-900 mb-6 text-base flex items-center justify-between">
                <span>FIR Status Timeline</span>
                <span className="text-xs font-normal text-slate-400">Stage {currentStep + 1} of 5</span>
              </h2>

              <div className="space-y-0">
                {steps.map((step, i) => {
                  const isDone = i <= currentStep;
                  const isCurrent = i === currentStep;
                  const isLast = i === steps.length - 1;

                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isCurrent
                              ? "bg-green-800 text-white ring-4 ring-green-100"
                              : isDone
                              ? "bg-green-700 text-white"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {isDone ? (
                            <Check size={18} strokeWidth={2.5} />
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 min-h-[38px] transition-colors ${
                              i < currentStep ? "bg-green-700" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-7">
                        <p
                          className={`text-sm font-semibold flex items-center gap-2 ${
                            isCurrent
                              ? "text-green-900 font-bold"
                              : isDone
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}
                        </p>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isDone ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}