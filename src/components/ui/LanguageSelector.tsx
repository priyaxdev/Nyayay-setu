// import { useState } from "react";
// import { Globe, Check, ChevronDown } from "lucide-react";
// import { useLanguage } from "../../context/LanguageContext";

// export default function LanguageSelector() {
//   const { language, setLanguage, languages } = useLanguage();
//   const [open, setOpen] = useState(false);

//   const current = languages.find((l) => l.code === language);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-xs cursor-pointer"
//       >
//         <Globe size={16} className="text-green-800" />
//         <span className="font-medium text-xs">{current?.label}</span>
//         <ChevronDown size={14} className="text-slate-400" />
//       </button>

//       {open && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
//           <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
//             {languages.map((lang) => (
//               <button
//                 key={lang.code}
//                 onClick={() => {
//                   setLanguage(lang.code);
//                   setOpen(false);
//                 }}
//                 className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 text-left cursor-pointer"
//               >
//                 <span className={language === lang.code ? "font-semibold text-green-800" : "text-slate-700"}>
//                   {lang.label}
//                 </span>
//                 {language === lang.code && <Check size={14} className="text-green-700" />}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = languages.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-xs cursor-pointer"
      >
        <Globe size={16} className="text-green-800" />

        <span className="font-medium text-xs">
          {current?.label}
        </span>

        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 text-left cursor-pointer"
              >
                <span
                  className={
                    language === lang.code
                      ? "font-semibold text-green-800"
                      : "text-slate-700"
                  }
                >
                  {lang.label}
                </span>

                {language === lang.code && (
                  <Check size={14} className="text-green-700" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
