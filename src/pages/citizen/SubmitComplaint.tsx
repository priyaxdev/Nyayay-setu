// import { useNavigate } from "react-router";
// import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
// import {
//   ArrowLeft,
//   MessageSquare,
//   Mic,
//   Paperclip,
//   Square,
//   Send,
//   Bot,
//   User,
//   CheckCircle2,
//   AlertCircle,
//   Sparkles,
//   RefreshCw,
//   ShieldAlert,
//   ArrowRight,
//   FileCheck,
// } from "lucide-react";
// import { useComplaintChat } from "../../hooks/useComplaintChat";
// import { useAuth } from "../../context/AuthContext";
// import type { ComplaintData } from "../../services/api";

// const SUGGESTIONS = [
//   "My mobile phone was stolen yesterday at the metro station.",
//   "Someone stole my motorcycle from the parking lot.",
//   "I was defrauded of Rs 15,000 through an online phishing link.",
//   "Physical altercation and assault reported near the local market.",
// ];

// export default function SubmitComplaint() {
//   const navigate = useNavigate();
//   const [mode, setMode] = useState<"text" | "voice">("text");
//   const [language, setLanguage] = useState("English");
//   const [inputText, setInputText] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [editableData, setEditableData] = useState<ComplaintData | null>(null);
//   const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTranscript, setRecordingTranscript] = useState("");
//   const [speechSupported, setSpeechSupported] = useState(true);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const recognitionRef = useRef<any>(null);

//   const {
//     messages,
//     complaintData,
//     state,
//     isSending,
//     error,
//     submittedComplaint,
//     sendMessage,
//     confirmAndSubmit,
//     resetConversation,
//   } = useComplaintChat({ language });

//   // Auto-scroll chat to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isSending]);

//   // Synchronize extracted data when chat state becomes ready for confirmation
//   useEffect(() => {
//     if (complaintData) {
//       setEditableData({ ...complaintData });
//     }
//     if (state === "READY_FOR_CONFIRMATION") {
//       setShowConfirmModal(true);
//     }
//   }, [state, complaintData]);

//   // Setup Web Speech API for voice recording
//   useEffect(() => {
//     const SpeechRecognition =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = language.toLowerCase().includes("hin") ? "hi-IN" : "en-IN";

//       recognition.onresult = (event: any) => {
//         let currentTranscript = "";
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           currentTranscript += event.results[i][0].transcript;
//         }
//         setRecordingTranscript(currentTranscript);
//       };

//       recognition.onerror = () => {
//         setIsRecording(false);
//       };

//       recognition.onend = () => {
//         setIsRecording(false);
//       };

//       recognitionRef.current = recognition;
//     } else {
//       setSpeechSupported(false);
//     }
//   }, [language]);

//   const toggleRecording = () => {
//     if (!speechSupported) {
//       alert("Speech recognition is not supported in this browser. Please use text mode or Chrome.");
//       return;
//     }

//     if (isRecording) {
//       recognitionRef.current?.stop();
//       setIsRecording(false);
//     } else {
//       setRecordingTranscript("");
//       try {
//         recognitionRef.current?.start();
//         setIsRecording(true);
//       } catch (err) {
//         console.error("Speech recognition start failed:", err);
//       }
//     }
//   };

//   const handleSendVoiceMessage = () => {
//     if (recordingTranscript.trim()) {
//       sendMessage(recordingTranscript.trim());
//       setRecordingTranscript("");
//       setMode("text");
//     }
//   };

//   const handleSendText = (e?: FormEvent) => {
//     if (e) e.preventDefault();
//     if (!inputText.trim() || isSending) return;
//     sendMessage(inputText.trim());
//     setInputText("");
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     sendMessage(suggestion);
//   };

//   const handleFileAttachment = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const fileName = e.target.files[0].name;
//       setEvidenceFiles((prev) => [...prev, fileName]);
//     }
//   };

//   const { user } = useAuth();

//   const handleFinalSubmit = async () => {
//     if (!editableData) return;
//     const finalPayload: ComplaintData = {
//       ...editableData,
//       victimName: editableData.victimName || user?.name || "Citizen Complainant",
//       evidence: evidenceFiles.length > 0 ? evidenceFiles : editableData.evidence,
//       language,
//     };
//     await confirmAndSubmit(finalPayload);
//     setShowConfirmModal(false);
//   };

//   // Completion percentage calculation for progress indicator
//   const calculateProgress = () => {
//     if (!complaintData) return 10;
//     let score = 20;
//     if (complaintData.incidentType) score += 20;
//     if (complaintData.description) score += 20;
//     if (complaintData.date || complaintData.location) score += 20;
//     if (complaintData.stolenItem || complaintData.accused) score += 20;
//     return Math.min(score, 100);
//   };

//   // If complaint is submitted, render the Success State
//   if (submittedComplaint) {
//     return (
//       <div className="min-h-screen bg-slate-100 px-4 py-10 flex items-center justify-center">
//         <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-800 animate-bounce">
//             <CheckCircle2 size={44} />
//           </div>

//           <span className="inline-block px-3.5 py-1 bg-green-50 text-green-800 text-xs font-semibold rounded-full mb-3 border border-green-200">
//             Complaint Registered Successfully
//           </span>

//           <h1 className="text-2xl font-bold text-slate-900 mb-2">Complaint Submitted</h1>
//           <p className="text-sm text-slate-600 mb-6">
//             Your complaint has been structured and securely registered in the NyayaSetu portal.
//           </p>

//           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
//               <div>
//                 <p className="text-xs text-slate-400 font-medium">Complaint Reference ID</p>
//                 <p className="text-lg font-bold text-green-900 font-mono tracking-wide">
//                   {submittedComplaint.complaintId}
//                 </p>
//               </div>
//               <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-blue-100 text-blue-800">
//                 {submittedComplaint.status}
//               </span>
//             </div>

//             <div className="space-y-1.5 text-xs text-slate-600">
//               <p>
//                 <span className="font-semibold text-slate-800">Incident Type:</span>{" "}
//                 <span className="capitalize">{submittedComplaint.incidentType || "General Incident"}</span>
//               </p>
//               <p>
//                 <span className="font-semibold text-slate-800">Location:</span>{" "}
//                 {submittedComplaint.location || "Not specified"}
//               </p>
//               <p>
//                 <span className="font-semibold text-slate-800">Date:</span>{" "}
//                 {submittedComplaint.date || "Today"}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => navigate(`/track-fir/${submittedComplaint.complaintId}`)}
//               className="flex-1 bg-green-800 hover:bg-green-900 text-white rounded-xl py-3 px-4 font-semibold text-sm transition flex items-center justify-center gap-2"
//             >
//               Track Complaint Status
//               <ArrowRight size={16} />
//             </button>
//             <button
//               onClick={() => navigate("/my-complaints")}
//               className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-3 px-4 font-semibold text-sm transition"
//             >
//               View My Complaints
//             </button>
//           </div>

