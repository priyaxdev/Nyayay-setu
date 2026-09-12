// import { useNavigate } from "react-router";
// import { useState, useEffect } from "react";
// import { ArrowLeft, MapPin, Phone, Navigation, Clock } from "lucide-react";

// interface PoliceStation {
//   name: string;
//   address: string;
//   distance: string;
//   phone: string;
//   hours: string;
// }

// const mockStations: PoliceStation[] = [
//   {
//     name: "Rajiv Chowk Police Station",
//     address: "Connaught Place, New Delhi",
//     distance: "1.2 km",
//     phone: "011-2334-5566",
//     hours: "24 hours",
//   },
//   {
//     name: "Karol Bagh Police Station",
//     address: "Karol Bagh, New Delhi",
//     distance: "3.5 km",
//     phone: "011-2575-1122",
//     hours: "24 hours",
//   },
//   {
//     name: "Paharganj Police Station",
//     address: "Paharganj, New Delhi",
//     distance: "4.1 km",
//     phone: "011-2358-9900",
//     hours: "24 hours",
//   },
// ];

// type LocationStatus = "idle" | "loading" | "granted" | "denied";

// export default function NearbyStation() {
//   const navigate = useNavigate();
//   const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

//   const detectLocation = () => {
//     if (!("geolocation" in navigator)) {
//       setLocationStatus("denied");
//       return;
//     }
//     setLocationStatus("loading");
//     navigator.geolocation.getCurrentPosition(
//       () => setLocationStatus("granted"),
//       () => setLocationStatus("denied")
//     );
//   };

//   useEffect(() => {
//     detectLocation();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-8">
//       <div className="w-full max-w-2xl mx-auto">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium cursor-pointer"
//         >
//           <ArrowLeft size={18} />
//           Back to dashboard
//         </button>

//         <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-5 shadow-xs">
//           <h1 className="text-2xl font-bold text-slate-900 mb-1">Nearby Police Stations</h1>
//           <p className="text-sm text-slate-500 mb-5">
//             Find the closest police station for in-person assistance or emergencies.
//           </p>

//           {locationStatus === "loading" && (
//             <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl p-3 mb-4">
//               Detecting your location...
//             </div>
//           )}

//           {locationStatus === "denied" && (
//             <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
//               <span>Location access denied. Showing default nearby stations.</span>
//               <button onClick={detectLocation} className="font-semibold underline cursor-pointer flex-shrink-0">
//                 Retry
//               </button>
//             </div>
//           )}

//           {locationStatus === "granted" && (
//             <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl p-3 mb-4">
//               Location detected — showing stations near you.
//             </div>
//           )}

//           <div className="space-y-3">
//             {mockStations.map((station) => (
//               <div key={station.name} className="border border-slate-200 rounded-xl p-4 hover:border-green-700 transition">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-sm font-bold text-slate-900">{station.name}</p>
//                     <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
//                       <MapPin size={12} />
//                       {station.address}
//                     </p>
//                     <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
//                       <span className="flex items-center gap-1">
//                         <Phone size={12} />
//                         {station.phone}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock size={12} />
//                         {station.hours}
//                       </span>
//                     </div>
//                   </div>
//                   <span className="text-xs font-semibold text-green-800 bg-green-50 px-2.5 py-1 rounded-full flex-shrink-0">
//                     {station.distance}
//                   </span>
//                 </div>

//                 <a
//                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + " " + station.address)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-green-800 hover:bg-green-900 rounded-lg py-2 transition"
//                 >
//                   <Navigation size={13} />
//                   Get Directions
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center justify-center gap-2 bg-orange-50 rounded-lg py-3">
//           <Phone className="text-orange-700" size={16} />
//           <p className="text-sm text-slate-700">
//             Emergency helpline: <span className="font-bold text-orange-800">100 / 112</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// import { useNavigate } from "react-router";
// import { useState, useEffect } from "react";
// import { ArrowLeft, MapPin, Phone, Navigation, Clock } from "lucide-react";
// import { useTranslation } from "react-i18next";

// interface PoliceStation {
//   name: string;
//   address: string;
//   distance: string;
//   phone: string;
//   hours: string;
// }

// const mockStations: PoliceStation[] = [
//   { name: "Rajiv Chowk Police Station", address: "Connaught Place, New Delhi", distance: "1.2 km", phone: "011-2334-5566", hours: "24 hours" },
//   { name: "Karol Bagh Police Station", address: "Karol Bagh, New Delhi", distance: "3.5 km", phone: "011-2575-1122", hours: "24 hours" },
//   { name: "Paharganj Police Station", address: "Paharganj, New Delhi", distance: "4.1 km", phone: "011-2358-9900", hours: "24 hours" },
// ];

// type LocationStatus = "idle" | "loading" | "granted" | "denied";

// export default function NearbyStation() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

