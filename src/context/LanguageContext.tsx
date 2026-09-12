// import { createContext, useContext, useState, type ReactNode } from "react";

// const languages = [
//   { code: "en", label: "English" },
//   { code: "hi", label: "हिंदी" },
//   { code: "hi-en", label: "Hinglish" },
//   { code: "bn", label: "বাংলা" },
//   { code: "mr", label: "मराठी" },
//   { code: "ta", label: "தமிழ்" },
// ];

// type LanguageContextType = {
//   language: string;
//   setLanguage: (code: string) => void;
//   languages: typeof languages;
// };

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguage] = useState("en");
//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, languages }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const ctx = useContext(LanguageContext);
//   if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
//   return ctx;
// }

// import { createContext, useContext, useState, type ReactNode } from "react";
// import i18n from "../i18n/locals";

// const languages = [
//   { code: "en", label: "English", name: "English" },
//   { code: "hi", label: "हिंदी", name: "Hindi" },
//   { code: "hi-en", label: "Hinglish", name: "Hinglish" },
//   { code: "bn", label: "বাংলা", name: "Bengali" },
//   { code: "mr", label: "मराठी", name: "Marathi" },
//   { code: "ta", label: "தமிழ்", name: "Tamil" },
// ];

// type LanguageContextType = {
//   language: string;
//   setLanguage: (code: string) => void;
//   languages: typeof languages;
// };

// const LanguageContext = createContext<LanguageContextType | undefined>(
//   undefined
// );

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguageState] = useState("en");

//   const setLanguage = (code: string) => {
//     setLanguageState(code);

//     // Change i18next UI language
//     const i18nCode = code === "hi-en" ? "en" : code;
//     i18n.changeLanguage(i18nCode);

//     // Save language so it stays after refresh
//     localStorage.setItem("nyayasetu_language", code);
//   };

//   return (
//     <LanguageContext.Provider
//       value={{
//         language,
//         setLanguage,
//         languages,
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const ctx = useContext(LanguageContext);

//   if (!ctx) {
//     throw new Error("useLanguage must be used within LanguageProvider");
//   }

//   return ctx;
// }
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import i18n from "../i18n/locals";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "hi-en", label: "Hinglish" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
];

type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => void;
  languages: typeof languages;
};

const LanguageContext =
  createContext<LanguageContextType | undefined>(
    undefined
  );

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState("en");

  const setLanguage = (code: string) => {
    setLanguageState(code);

    // Hinglish doesn't have its own JSON file,
    // so use English UI translations for now.
    const i18nLanguage =
      code === "hi-en" ? "en" : code;

    i18n.changeLanguage(i18nLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error(
      "useLanguage must be used within LanguageProvider"
    );
  }

  return ctx;
}