//           <button
//             onClick={() => resetConversation()}
//             className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition"
//           >
//             File Another Complaint
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-6 sm:py-8">
//       <div className="w-full max-w-5xl mx-auto">
//         {/* Top bar */}
//         <div className="flex items-center justify-between mb-5">
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
//           >
//             <ArrowLeft size={18} />
//             Back to dashboard
//           </button>

//           <div className="flex items-center gap-3">
//             <label htmlFor="lang-select" className="text-xs text-slate-500 font-medium">
//               Assistant Language:
//             </label>
//             <select
//               id="lang-select"
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-700"
//             >
//               <option>English</option>
//               <option>Hindi</option>
//               <option>Hinglish</option>
//               <option>Bengali</option>
//               <option>Marathi</option>
//               <option>Tamil</option>
//             </select>
//           </div>
//         </div>

//         {/* Main Grid: Left Chat Stream, Right Real-time Structured Snapshot */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Left: Interactive Chat Column (7 cols) */}
//           <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl flex flex-col h-[700px] shadow-sm overflow-hidden">
//             {/* Header */}
//             <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
//                   <Bot size={22} />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
//                     NyayaBot AI Assistant
//                     <span className="flex h-2 w-2 relative">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
//                     </span>
//                   </h2>
//                   <p className="text-xs text-slate-500">Legal & Complaint Filing Helper</p>
//                 </div>
//               </div>

