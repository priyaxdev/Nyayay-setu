import { useNavigate } from "react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, MessageSquare, Mic, MapPin, Calendar, Paperclip, Square } from "lucide-react";

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: complaint submit API call yahan lagana
    navigate("/dashboard");
  };
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">File a Complaint</h1>
          <p className="text-sm text-slate-500 mb-6">
            Describe the incident in your own words — type or speak, in any language.
          </p>

          {/* Mode toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-md transition font-semibold ${
                mode === "text" ? "bg-white text-green-800 shadow border border-green-700" : "text-slate-500"
              }`}
            >
              <MessageSquare size={16} />
              Text
            </button>
            <button
              type="button"
              onClick={() => setMode("voice")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-md transition font-semibold ${
                mode === "voice" ? "bg-white text-green-800 shadow border border-green-700" : "text-slate-500"
              }`}
            >
              <Mic size={16} />
              Voice
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Language selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
                <option>Bengali</option>
                <option>Marathi</option>
                <option>Tamil</option>
              </select>
            </div>

            {/* Text or voice input */}
            {mode === "text" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Describe the incident
                </label>
                <textarea
                  rows={6}
                  placeholder="Type your complaint here, in as much detail as possible..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Record your complaint
                </label>
                <div className="border border-dashed border-slate-300 rounded-lg py-10 flex flex-col items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition ${
                      isRecording ? "bg-red-600" : "bg-green-800"
                    }`}
                  >
                    {isRecording ? (
                      <Square className="text-white" size={22} fill="white" />
                    ) : (
                      <Mic className="text-white" size={26} />
                    )}
                  </button>
                  <p className="text-sm text-slate-500">
                    {isRecording ? "Recording... tap to stop" : "Tap to start recording"}
                  </p>
                  {/* TODO: actual audio recording logic + waveform yahan lagana */}
                </div>
              </div>
            )}

            {/* Incident type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Incident type</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700">
                <option>Theft</option>
                <option>Fraud / cybercrime</option>
                <option>Assault</option>
                <option>Missing person</option>
                <option>Property damage</option>
                <option>Other</option>
              </select>
            </div>

            {/* Date + location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of incident</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>
              </div>
            </div>

            {/* Evidence upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Evidence <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="border border-dashed border-slate-300 rounded-lg py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Paperclip size={20} />
                <p className="text-xs">Attach photos, documents, or files</p>
                {/* TODO: file upload logic yahan lagana */}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-800 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-green-900 transition"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}