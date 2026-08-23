import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Phone, Mail, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "How do I file a complaint?",
    a: "Go to 'Submit Complaint' from the dashboard, choose text or voice mode, fill in the incident details, and submit. You'll get a complaint ID to track its status.",
  },
  {
    q: "How long does it take for an FIR to be registered?",
    a: "Timelines vary by case, but you can track live status anytime from 'My Complaints' or 'FIR Status'. Each stage — review, draft, verification — is updated in real time.",
  },
  {
    q: "Can I file a complaint in my regional language?",
    a: "Yes. Suraksha Setu supports Hindi, English, Hinglish, and several regional languages with automatic detection and translation.",
  },
  {
    q: "What if I entered wrong details in my complaint?",
    a: "Contact support using the options below, or reach out to the verifying officer once your complaint reaches the 'Officer Verification' stage.",
  },
  {
    q: "Is my personal information kept confidential?",
    a: "Yes, your details are only accessible to verified police personnel handling your case.",
  },
];

export default function HelpSupport() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Help & Support</h1>
          <p className="text-sm text-slate-500 mb-6">
            Find answers to common questions or reach out to us directly.
          </p>

          {/* FAQ accordion */}
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-medium text-slate-800">{faq.q}</span>
                  <ChevronDown
                    className={`text-slate-400 flex-shrink-0 ml-3 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                    size={18}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact options */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7">
          <h2 className="font-semibold text-slate-800 mb-4">Still need help?</h2>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="border border-slate-200 rounded-xl p-4 text-center">
              <Phone className="text-green-800 mx-auto mb-2" size={20} />
              <p className="text-xs font-semibold text-slate-800">Call us</p>
              <p className="text-xs text-slate-500 mt-1">1800-XXX-XXXX</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 text-center">
              <Mail className="text-green-800 mx-auto mb-2" size={20} />
              <p className="text-xs font-semibold text-slate-800">Email</p>
              <p className="text-xs text-slate-500 mt-1">support@suraksha.gov.in</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 text-center">
              <MessageCircle className="text-green-800 mx-auto mb-2" size={20} />
              <p className="text-xs font-semibold text-slate-800">Live chat</p>
              <p className="text-xs text-slate-500 mt-1">9 AM – 9 PM</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-orange-50 rounded-lg py-3">
            <Phone className="text-orange-700" size={16} />
            <p className="text-sm text-slate-700">
              Emergency helpline: <span className="font-bold text-orange-800">100 / 112</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}