//               {/* Mode toggle */}
//               <div className="flex bg-slate-100 rounded-lg p-1">
//                 <button
//                   type="button"
//                   onClick={() => setMode("text")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-semibold transition ${
//                     mode === "text"
//                       ? "bg-white text-green-800 shadow-xs"
//                       : "text-slate-500 hover:text-slate-800"
//                   }`}
//                 >
//                   <MessageSquare size={14} />
//                   Text
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setMode("voice")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-semibold transition ${
//                     mode === "voice"
//                       ? "bg-white text-green-800 shadow-xs"
//                       : "text-slate-500 hover:text-slate-800"
//                   }`}
//                 >
//                   <Mic size={14} />
//                   Voice
//                 </button>
//               </div>
//             </div>

//             {/* Chat Messages Transcript */}
//             <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   {msg.role === "assistant" && (
//                     <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
//                       <Bot size={16} />
//                     </div>
//                   )}

//                   <div
//                     className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
//                       msg.role === "user"
//                         ? "bg-green-800 text-white rounded-tr-xs"
//                         : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
//                     {msg.timestamp && (
//                       <p
//                         className={`text-[10px] mt-1.5 text-right ${
//                           msg.role === "user" ? "text-green-200" : "text-slate-400"
//                         }`}
//                       >
//                         {msg.timestamp}
//                       </p>
//                     )}
//                   </div>

//                   {msg.role === "user" && (
//                     <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
//                       <User size={16} />
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {isSending && (
//                 <div className="flex gap-3 justify-start items-center">
//                   <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center flex-shrink-0 text-xs">
//                     <Bot size={16} />
//                   </div>
//                   <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
//                     <RefreshCw className="animate-spin text-green-700" size={14} />
//                     <span>NyayaBot is analyzing and structuring your details...</span>
//                   </div>
//                 </div>
//               )}

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2">
//                   <AlertCircle size={16} className="flex-shrink-0" />
//                   <span>{error}</span>
//                 </div>
//               )}

//               {/* Suggestions chips (shown at beginning) */}
//               {messages.length <= 1 && (
//                 <div className="mt-4 pt-2">
//                   <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1.5">
//                     <Sparkles size={14} className="text-amber-500" />
//                     Suggested quick starts:
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {SUGGESTIONS.map((item, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleSuggestionClick(item)}
//                         className="text-xs text-left bg-white hover:bg-green-50 border border-slate-200 hover:border-green-300 text-slate-700 rounded-lg px-3 py-2 transition shadow-xs"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Controls Footer */}
//             <div className="p-3 border-t border-slate-200 bg-white">
//               {mode === "text" ? (
//                 <form onSubmit={handleSendText} className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     placeholder="Type your complaint details here..."
//                     disabled={isSending}
//                     className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-slate-50"
//                   />
//                   <button
//                     type="submit"
//                     disabled={!inputText.trim() || isSending}
//                     className="bg-green-800 hover:bg-green-900 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 transition flex items-center justify-center font-medium"
//                   >
//                     <Send size={16} />
//                   </button>
//                 </form>
//               ) : (
//                 /* Voice input mode */
//                 <div className="flex flex-col items-center py-2 gap-3">
//                   <div className="flex items-center gap-4">
//                     <button
//                       type="button"
//                       onClick={toggleRecording}
//                       className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${
//                         isRecording
//                           ? "bg-red-600 text-white animate-pulse"
//                           : "bg-green-800 text-white hover:bg-green-900"
//                       }`}
//                     >
//                       {isRecording ? <Square size={18} fill="white" /> : <Mic size={22} />}
//                     </button>
//                     <div className="text-left">
//                       <p className="text-xs font-semibold text-slate-800">
//                         {isRecording ? "Listening... Speak now" : "Tap microphone to speak"}
//                       </p>
//                       <p className="text-[11px] text-slate-400">
//                         Speech will be auto-transcribed into your complaint
//                       </p>
//                     </div>
//                   </div>

//                   {recordingTranscript && (
//                     <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between gap-2">
//                       <span className="truncate flex-1 italic">"{recordingTranscript}"</span>
//                       <button
//                         type="button"
//                         onClick={handleSendVoiceMessage}
//                         className="bg-green-800 hover:bg-green-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
//                       >
//                         Send to NyayaBot
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Live Extracted Structured Snapshot (5 cols) */}
//           <div className="lg:col-span-5 flex flex-col space-y-4">
//             {/* Progress Card */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                   Extraction Progress
//                 </span>
//                 <span className="text-xs font-bold text-green-800">{calculateProgress()}%</span>
//               </div>
//               <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
//                 <div
//                   className="bg-green-700 h-2 rounded-full transition-all duration-500 ease-out"
//                   style={{ width: `${calculateProgress()}%` }}
//                 />
//               </div>

//               <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
//                 <FileCheck size={16} className="text-green-700" />
//                 Structured FIR Preview
//               </h3>

//               <div className="space-y-3 text-xs">
//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">Incident Type</span>
//                   <span className="font-semibold text-slate-800 capitalize">
//                     {complaintData?.incidentType || "Pending extraction..."}
//                   </span>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">Date & Time</span>
//                   <span className="font-semibold text-slate-800">
//                     {complaintData?.date ? `${complaintData.date}` : "Pending extraction..."}
//                     {complaintData?.time ? ` at ${complaintData.time}` : ""}
//                   </span>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">Incident Location</span>
//                   <span className="font-semibold text-slate-800">
//                     {complaintData?.location || "Pending extraction..."}
//                   </span>
//                 </div>

//                 {complaintData?.stolenItem && (
//                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                     <span className="text-slate-400 block mb-1">Stolen Item / Property</span>
//                     <span className="font-semibold text-slate-800 capitalize">
//                       {complaintData.stolenItem}
//                     </span>
//                   </div>
//                 )}

//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">Statement Summary</span>
//                   <p className="text-slate-700 leading-relaxed italic">
//                     {complaintData?.description
//                       ? `"${complaintData.description}"`
//                       : "Start typing in the chat to populate details."}
//                   </p>
//                 </div>
//               </div>

//               {/* Ready for Confirmation Banner */}
//               {state === "READY_FOR_CONFIRMATION" && (
//                 <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShieldAlert size={18} className="text-amber-700" />
//                     <span>All essential details collected!</span>
//                   </div>
//                   <button
//                     onClick={() => setShowConfirmModal(true)}
//                     className="bg-green-800 hover:bg-green-900 text-white px-3 py-1.5 rounded-lg font-semibold text-xs"
//                   >
//                     Review & Confirm
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Quick Actions / Reset */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
//               <button
//                 onClick={resetConversation}
//                 className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition"
//               >
//                 <RefreshCw size={14} />
//                 Reset & start over
//               </button>

//               {complaintData?.incidentType && (
//                 <button
//                   onClick={() => setShowConfirmModal(true)}
//                   className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition"
//                 >
//                   Manual Form Review
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Confirmation / Review Modal */}
//         {showConfirmModal && editableData && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl">
//               <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">Review Your Complaint</h2>
//                   <p className="text-xs text-slate-500">
//                     Verify all details extracted by NyayaBot before formal registration.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="text-slate-400 hover:text-slate-700 text-lg font-bold"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     Incident Type
//                   </label>
//                   <input
//                     type="text"
//                     value={editableData.incidentType || ""}
//                     onChange={(e) =>
//                       setEditableData({ ...editableData, incidentType: e.target.value })
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     Incident Description
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={editableData.description || ""}
//                     onChange={(e) =>
//                       setEditableData({ ...editableData, description: e.target.value })
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-1">
//                       Date of Incident
//                     </label>
//                     <input
//                       type="text"
//                       value={editableData.date || ""}
//                       onChange={(e) => setEditableData({ ...editableData, date: e.target.value })}
//                       placeholder="e.g. 2026-05-17 or Yesterday"
//                       className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-1">
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       value={editableData.location || ""}
//                       onChange={(e) =>
//                         setEditableData({ ...editableData, location: e.target.value })
//                       }
//                       className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     Stolen Item / Details (if applicable)
//                   </label>
//                   <input
//                     type="text"
//                     value={editableData.stolenItem || ""}
//                     onChange={(e) =>
//                       setEditableData({ ...editableData, stolenItem: e.target.value })
//                     }
//                     placeholder="e.g. iPhone 15, Wallet, Motorcycle"
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                   />
//                 </div>

//                 {/* Optional Evidence Attachment */}
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     Attach Evidence (Optional)
//                   </label>
//                   <label className="border border-dashed border-slate-300 hover:border-green-600 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-500 transition">
//                     <Paperclip size={18} />
//                     <span className="text-xs font-medium">Click to upload photos or documents</span>
//                     <input type="file" onChange={handleFileAttachment} className="hidden" />
//                   </label>
//                   {evidenceFiles.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {evidenceFiles.map((f, idx) => (
//                         <span
//                           key={idx}
//                           className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
//                         >
//                           📎 {f}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmModal(false)}
//                   className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-3 text-sm font-semibold transition"
//                 >
//                   Back to Chat
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleFinalSubmit}
//                   disabled={isSending}
//                   className="flex-1 bg-green-800 hover:bg-green-900 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
//                 >
//                   {isSending ? (
//                     <>
//                       <RefreshCw className="animate-spin" size={16} />
//                       Submitting...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 size={16} />
//                       Confirm & Submit Complaint
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useNavigate } from "react-router";
// import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
// import { useTranslation } from "react-i18next";
// import i18n from "../../i18n/locals";
// import {
//   ArrowLeft,
//   MessageSquare,
//   Mic,
//   Paperclip,
//   Square,
//   Send,
//   Bot,
//   User,
//   CheckCircle2,
//   AlertCircle,
//   Sparkles,
//   RefreshCw,
//   ShieldAlert,
//   ArrowRight,
//   FileCheck,
// } from "lucide-react";
// import { useComplaintChat } from "../../hooks/useComplaintChat";
// import { useAuth } from "../../context/AuthContext";
// import type { ComplaintData } from "../../services/api";

// const SUGGESTIONS = [
//   "My mobile phone was stolen yesterday at the metro station.",
//   "Someone stole my motorcycle from the parking lot.",
//   "I was defrauded of Rs 15,000 through an online phishing link.",
//   "Physical altercation and assault reported near the local market.",
// ];

// // Maps your existing AI-language dropdown values to i18next locale codes.
// // "Hinglish" has no dedicated locale file, so it falls back to English UI text.
// const LANG_TO_I18N: Record<string, string> = {
//   English: "en",
//   Hindi: "hi",
//   Hinglish: "en",
//   Bengali: "bn",
//   Marathi: "mr",
//   Tamil: "ta",
// };

// export default function SubmitComplaint() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [mode, setMode] = useState<"text" | "voice">("text");
//   const [language, setLanguage] = useState("English");
//   const [inputText, setInputText] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [editableData, setEditableData] = useState<ComplaintData | null>(null);
//   const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTranscript, setRecordingTranscript] = useState("");
//   const [speechSupported, setSpeechSupported] = useState(true);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const recognitionRef = useRef<any>(null);

//   const {
//     messages,
//     complaintData,
//     state,
//     isSending,
//     error,
//     submittedComplaint,
//     sendMessage,
//     confirmAndSubmit,
//     resetConversation,
//   } = useComplaintChat({ language });

//   // Auto-scroll chat to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isSending]);

//   // Synchronize extracted data when chat state becomes ready for confirmation
//   useEffect(() => {
//     if (complaintData) {
//       setEditableData({ ...complaintData });
//     }
//     if (state === "READY_FOR_CONFIRMATION") {
//       setShowConfirmModal(true);
//     }
//   }, [state, complaintData]);

//   // Setup Web Speech API for voice recording
//   useEffect(() => {
//     const SpeechRecognition =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = language.toLowerCase().includes("hin") ? "hi-IN" : "en-IN";

//       recognition.onresult = (event: any) => {
//         let currentTranscript = "";
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           currentTranscript += event.results[i][0].transcript;
//         }
//         setRecordingTranscript(currentTranscript);
//       };

//       recognition.onerror = () => {
//         setIsRecording(false);
//       };

//       recognition.onend = () => {
//         setIsRecording(false);
//       };

//       recognitionRef.current = recognition;
//     } else {
//       setSpeechSupported(false);
//     }
//   }, [language]);

//   // Change BOTH the AI-response language and the UI language together
//   const handleLanguageChange = (value: string) => {
//     setLanguage(value);
//     const i18nCode = LANG_TO_I18N[value] || "en";
//     i18n.changeLanguage(i18nCode);
//   };

//   const toggleRecording = () => {
//     if (!speechSupported) {
//       alert(t("submitComplaint.speechNotSupported"));
//       return;
//     }

//     if (isRecording) {
//       recognitionRef.current?.stop();
//       setIsRecording(false);
//     } else {
//       setRecordingTranscript("");
//       try {
//         recognitionRef.current?.start();
//         setIsRecording(true);
//       } catch (err) {
//         console.error("Speech recognition start failed:", err);
//       }
//     }
//   };

//   const handleSendVoiceMessage = () => {
//     if (recordingTranscript.trim()) {
//       sendMessage(recordingTranscript.trim());
//       setRecordingTranscript("");
//       setMode("text");
//     }
//   };

//   const handleSendText = (e?: FormEvent) => {
//     if (e) e.preventDefault();
//     if (!inputText.trim() || isSending) return;
//     sendMessage(inputText.trim());
//     setInputText("");
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     sendMessage(suggestion);
//   };

//   const handleFileAttachment = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const fileName = e.target.files[0].name;
//       setEvidenceFiles((prev) => [...prev, fileName]);
//     }
//   };

//   const { user } = useAuth();

//   const handleFinalSubmit = async () => {
//     if (!editableData) return;
//     const finalPayload: ComplaintData = {
//       ...editableData,
//       victimName: editableData.victimName || user?.name || "Citizen Complainant",
//       evidence: evidenceFiles.length > 0 ? evidenceFiles : editableData.evidence,
//       language,
//     };
//     await confirmAndSubmit(finalPayload);
//     setShowConfirmModal(false);
//   };

//   // Completion percentage calculation for progress indicator
//   const calculateProgress = () => {
//     if (!complaintData) return 10;
//     let score = 20;
//     if (complaintData.incidentType) score += 20;
//     if (complaintData.description) score += 20;
//     if (complaintData.date || complaintData.location) score += 20;
//     if (complaintData.stolenItem || complaintData.accused) score += 20;
//     return Math.min(score, 100);
//   };

//   // If complaint is submitted, render the Success State
//   if (submittedComplaint) {
//     return (
//       <div className="min-h-screen bg-slate-100 px-4 py-10 flex items-center justify-center">
//         <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-800 animate-bounce">
//             <CheckCircle2 size={44} />
//           </div>

//           <span className="inline-block px-3.5 py-1 bg-green-50 text-green-800 text-xs font-semibold rounded-full mb-3 border border-green-200">
//             {t("submitComplaint.successBadge")}
//           </span>

//           <h1 className="text-2xl font-bold text-slate-900 mb-2">{t("submitComplaint.complaintSubmitted")}</h1>
//           <p className="text-sm text-slate-600 mb-6">
//             {t("submitComplaint.submittedDesc")}
//           </p>

//           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
//               <div>
//                 <p className="text-xs text-slate-400 font-medium">{t("submitComplaint.refId")}</p>
//                 <p className="text-lg font-bold text-green-900 font-mono tracking-wide">
//                   {submittedComplaint.complaintId}
//                 </p>
//               </div>
//               <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-blue-100 text-blue-800">
//                 {submittedComplaint.status}
//               </span>
//             </div>

//             <div className="space-y-1.5 text-xs text-slate-600">
//               <p>
//                 <span className="font-semibold text-slate-800">{t("submitComplaint.incidentType")}:</span>{" "}
//                 <span className="capitalize">{submittedComplaint.incidentType || t("submitComplaint.generalIncident")}</span>
//               </p>
//               <p>
//                 <span className="font-semibold text-slate-800">{t("submitComplaint.location")}:</span>{" "}
//                 {submittedComplaint.location || t("submitComplaint.notSpecified")}
//               </p>
//               <p>
//                 <span className="font-semibold text-slate-800">{t("submitComplaint.date")}:</span>{" "}
//                 {submittedComplaint.date || t("submitComplaint.today")}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => navigate(`/track-fir/${submittedComplaint.complaintId}`)}
//               className="flex-1 bg-green-800 hover:bg-green-900 text-white rounded-xl py-3 px-4 font-semibold text-sm transition flex items-center justify-center gap-2"
//             >
//               {t("submitComplaint.trackStatus")}
//               <ArrowRight size={16} />
//             </button>
//             <button
//               onClick={() => navigate("/my-complaints")}
//               className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-3 px-4 font-semibold text-sm transition"
//             >
//               {t("submitComplaint.viewComplaints")}
//             </button>
//           </div>

//           <button
//             onClick={() => resetConversation()}
//             className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition"
//           >
//             {t("submitComplaint.fileAnother")}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-6 sm:py-8">
//       <div className="w-full max-w-5xl mx-auto">
//         {/* Top bar */}
//         <div className="flex items-center justify-between mb-5">
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
//           >
//             <ArrowLeft size={18} />
//             {t("common.backToDashboard")}
//           </button>

//           <div className="flex items-center gap-3">
//             <label htmlFor="lang-select" className="text-xs text-slate-500 font-medium">
//               {t("common.assistantLanguage")}:
//             </label>
//             <select
//               id="lang-select"
//               value={language}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//               className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-700"
//             >
//               <option>English</option>
//               <option>Hindi</option>
//               <option>Hinglish</option>
//               <option>Bengali</option>
//               <option>Marathi</option>
//               <option>Tamil</option>
//             </select>
//           </div>
//         </div>

//         {/* Main Grid: Left Chat Stream, Right Real-time Structured Snapshot */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Left: Interactive Chat Column (7 cols) */}
//           <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl flex flex-col h-[700px] shadow-sm overflow-hidden">
//             {/* Header */}
//             <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
//                   <Bot size={22} />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
//                     {t("submitComplaint.assistantName")}
//                     <span className="flex h-2 w-2 relative">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
//                     </span>
//                   </h2>
//                   <p className="text-xs text-slate-500">{t("submitComplaint.assistantTagline")}</p>
//                 </div>
//               </div>

//               {/* Mode toggle */}
//               <div className="flex bg-slate-100 rounded-lg p-1">
//                 <button
//                   type="button"
//                   onClick={() => setMode("text")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-semibold transition ${
//                     mode === "text"
//                       ? "bg-white text-green-800 shadow-xs"
//                       : "text-slate-500 hover:text-slate-800"
//                   }`}
//                 >
//                   <MessageSquare size={14} />
//                   {t("submitComplaint.text")}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setMode("voice")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-semibold transition ${
//                     mode === "voice"
//                       ? "bg-white text-green-800 shadow-xs"
//                       : "text-slate-500 hover:text-slate-800"
//                   }`}
//                 >
//                   <Mic size={14} />
//                   {t("submitComplaint.voice")}
//                 </button>
//               </div>
//             </div>

//             {/* Chat Messages Transcript */}
//             <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   {msg.role === "assistant" && (
//                     <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
//                       <Bot size={16} />
//                     </div>
//                   )}

//                   <div
//                     className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
//                       msg.role === "user"
//                         ? "bg-green-800 text-white rounded-tr-xs"
//                         : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
//                     {msg.timestamp && (
//                       <p
//                         className={`text-[10px] mt-1.5 text-right ${
//                           msg.role === "user" ? "text-green-200" : "text-slate-400"
//                         }`}
//                       >
//                         {msg.timestamp}
//                       </p>
//                     )}
//                   </div>

//                   {msg.role === "user" && (
//                     <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
//                       <User size={16} />
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {isSending && (
//                 <div className="flex gap-3 justify-start items-center">
//                   <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center flex-shrink-0 text-xs">
//                     <Bot size={16} />
//                   </div>
//                   <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
//                     <RefreshCw className="animate-spin text-green-700" size={14} />
//                     <span>{t("submitComplaint.botTyping")}</span>
//                   </div>
//                 </div>
//               )}

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2">
//                   <AlertCircle size={16} className="flex-shrink-0" />
//                   <span>{error}</span>
//                 </div>
//               )}

//               {/* Suggestions chips (shown at beginning) */}
//               {messages.length <= 1 && (
//                 <div className="mt-4 pt-2">
//                   <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1.5">
//                     <Sparkles size={14} className="text-amber-500" />
//                     {t("submitComplaint.suggestedQuickStarts")}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {SUGGESTIONS.map((item, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleSuggestionClick(item)}
//                         className="text-xs text-left bg-white hover:bg-green-50 border border-slate-200 hover:border-green-300 text-slate-700 rounded-lg px-3 py-2 transition shadow-xs"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Controls Footer */}
//             <div className="p-3 border-t border-slate-200 bg-white">
//               {mode === "text" ? (
//                 <form onSubmit={handleSendText} className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     placeholder={t("submitComplaint.inputPlaceholder") as string}
//                     disabled={isSending}
//                     className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-slate-50"
//                   />
//                   <button
//                     type="submit"
//                     disabled={!inputText.trim() || isSending}
//                     className="bg-green-800 hover:bg-green-900 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 transition flex items-center justify-center font-medium"
//                   >
//                     <Send size={16} />
//                   </button>
//                 </form>
//               ) : (
//                 /* Voice input mode */
//                 <div className="flex flex-col items-center py-2 gap-3">
//                   <div className="flex items-center gap-4">
//                     <button
//                       type="button"
//                       onClick={toggleRecording}
//                       className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${
//                         isRecording
//                           ? "bg-red-600 text-white animate-pulse"
//                           : "bg-green-800 text-white hover:bg-green-900"
//                       }`}
//                     >
//                       {isRecording ? <Square size={18} fill="white" /> : <Mic size={22} />}
//                     </button>
//                     <div className="text-left">
//                       <p className="text-xs font-semibold text-slate-800">
//                         {isRecording ? t("submitComplaint.listening") : t("submitComplaint.tapMic")}
//                       </p>
//                       <p className="text-[11px] text-slate-400">
//                         {t("submitComplaint.speechAutoTranscribe")}
//                       </p>
//                     </div>
//                   </div>

//                   {recordingTranscript && (
//                     <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between gap-2">
//                       <span className="truncate flex-1 italic">"{recordingTranscript}"</span>
//                       <button
//                         type="button"
//                         onClick={handleSendVoiceMessage}
//                         className="bg-green-800 hover:bg-green-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
//                       >
//                         {t("submitComplaint.sendToBot")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Live Extracted Structured Snapshot (5 cols) */}
//           <div className="lg:col-span-5 flex flex-col space-y-4">
//             {/* Progress Card */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                   {t("submitComplaint.extractionProgress")}
//                 </span>
//                 <span className="text-xs font-bold text-green-800">{calculateProgress()}%</span>
//               </div>
//               <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
//                 <div
//                   className="bg-green-700 h-2 rounded-full transition-all duration-500 ease-out"
//                   style={{ width: `${calculateProgress()}%` }}
//                 />
//               </div>

//               <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
//                 <FileCheck size={16} className="text-green-700" />
//                 {t("submitComplaint.structuredPreview")}
//               </h3>

//               <div className="space-y-3 text-xs">
//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">{t("submitComplaint.incidentType")}</span>
//                   <span className="font-semibold text-slate-800 capitalize">
//                     {complaintData?.incidentType || t("submitComplaint.pendingExtraction")}
//                   </span>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">{t("submitComplaint.dateTime")}</span>
//                   <span className="font-semibold text-slate-800">
//                     {complaintData?.date ? `${complaintData.date}` : t("submitComplaint.pendingExtraction")}
//                     {complaintData?.time ? ` at ${complaintData.time}` : ""}
//                   </span>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">{t("submitComplaint.incidentLocation")}</span>
//                   <span className="font-semibold text-slate-800">
//                     {complaintData?.location || t("submitComplaint.pendingExtraction")}
//                   </span>
//                 </div>

//                 {complaintData?.stolenItem && (
//                   <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                     <span className="text-slate-400 block mb-1">{t("submitComplaint.stolenItem")}</span>
//                     <span className="font-semibold text-slate-800 capitalize">
//                       {complaintData.stolenItem}
//                     </span>
//                   </div>
//                 )}

//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <span className="text-slate-400 block mb-1">{t("submitComplaint.statementSummary")}</span>
//                   <p className="text-slate-700 leading-relaxed italic">
//                     {complaintData?.description
//                       ? `"${complaintData.description}"`
//                       : t("submitComplaint.startTyping")}
//                   </p>
//                 </div>
//               </div>

//               {/* Ready for Confirmation Banner */}
//               {state === "READY_FOR_CONFIRMATION" && (
//                 <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShieldAlert size={18} className="text-amber-700" />
//                     <span>{t("submitComplaint.allDetailsCollected")}</span>
//                   </div>
//                   <button
//                     onClick={() => setShowConfirmModal(true)}
//                     className="bg-green-800 hover:bg-green-900 text-white px-3 py-1.5 rounded-lg font-semibold text-xs"
//                   >
//                     {t("submitComplaint.reviewConfirm")}
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Quick Actions / Reset */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
//               <button
//                 onClick={resetConversation}
//                 className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition"
//               >
//                 <RefreshCw size={14} />
//                 {t("submitComplaint.resetStartOver")}
//               </button>

//               {complaintData?.incidentType && (
//                 <button
//                   onClick={() => setShowConfirmModal(true)}
//                   className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition"
//                 >
//                   {t("submitComplaint.manualReview")}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Confirmation / Review Modal */}
//         {showConfirmModal && editableData && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl">
//               <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">{t("submitComplaint.reviewComplaint")}</h2>
//                   <p className="text-xs text-slate-500">
//                     {t("submitComplaint.verifyDetails")}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="text-slate-400 hover:text-slate-700 text-lg font-bold"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     {t("submitComplaint.incidentType")}
//                   </label>
//                   <input
//                     type="text"
//                     value={editableData.incidentType || ""}
//                     onChange={(e) =>
//                       setEditableData({ ...editableData, incidentType: e.target.value })
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     {t("submitComplaint.incidentDescription")}
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={editableData.description || ""}
//                     onChange={(e) =>
//                       setEditableData({ ...editableData, description: e.target.value })
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-1">
//                       {t("submitComplaint.dateOfIncident")}
//                     </label>
//                     <input
//                       type="text"
//                       value={editableData.date || ""}
//                       onChange={(e) => setEditableData({ ...editableData, date: e.target.value })}
//                       placeholder={t("submitComplaint.datePlaceholder") as string}
//                       className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-1">
//                       {t("submitComplaint.location")}
//                     </label>
//                     <input
//                       type="text"
//                       value={editableData.location || ""}
//                       onChange={(e) =>
//                         setEditableData({ ...editableData, location: e.target.value })
//                       }
//                       className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     {t("submitComplaint.stolenItemDetails")}
//                   </label>
//                   <input
//                     type="text"
//                     value={editableData.stolenItem || ""}
//                     onChange={(e) =>
//                       setEditableData({ ...editableData, stolenItem: e.target.value })
//                     }
//                     placeholder={t("submitComplaint.stolenItemPlaceholder") as string}
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
//                   />
//                 </div>

//                 {/* Optional Evidence Attachment */}
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     {t("submitComplaint.attachEvidence")}
//                   </label>
//                   <label className="border border-dashed border-slate-300 hover:border-green-600 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-500 transition">
//                     <Paperclip size={18} />
//                     <span className="text-xs font-medium">{t("submitComplaint.clickUpload")}</span>
//                     <input type="file" onChange={handleFileAttachment} className="hidden" />
//                   </label>
//                   {evidenceFiles.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {evidenceFiles.map((f, idx) => (
//                         <span
//                           key={idx}
//                           className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
//                         >
//                           📎 {f}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmModal(false)}
//                   className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-3 text-sm font-semibold transition"
//                 >
//                   {t("submitComplaint.backToChat")}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleFinalSubmit}
//                   disabled={isSending}
//                   className="flex-1 bg-green-800 hover:bg-green-900 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
//                 >
//                   {isSending ? (
//                     <>
//                       <RefreshCw className="animate-spin" size={16} />
//                       {t("submitComplaint.submitting")}
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 size={16} />
//                       {t("submitComplaint.confirmSubmit")}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router";
import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  MessageSquare,
  Mic,
  Paperclip,
  Square,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  FileCheck,
} from "lucide-react";

import { useComplaintChat } from "../../hooks/useComplaintChat";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import type { ComplaintData } from "../../services/api";

const SUGGESTIONS = [
  "My mobile phone was stolen yesterday at the metro station.",
  "Someone stole my motorcycle from the parking lot.",
  "I was defrauded of Rs 15,000 through an online phishing link.",
  "Physical altercation and assault reported near the local market.",
];

// Browser speech-recognition language
const SPEECH_LANGUAGE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  "hi-en": "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  ta: "ta-IN",
};

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // GLOBAL language state
  const { language, setLanguage, languages } = useLanguage();

  const { user } = useAuth();

  const [mode, setMode] = useState<"text" | "voice">("text");
  const [inputText, setInputText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editableData, setEditableData] =
    useState<ComplaintData | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTranscript, setRecordingTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const {
    messages,
    complaintData,
    state,
    isSending,
    error,
    submittedComplaint,
    sendMessage,
    confirmAndSubmit,
    resetConversation,
  } = useComplaintChat({ language });

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Keep editable data synchronized with AI extracted data
  useEffect(() => {
    if (complaintData) {
      setEditableData({ ...complaintData });
    }

    if (state === "READY_FOR_CONFIRMATION") {
      setShowConfirmModal(true);
    }
  }, [state, complaintData]);

  // Setup Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    // Use selected language
    recognition.lang =
      SPEECH_LANGUAGE_MAP[language] || "en-IN";

    recognition.onresult = (event: any) => {
      let currentTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        ++i
      ) {
        currentTranscript += event.results[i][0].transcript;
      }

      setRecordingTranscript(currentTranscript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore if already stopped
      }
    };
  }, [language]);

  // Change global language
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  // Voice recording
  const toggleRecording = () => {
    if (!speechSupported) {
      alert(t("submitComplaint.speechNotSupported"));
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setRecordingTranscript("");

      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  // Send voice transcript
  const handleSendVoiceMessage = () => {
    if (recordingTranscript.trim()) {
      sendMessage(recordingTranscript.trim());
      setRecordingTranscript("");
      setMode("text");
    }
  };

  // Send text message
  const handleSendText = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!inputText.trim() || isSending) return;

    sendMessage(inputText.trim());
    setInputText("");
  };

  // Quick suggestion
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Evidence attachment
  const handleFileAttachment = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;

      setEvidenceFiles((prev) => [...prev, fileName]);
    }
  };

  // Final complaint submission
  const handleFinalSubmit = async () => {
    if (!editableData) return;

    const finalPayload: ComplaintData = {
      ...editableData,

      victimName:
        editableData.victimName ||
        user?.name ||
        "Citizen Complainant",

      evidence:
        evidenceFiles.length > 0
          ? evidenceFiles
          : editableData.evidence,

      // IMPORTANT:
      // Save language code with complaint
      language,
    };

    await confirmAndSubmit(finalPayload);

    setShowConfirmModal(false);
  };

  // Progress calculation
  const calculateProgress = () => {
    if (!complaintData) return 10;

    let score = 20;

    if (complaintData.incidentType) score += 20;
    if (complaintData.description) score += 20;
    if (complaintData.date || complaintData.location) score += 20;
    if (complaintData.stolenItem || complaintData.accused)
      score += 20;

    return Math.min(score, 100);
  };

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (submittedComplaint) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-800 animate-bounce">
            <CheckCircle2 size={44} />
          </div>

          <span className="inline-block px-3.5 py-1 bg-green-50 text-green-800 text-xs font-semibold rounded-full mb-3 border border-green-200">
            {t("submitComplaint.successBadge")}
          </span>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t("submitComplaint.complaintSubmitted")}
          </h1>

          <p className="text-sm text-slate-600 mb-6">
            {t("submitComplaint.submittedDesc")}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {t("submitComplaint.refId")}
                </p>

                <p className="text-lg font-bold text-green-900 font-mono tracking-wide">
                  {submittedComplaint.complaintId}
                </p>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-blue-100 text-blue-800">
                {submittedComplaint.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">
                  {t("submitComplaint.incidentType")}:
                </span>{" "}
                <span className="capitalize">
                  {submittedComplaint.incidentType ||
                    t("submitComplaint.generalIncident")}
                </span>
              </p>

              <p>
                <span className="font-semibold text-slate-800">
                  {t("submitComplaint.location")}:
                </span>{" "}
                {submittedComplaint.location ||
                  t("submitComplaint.notSpecified")}
              </p>

              <p>
                <span className="font-semibold text-slate-800">
                  {t("submitComplaint.date")}:
                </span>{" "}
                {submittedComplaint.date ||
                  t("submitComplaint.today")}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() =>
                navigate(
                  `/track-fir/${submittedComplaint.complaintId}`
                )
              }
              className="flex-1 bg-green-800 hover:bg-green-900 text-white rounded-xl py-3 px-4 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              {t("submitComplaint.trackStatus")}
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/my-complaints")}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-3 px-4 font-semibold text-sm transition"
            >
              {t("submitComplaint.viewComplaints")}
            </button>
          </div>

          <button
            onClick={() => resetConversation()}
            className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition"
          >
            {t("submitComplaint.fileAnother")}
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN SCREEN
  // =========================

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:py-8">
      <div className="w-full max-w-5xl mx-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
          >
            <ArrowLeft size={18} />

            {t("common.backToDashboard")}
          </button>

          <div className="flex items-center gap-3">
            <label
              htmlFor="lang-select"
              className="text-xs text-slate-500 font-medium"
            >
              {t("common.assistantLanguage")}:
            </label>

            <select
              id="lang-select"
              value={language}
              onChange={(e) =>
                handleLanguageChange(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT CHAT */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl flex flex-col h-[700px] shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                  <Bot size={22} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {t("submitComplaint.assistantName")}

                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
                    </span>
                  </h2>

                  <p className="text-xs text-slate-500">
                    {t("submitComplaint.assistantTagline")}
                  </p>
                </div>
              </div>

              {/* MODE TOGGLE */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setMode("text")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-semibold transition ${
                    mode === "text"
                      ? "bg-white text-green-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <MessageSquare size={14} />
                  {t("submitComplaint.text")}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("voice")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-semibold transition ${
                    mode === "voice"
                      ? "bg-white text-green-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Mic size={14} />
                  {t("submitComplaint.voice")}
                </button>
              </div>
            </div>

            {/* CHAT */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                      msg.role === "user"
                        ? "bg-green-800 text-white rounded-tr-xs"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {msg.timestamp && (
                      <p
                        className={`text-[10px] mt-1.5 text-right ${
                          msg.role === "user"
                            ? "text-green-200"
                            : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}

              {/* BOT TYPING */}
              {isSending && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    <Bot size={16} />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                    <RefreshCw
                      className="animate-spin text-green-700"
                      size={14}
                    />

                    <span>
                      {t("submitComplaint.botTyping")}
                    </span>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} />

                  <span>{error}</span>
                </div>
              )}

              {/* SUGGESTIONS */}
              {messages.length <= 1 && (
                <div className="mt-4 pt-2">
                  <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1.5">
                    <Sparkles
                      size={14}
                      className="text-amber-500"
                    />

                    {t(
                      "submitComplaint.suggestedQuickStarts"
                    )}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleSuggestionClick(item)
                        }
                        className="text-xs text-left bg-white hover:bg-green-50 border border-slate-200 hover:border-green-300 text-slate-700 rounded-lg px-3 py-2 transition shadow-xs"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 border-t border-slate-200 bg-white">
              {mode === "text" ? (
                <form
                  onSubmit={handleSendText}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) =>
                      setInputText(e.target.value)
                    }
                    placeholder={
                      t(
                        "submitComplaint.inputPlaceholder"
                      ) as string
                    }
                    disabled={isSending}
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-slate-50"
                  />

                  <button
                    type="submit"
                    disabled={
                      !inputText.trim() || isSending
                    }
                    className="bg-green-800 hover:bg-green-900 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 transition flex items-center justify-center font-medium"
                  >
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center py-2 gap-3">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${
                        isRecording
                          ? "bg-red-600 text-white animate-pulse"
                          : "bg-green-800 text-white hover:bg-green-900"
                      }`}
                    >
                      {isRecording ? (
                        <Square
                          size={18}
                          fill="white"
                        />
                      ) : (
                        <Mic size={22} />
                      )}
                    </button>

                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-800">
                        {isRecording
                          ? t("submitComplaint.listening")
                          : t("submitComplaint.tapMic")}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {t(
                          "submitComplaint.speechAutoTranscribe"
                        )}
                      </p>
                    </div>
                  </div>

                  {recordingTranscript && (
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between gap-2">
                      <span className="truncate flex-1 italic">
                        "{recordingTranscript}"
                      </span>

                      <button
                        type="button"
                        onClick={handleSendVoiceMessage}
                        className="bg-green-800 hover:bg-green-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                      >
                        {t(
                          "submitComplaint.sendToBot"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SNAPSHOT */}
          <div className="lg:col-span-5 flex flex-col space-y-4">

            {/* PROGRESS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t(
                    "submitComplaint.extractionProgress"
                  )}
                </span>

                <span className="text-xs font-bold text-green-800">
                  {calculateProgress()}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="bg-green-700 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${calculateProgress()}%`,
                  }}
                />
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <FileCheck
                  size={16}
                  className="text-green-700"
                />

                {t(
                  "submitComplaint.structuredPreview"
                )}
              </h3>

              <div className="space-y-3 text-xs">

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-slate-400 block mb-1">
                    {t("submitComplaint.incidentType")}
                  </span>

                  <span className="font-semibold text-slate-800 capitalize">
                    {complaintData?.incidentType ||
                      t(
                        "submitComplaint.pendingExtraction"
                      )}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-slate-400 block mb-1">
                    {t("submitComplaint.dateTime")}
                  </span>

                  <span className="font-semibold text-slate-800">
                    {complaintData?.date ||
                      t(
                        "submitComplaint.pendingExtraction"
                      )}

                    {complaintData?.time
                      ? ` at ${complaintData.time}`
                      : ""}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-slate-400 block mb-1">
                    {t(
                      "submitComplaint.incidentLocation"
                    )}
                  </span>

                  <span className="font-semibold text-slate-800">
                    {complaintData?.location ||
                      t(
                        "submitComplaint.pendingExtraction"
                      )}
                  </span>
                </div>

                {complaintData?.stolenItem && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 block mb-1">
                      {t("submitComplaint.stolenItem")}
                    </span>

                    <span className="font-semibold text-slate-800 capitalize">
                      {complaintData.stolenItem}
                    </span>
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-slate-400 block mb-1">
                    {t(
                      "submitComplaint.statementSummary"
                    )}
                  </span>

                  <p className="text-slate-700 leading-relaxed italic">
                    {complaintData?.description
                      ? `"${complaintData.description}"`
                      : t(
                          "submitComplaint.startTyping"
                        )}
                  </p>
                </div>
              </div>

              {/* READY */}
              {state === "READY_FOR_CONFIRMATION" && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert
                      size={18}
                      className="text-amber-700"
                    />

                    <span>
                      {t(
                        "submitComplaint.allDetailsCollected"
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setShowConfirmModal(true)
                    }
                    className="bg-green-800 hover:bg-green-900 text-white px-3 py-1.5 rounded-lg font-semibold text-xs"
                  >
                    {t(
                      "submitComplaint.reviewConfirm"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <button
                onClick={resetConversation}
                className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition"
              >
                <RefreshCw size={14} />

                {t(
                  "submitComplaint.resetStartOver"
                )}
              </button>

              {complaintData?.incidentType && (
                <button
                  onClick={() =>
                    setShowConfirmModal(true)
                  }
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  {t(
                    "submitComplaint.manualReview"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONFIRMATION MODAL */}
        {showConfirmModal && editableData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl">

              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t(
                      "submitComplaint.reviewComplaint"
                    )}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {t(
                      "submitComplaint.verifyDetails"
                    )}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowConfirmModal(false)
                  }
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">

                {/* INCIDENT TYPE */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t(
                      "submitComplaint.incidentType"
                    )}
                  </label>

                  <input
                    type="text"
                    value={editableData.incidentType || ""}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        incidentType: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t(
                      "submitComplaint.incidentDescription"
                    )}
                  </label>

                  <textarea
                    rows={4}
                    value={editableData.description || ""}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
                  />
                </div>

                {/* DATE + LOCATION */}
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t(
                        "submitComplaint.dateOfIncident"
                      )}
                    </label>

                    <input
                      type="text"
                      value={editableData.date || ""}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          date: e.target.value,
                        })
                      }
                      placeholder={
                        t(
                          "submitComplaint.datePlaceholder"
                        ) as string
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t("submitComplaint.location")}
                    </label>

                    <input
                      type="text"
                      value={editableData.location || ""}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          location: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>

                </div>

                {/* STOLEN ITEM */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t(
                      "submitComplaint.stolenItemDetails"
                    )}
                  </label>

                  <input
                    type="text"
                    value={editableData.stolenItem || ""}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        stolenItem: e.target.value,
                      })
                    }
                    placeholder={
                      t(
                        "submitComplaint.stolenItemPlaceholder"
                      ) as string
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                </div>

                {/* EVIDENCE */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t(
                      "submitComplaint.attachEvidence"
                    )}
                  </label>

                  <label className="border border-dashed border-slate-300 hover:border-green-600 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-500 transition">
                    <Paperclip size={18} />

                    <span className="text-xs font-medium">
                      {t(
                        "submitComplaint.clickUpload"
                      )}
                    </span>

                    <input
                      type="file"
                      onChange={handleFileAttachment}
                      className="hidden"
                    />
                  </label>

                  {evidenceFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {evidenceFiles.map((f, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                        >
                          📎 {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmModal(false)
                  }
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-3 text-sm font-semibold transition"
                >
                  {t(
                    "submitComplaint.backToChat"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSending}
                  className="flex-1 bg-green-800 hover:bg-green-900 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSending ? (
                    <>
                      <RefreshCw
                        className="animate-spin"
                        size={16}
                      />

                      {t(
                        "submitComplaint.submitting"
                      )}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />

                      {t(
                        "submitComplaint.confirmSubmit"
                      )}
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}