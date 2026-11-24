import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Send, X, ExternalLink, AlertCircle } from 'lucide-react';
import { getEmailJSConfig, saveEmailJSConfig } from '../services/notificationService';
import emailjs from '@emailjs/browser';

export default function NotificationToastAndSettings() {
  const [toast, setToast] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(getEmailJSConfig());
  const [testStatus, setTestStatus] = useState(null);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    const handleNotification = (event) => {
      const { payload, emailjsResult } = event.detail || {};
      let title = 'Saved ✨';
      let subtitle = 'Notification captured for Harshit.';

      if (payload?.type === 'LONG_DRIVE_RSVP') {
        title = '🚗 Long Drive RSVP Sent!';
        subtitle = `Date: ${payload.date} (${payload.time})`;
      } else if (payload?.type === 'QUIZ_COMPLETION') {
        title = '🎯 Quiz Results Dispatched!';
        subtitle = `Score: ${payload.score}/${payload.total} (${payload.resultTier})`;
      } else if (payload?.type === 'WISHING_JAR_MESSAGE') {
        title = '🌟 Wish Saved & Sent!';
        subtitle = `"${payload.message?.slice(0, 40)}..."`;
      } else if (payload?.type === 'WALL_PERMISSION') {
        title = '🔓 Wall Permission Answered!';
        subtitle = payload.choice;
      }

      const isLive = emailjsResult?.success;
      setToast({ title, subtitle, isLive, time: Date.now() });

      setTimeout(() => {
        setToast((curr) => (curr && Date.now() - curr.time >= 4000 ? null : curr));
      }, 4500);
    };

    window.addEventListener('birthday-universe-notification', handleNotification);
    return () => window.removeEventListener('birthday-universe-notification', handleNotification);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    saveEmailJSConfig(config);
    setTestStatus({ type: 'success', text: 'EmailJS settings saved successfully!' });
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestStatus(null);

    const saved = saveEmailJSConfig(config);

    if (!saved.serviceId || !saved.templateId || !saved.publicKey) {
      setIsSendingTest(false);
      setTestStatus({
        type: 'error',
        text: 'Please enter Service ID, Template ID, and Public Key from your emailjs.com dashboard.'
      });
      return;
    }

    try {
      const templateParams = {
        to_email: saved.recipientEmail || 'harshitkurtakoti@gmail.com',
        to_name: 'Harshit',
        from_name: 'Birthday Universe Test',
        subject: '🧪 Test Email from Ashwini Birthday Universe',
        message: 'Hello Harshit! EmailJS is configured and working perfectly on your birthday project! ✨🐼',
        timestamp: new Date().toLocaleString()
      };

      const res = await emailjs.send(
        saved.serviceId,
        saved.templateId,
        templateParams,
        saved.publicKey
      );

      setTestStatus({
        type: 'success',
        text: `Success! Test email delivered to ${saved.recipientEmail}! (Status: ${res.status})`
      });
    } catch (err) {
      setTestStatus({
        type: 'error',
        text: `EmailJS Error: ${err?.text || err?.message || 'Check your Service ID, Template ID, and Public Key'}`
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <>
      {/* Discreet floating gear button in bottom corner for Harshit to inspect / configure EmailJS */}
      <div className="fixed bottom-3 right-3 z-40 pointer-events-auto">
        <button
          onClick={() => {
            setConfig(getEmailJSConfig());
            setIsOpen(true);
          }}
          className="p-2.5 rounded-full bg-white/70 hover:bg-white text-purple-800 shadow-md backdrop-blur-md border border-purple-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Email Notification Status & EmailJS Setup"
        >
          <Mail className="w-3.5 h-3.5 text-pink-600" />
          <span className="hidden sm:inline text-[11px] text-purple-900">Email Status</span>
          <span className={`w-2 h-2 rounded-full ${config.serviceId && config.publicKey ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
        </button>
      </div>

      {/* Live Toast Notification on Dispatches */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-14 right-3 z-50 max-w-sm w-full mx-auto p-3.5 rounded-2xl glass-panel bg-white/95 border border-purple-200 shadow-2xl flex items-start gap-3 pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-purple-950">{toast.title}</p>
              <p className="text-[11px] text-purple-700/90 truncate">{toast.subtitle}</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                {toast.isLive ? '✓ Delivered via EmailJS to Harshit' : '✓ Logged & Ready for Delivery'}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for EmailJS Setup & Live Test */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">EmailJS Configuration</h3>
                    <p className="text-[11px] text-purple-600">Direct notifications to Harshit</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-purple-900">
                  <p className="font-semibold mb-1">📬 How EmailJS delivers alerts:</p>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    When Ashwini submits the Long Drive RSVP, Quiz results, Wishing Jar, or Wall choice, EmailJS sends an instant notification to your inbox at <strong>harshitkurtakoti@gmail.com</strong>.
                  </p>
                </div>

                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={config.recipientEmail}
                      onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                      placeholder="harshitkurtakoti@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      EmailJS Service ID
                    </label>
                    <input
                      type="text"
                      value={config.serviceId}
                      onChange={(e) => setConfig({ ...config, serviceId: e.target.value })}
                      placeholder="e.g. service_xxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-pink-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      EmailJS Template ID
                    </label>
                    <input
                      type="text"
                      value={config.templateId}
                      onChange={(e) => setConfig({ ...config, templateId: e.target.value })}
                      placeholder="e.g. template_xxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-pink-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      EmailJS Public Key
                    </label>
                    <input
                      type="text"
                      value={config.publicKey}
                      onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                      placeholder="e.g. xxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-pink-400 outline-none font-mono"
                    />
                  </div>

                  {testStatus && (
                    <div
                      className={`p-2.5 rounded-xl text-[11px] font-medium flex items-start gap-2 ${
                        testStatus.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {testStatus.type === 'success' ? (
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{testStatus.text}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-all cursor-pointer"
                    >
                      Save Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleSendTest}
                      disabled={isSendingTest}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isSendingTest ? (
                        <span>Sending Test...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Test Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Don't have keys yet?</span>
                  <a
                    href="https://dashboard.emailjs.com/sign-up"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Free EmailJS Signup</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