//   const detectLocation = () => {
//     if (!("geolocation" in navigator)) {
//       setLocationStatus("denied");
//       return;
//     }
//     setLocationStatus("loading");
//     navigator.geolocation.getCurrentPosition(
//       () => setLocationStatus("granted"),
//       () => setLocationStatus("denied")
//     );
//   };

//   useEffect(() => {
//     detectLocation();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-8">
//       <div className="w-full max-w-2xl mx-auto">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium cursor-pointer"
//         >
//           <ArrowLeft size={18} />
//           {t("common.backToDashboard")}
//         </button>

//         <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-5 shadow-xs">
//           <h1 className="text-2xl font-bold text-slate-900 mb-1">{t("nearbyStation.title")}</h1>
//           <p className="text-sm text-slate-500 mb-5">{t("nearbyStation.subtitle")}</p>

//           {locationStatus === "loading" && (
//             <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl p-3 mb-4">
//               {t("nearbyStation.detecting")}
//             </div>
//           )}

//           {locationStatus === "denied" && (
//             <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
//               <span>{t("nearbyStation.denied")}</span>
//               <button onClick={detectLocation} className="font-semibold underline cursor-pointer flex-shrink-0">
//                 {t("nearbyStation.retry")}
//               </button>
//             </div>
//           )}

//           {locationStatus === "granted" && (
//             <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl p-3 mb-4">
//               {t("nearbyStation.granted")}
//             </div>
//           )}

//           <div className="space-y-3">
//             {mockStations.map((station) => (
//               <div key={station.name} className="border border-slate-200 rounded-xl p-4 hover:border-green-700 transition">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-sm font-bold text-slate-900">{station.name}</p>
//                     <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
//                       <MapPin size={12} />
//                       {station.address}
//                     </p>
//                     <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
//                       <span className="flex items-center gap-1">
//                         <Phone size={12} />
//                         {station.phone}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock size={12} />
//                         {station.hours}
//                       </span>
//                     </div>
//                   </div>
//                   <span className="text-xs font-semibold text-green-800 bg-green-50 px-2.5 py-1 rounded-full flex-shrink-0">
//                     {station.distance}
//                   </span>
//                 </div>

                
//                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + " " + station.address)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-green-800 hover:bg-green-900 rounded-lg py-2 transition"
//                 >
//                   <Navigation size={13} />
//                   {t("nearbyStation.getDirections")}
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center justify-center gap-2 bg-orange-50 rounded-lg py-3">
//           <Phone className="text-orange-700" size={16} />
//           <p className="text-sm text-slate-700">
//             {t("help.emergencyHelpline")}: <span className="font-bold text-orange-800">100 / 112</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Phone, Navigation, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PoliceStation {
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
}

const mockStations: PoliceStation[] = [
  { name: "Rajiv Chowk Police Station", address: "Connaught Place, New Delhi", distance: "1.2 km", phone: "011-2334-5566", hours: "24 hours" },
  { name: "Karol Bagh Police Station", address: "Karol Bagh, New Delhi", distance: "3.5 km", phone: "011-2575-1122", hours: "24 hours" },
  { name: "Paharganj Police Station", address: "Paharganj, New Delhi", distance: "4.1 km", phone: "011-2358-9900", hours: "24 hours" },
];

type LocationStatus = "idle" | "loading" | "granted" | "denied";

export default function NearbyStation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus("granted"),
      () => setLocationStatus("denied")
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft size={18} />
          {t("common.backToDashboard")}
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-5 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t("nearbyStation.title")}</h1>
          <p className="text-sm text-slate-500 mb-5">{t("nearbyStation.subtitle")}</p>

          {locationStatus === "loading" && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl p-3 mb-4">
              {t("nearbyStation.detecting")}
            </div>
          )}

          {locationStatus === "denied" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
              <span>{t("nearbyStation.denied")}</span>
              <button onClick={detectLocation} className="font-semibold underline cursor-pointer flex-shrink-0">
                {t("nearbyStation.retry")}
              </button>
            </div>
          )}

          {locationStatus === "granted" && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl p-3 mb-4">
              {t("nearbyStation.granted")}
            </div>
          )}

          <div className="space-y-3">
            {mockStations.map((station) => (
              <div key={station.name} className="border border-slate-200 rounded-xl p-4 hover:border-green-700 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{station.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {station.address}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {station.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {station.hours}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-800 bg-green-50 px-2.5 py-1 rounded-full flex-shrink-0">
                    {station.distance}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + " " + station.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-green-800 hover:bg-green-900 rounded-lg py-2 transition"
                >
                  <Navigation size={13} />
                  {t("nearbyStation.getDirections")}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-orange-50 rounded-lg py-3">
          <Phone className="text-orange-700" size={16} />
          <p className="text-sm text-slate-700">
            {t("help.emergencyHelpline")}: <span className="font-bold text-orange-800">100 / 112</span>
          </p>
        </div>
      </div>
    </div>
  );
}