import { useNavigate } from "react-router";
import { ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Camera, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Citizen User";
  const displayEmail = user?.email || "Not provided";
  const displayPhone = user?.phone || "+91 98765 43210";
  const displayRole = user?.role === "POLICE" ? "Police Officer" : "Citizen";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently joined";

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium transition cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-5 shadow-xs">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-7">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <UserIcon className="text-green-800" size={36} />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green-800 flex items-center justify-center border-2 border-white cursor-pointer">
                <Camera className="text-white" size={13} />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-800 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  {displayRole}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">Member since {joinedDate}</p>
            </div>
          </div>

          {/* Details form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  defaultValue={displayName}
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  defaultValue={displayEmail}
                  disabled
                  className="w-full border border-slate-300 bg-slate-50 rounded-lg pl-10 pr-3 py-3 text-sm text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  defaultValue={displayPhone}
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  defaultValue="New Delhi, India"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>

            <button className="w-full bg-green-800 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-green-900 transition cursor-pointer shadow-xs">
              Save Profile Changes
            </button>
          </div>
        </div>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 rounded-xl py-3.5 text-sm font-semibold hover:bg-red-50 transition cursor-pointer shadow-xs"
          >
            <LogOut size={18} />
            Logout from NyayaSetu
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 bg-green-800 text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-green-900 transition cursor-pointer shadow-xs"
          >
            Login to Your Account
          </button>
        )}
      </div>
    </div>
  );
}