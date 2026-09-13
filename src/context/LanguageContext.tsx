/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import i18n from "../i18n/locals";

export type LanguageOption = {
  code: string;
  label: string;
  name: string;
  native: string;
};

export const languages: LanguageOption[] = [
  { code: "en", label: "English", name: "English", native: "English" },
  { code: "hi", label: "हिंदी", name: "Hindi", native: "हिंदी" },
  { code: "hi-en", label: "Hinglish", name: "Hinglish", native: "हिंग्लिश" },
  { code: "bn", label: "বাংলা", name: "Bengali", native: "বাংলা" },
  { code: "mr", label: "मराठी", name: "Marathi", native: "मराठी" },
  { code: "ta", label: "தமிழ்", name: "Tamil", native: "தமிழ்" },
];

type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => void;
  languages: LanguageOption[];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "nyayasetu_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && languages.some((l) => l.code === saved)) {
      const i18nLang = saved === "hi-en" ? "en" : saved;
      i18n.changeLanguage(i18nLang);
      return saved;
    }
    return "en";
  });

  const setLanguage = (code: string) => {
    setLanguageState(code);
    const i18nLanguage = code === "hi-en" ? "en" : code;
    i18n.changeLanguage(i18nLanguage);
    localStorage.setItem(STORAGE_KEY, code);
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
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
