import { useNavigate } from "react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PoliceLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password, "POLICE");
      navigate("/police/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden">
        <div className="h-1.5 bg-blue-900" />

        <div className="p-7">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Police Portal</h1>
          </div>
          <p className="text-sm text-slate-500 mb-6">Authorized personnel login only</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your official email"
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-950 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-blue-900 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                "Login to Portal"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New officer?{" "}
            <button
              onClick={() => navigate("/police/signup")}
              className="text-blue-900 font-semibold cursor-pointer hover:underline"
            >
              Register here
            </button>
          </p>
          <p className="text-center text-xs text-slate-400 mt-3">
            Citizen?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-800 underline cursor-pointer">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}