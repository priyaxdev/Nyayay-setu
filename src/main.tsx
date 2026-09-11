// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router";
// import './i18n';
// import "./index.css";
// import App from "./App.tsx";
// import { AuthProvider } from "./context/AuthContext";
// import { LanguageProvider } from "./context/LanguageContext";


// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <LanguageProvider>
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </LanguageProvider>
//     </BrowserRouter>
//   </StrictMode>
// );
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "./i18n";
// import "./index.css";
// import App from "./App.tsx";
// import { AuthProvider } from "./context/AuthContext";
// import { LanguageProvider } from "./context/LanguageContext";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <LanguageProvider>
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </LanguageProvider>
//     </BrowserRouter>
//   </StrictMode>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./i18n/locals";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);