import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "hi-en", name: "Hinglish", native: "हिंग्लिश" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
];

export default function ChooseLanguage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en");

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
        <div className="h-1.5 flex">
          <div className="flex-1 bg-orange-600" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-green-700" />
        </div>

        <div className="p-7">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 mb-6"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose Your Language</h1>
          <p className="text-sm text-slate-500 mb-6">Select your preferred language</p>

          <div className="grid grid-cols-2 gap-3 mb-7">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
                  selected === lang.code
                    ? "border-green-700 bg-green-50"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                }`}
              >
                {selected === lang.code && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-700 flex items-center justify-center">
                    <Check className="text-white" size={12} strokeWidth={3} />
                  </div>
                )}
                <span className="font-semibold text-slate-800 text-base">{lang.native}</span>
                <span className="text-xs text-slate-500">{lang.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-800 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-green-900 transition mb-3"
          >
            Continue
          </button>

          <p className="text-xs text-slate-500 text-center">
            You can change the language anytime from settings.
          </p>
        </div>
      </div>
    </div>
  );
}