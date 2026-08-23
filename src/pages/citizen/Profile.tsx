import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Phone, MapPin, Camera, LogOut } from "lucide-react";

const userData = {
  name: "Priya",
  email: "priya.0104@email.com",
  mobile: "+91 98765 43210",
  address: "Rajiv Chowk, New Delhi",
  joined: "March 2026",
};

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-7">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <User className="text-green-800" size={36} />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green-800 flex items-center justify-center border-2 border-white">
                <Camera className="text-white" size={13} />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{userData.name}</h1>
              <p className="text-sm text-slate-500">Citizen · Member since {userData.joined}</p>
            </div>
          </div>

          {/* Details form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  defaultValue={userData.name}
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
                  defaultValue={userData.email}
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  defaultValue={userData.mobile}
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
                  defaultValue={userData.address}
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>

            <button className="w-full bg-green-800 text-white rounded-lg py-3.5 text-base font-semibold hover:bg-green-900 transition">
              Save Changes
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 rounded-xl py-3.5 text-sm font-semibold hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}