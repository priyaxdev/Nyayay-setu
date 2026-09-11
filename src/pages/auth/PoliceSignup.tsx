// import { useNavigate } from "react-router";
// import { useState, type FormEvent } from "react";
// import { ArrowLeft, Eye, EyeOff, User, Phone, Mail, Lock, AlertCircle, RefreshCw, ShieldCheck, BadgeCheck } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// export default function PoliceSignup() {
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [name, setName] = useState("");
//   const [badgeNumber, setBadgeNumber] = useState("");
//   const [station, setStation] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!name.trim()) return setError("Please enter your full name.");
//     if (!badgeNumber.trim()) return setError("Badge / Service ID is required for police registration.");
//     if (!email.trim()) return setError("Please enter your official email address.");
//     if (password.length < 6) return setError("Password must be at least 6 characters long.");
//     if (password !== confirmPassword) return setError("Passwords do not match.");

//     setError(null);
//     setLoading(true);
//     try {
//       await signup({
//         name: name.trim(),
//         email: email.trim(),
//         phone: phone.trim() || undefined,
//         password,
//         role: "POLICE",
//         badgeNumber: badgeNumber.trim(),
//         station: station.trim() || undefined,
//       });
//       navigate("/police/dashboard");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden">
//         <div className="h-1.5 bg-blue-900" />

//         <div className="p-7">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
//           >
//             <ArrowLeft size={22} />
//           </button>

//           <div className="flex items-center gap-2.5 mb-1">
//             <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center">
//               <ShieldCheck className="text-white" size={18} />
//             </div>
//             <h1 className="text-2xl font-bold text-slate-900">Officer Registration</h1>
//           </div>
//           <p className="text-sm text-slate-500 mb-6">
//             Requires valid badge/service ID for verification
//           </p>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
//               <AlertCircle size={16} className="flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter your full name"
//                   required
//                   className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                 Badge / Service ID <span className="text-blue-800">*</span>
//               </label>
//               <div className="relative">
//                 <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input
//                   type="text"
//                   value={badgeNumber}
//                   onChange={(e) => setBadgeNumber(e.target.value)}
//                   placeholder="e.g. DL-4521"
//                   required
//                   className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//                 />
//               </div>
//               <p className="text-[11px] text-slate-400 mt-1">
//                 This uniquely identifies you as verified police personnel.
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                 Station Name <span className="text-slate-400 font-normal">(optional)</span>
//               </label>
//               <input
//                 type="text"
//                 value={station}
//                 onChange={(e) => setStation(e.target.value)}
//                 placeholder="e.g. Rajiv Chowk Police Station"
//                 className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="Enter mobile number"
//                   className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">Official Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter official email address"
//                   required
//                   className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Create a password (min 6 characters)"
//                   required
//                   className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm your password"
//                   required
//                   className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirm(!showConfirm)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
//                 >
//                   {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-950 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-blue-900 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <RefreshCw className="animate-spin" size={18} />
//                   Registering...
//                 </>
//               ) : (
//                 "Register as Officer"
//               )}
//             </button>
//           </form>

//           <p className="text-center text-sm text-slate-500 mt-6">
//             Already registered?{" "}
//             <button onClick={() => navigate("/police/login")} className="text-blue-900 font-semibold cursor-pointer hover:underline">
//               Login
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, User, Phone, Mail, Lock, AlertCircle, RefreshCw, ShieldCheck, BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function PoliceSignup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [station, setStation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError(t("auth.nameRequiredError"));
    if (!badgeNumber.trim()) return setError(t("policeAuth.badgeRequiredError"));
    if (!email.trim()) return setError(t("policeAuth.officialEmailRequiredError"));
    if (password.length < 6) return setError(t("auth.passwordTooShortError"));
    if (password !== confirmPassword) return setError(t("auth.passwordMismatchError"));

    setError(null);
    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role: "POLICE",
        badgeNumber: badgeNumber.trim(),
        station: station.trim() || undefined,
      });
      navigate("/police/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.signupFailedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden">
        <div className="h-1.5 bg-blue-900" />

        <div className="p-7">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 mb-6 cursor-pointer">
            <ArrowLeft size={22} />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t("policeAuth.officerRegistration")}</h1>
          </div>
          <p className="text-sm text-slate-500 mb-6">{t("policeAuth.registrationSubtitle")}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("auth.fullNameLabel")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.fullNamePlaceholder")}
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t("policeAuth.badgeLabel")} <span className="text-blue-800">*</span>
              </label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder={t("policeAuth.badgePlaceholder")}
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t("policeAuth.badgeHelper")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t("policeAuth.stationLabel")} <span className="text-slate-400 font-normal">({t("policeAuth.optional")})</span>
              </label>
              <input
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder={t("policeAuth.stationPlaceholder")}
                className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("auth.mobileLabel")}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("auth.mobilePlaceholder")}
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("policeAuth.officialEmailLabelForm")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.officialEmailPlaceholder")}
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("auth.passwordLabel")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.createPasswordPlaceholder")}
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("auth.confirmPasswordLabel")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  required
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  {t("policeAuth.registering")}
                </>
              ) : (
                t("policeAuth.registerAsOfficer")
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t("policeAuth.alreadyRegistered")}{" "}
            <button onClick={() => navigate("/police/login")} className="text-blue-900 font-semibold cursor-pointer hover:underline">
              {t("auth.loginButton")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}