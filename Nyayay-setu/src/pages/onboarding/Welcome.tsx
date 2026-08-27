import { useNavigate } from "react-router";
import { Landmark, Phone } from "lucide-react";
import logo from "../../assets/logo.png"; 

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
        {/* Tricolor top strip */}
        <div className="h-1.5 flex">
          <div className="flex-1 bg-orange-600" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-green-700" />
        </div>

        <div className="p-7">
          {/* Logo row */}
          <div className="flex items-center gap-3 mb-7">
            <img
              src={logo}
              alt="Suraksha Setu logo"
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="font-bold text-slate-900 text-lg leading-none">Nyayay Setu</p>
              <p className="text-xs text-slate-500 mt-1">Citizen · Police · Safety</p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight mb-3">
            A Safer Community Starts with{" "}
            <span className="text-orange-700">You</span>
          </h1>
          <p className="text-base text-slate-600 mb-6 leading-relaxed">
            Report incidents, track FIR status, and help us build a safer society
            with the power of AI.
          </p>

          {/* Illustration - phone only, no police station */}
          <div className="relative h-56 rounded-xl bg-gradient-to-b from-orange-100 via-white to-green-100 flex items-center justify-center mb-7 overflow-hidden border border-slate-200">
            <div className="w-28 h-44 rounded-2xl border-[3px] border-slate-800 bg-white flex flex-col items-center justify-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center mb-2">
                <Landmark className="text-white" size={24} />
              </div>
              <p className="text-xs text-slate-700 font-medium text-center leading-tight">
                Your Voice<br />Matters
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => navigate("/language")}
              className="w-full bg-green-800 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-green-900 transition cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-white border border-slate-400 text-slate-800 rounded-lg py-3.5 text-base font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              I already have an account
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600 border-t border-slate-200 pt-4 mb-4">
            <span>Language:</span>
            <span className="font-semibold text-slate-800">English</span>
            <span className="text-slate-500">▾</span>
          </div>

          {/* Helpline */}
          <div className="flex items-center justify-center gap-2 bg-orange-100 rounded-lg py-3">
            <Phone className="text-orange-700" size={16} />
            <p className="text-sm text-slate-800">
              Emergency helpline: <span className="font-bold text-orange-800">100 / 112</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}