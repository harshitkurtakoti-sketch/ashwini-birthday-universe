import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Send, X, ExternalLink, AlertCircle, Inbox, Copy, Trash2, Sparkles } from 'lucide-react';
import { getEmailJSConfig, saveEmailJSConfig, getCapturedSubmissions } from '../services/notificationService';
import emailjs from '@emailjs/browser';

export default function NotificationToastAndSettings() {
  const [toast, setToast] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('responses'); // 'responses' | 'email'
  const [config, setConfig] = useState(getEmailJSConfig());
  const [submissions, setSubmissions] = useState(() => getCapturedSubmissions());
  const [testStatus, setTestStatus] = useState(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Synchronize captured submissions from local storage or events
  const refreshSubmissions = () => {
    setSubmissions(getCapturedSubmissions());
  };

  useEffect(() => {
    const handleNotification = (event) => {
      const { payload, emailjsResult } = event.detail || {};
      let title = 'Response Saved ✨';
      let subtitle = 'Notification captured for Harshit.';

      if (payload?.type === 'LONG_DRIVE_RSVP') {
        title = '🚗 Long Drive RSVP Captured!';
        subtitle = `Date: ${payload.date} (${payload.time})`;
      } else if (payload?.type === 'QUIZ_COMPLETION') {
        title = '🎯 Quiz Results Captured!';
        subtitle = `Score: ${payload.score}/${payload.total} (${payload.resultTier})`;
      } else if (payload?.type === 'WISHING_JAR_MESSAGE') {
        title = '🌟 Wish Saved & Captured!';
        subtitle = `"${payload.message?.slice(0, 40)}..."`;
      } else if (payload?.type === 'WALL_PERMISSION') {
        title = '🔓 Wall Permission Answered!';
        subtitle = payload.choice;
      }

      refreshSubmissions();
      const isLive = emailjsResult?.success;
      setToast({ title, subtitle, isLive, time: Date.now() });

      setTimeout(() => {
        setToast((curr) => (curr && Date.now() - curr.time >= 4000 ? null : curr));
      }, 4500);
    };

    window.addEventListener('birthday-universe-notification', handleNotification);
    return () => window.removeEventListener('birthday-universe-notification', handleNotification);
  }, []);

  const handleSaveEmail = (e) => {
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
        text: 'Enter your Service ID, Template ID, and Public Key from your emailjs.com dashboard.'
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

  const handleCopyText = (item) => {
    const text = item.formattedMessage || JSON.stringify(item, null, 2);
    navigator.clipboard?.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearSubmissions = () => {
    if (window.confirm('Clear your local response history?')) {
      localStorage.removeItem('ashwini_all_submissions');
      setSubmissions([]);
    }
  };

  return (
    <>
      {/* Floating Responses & Email Hub Button */}
      <div className="fixed bottom-3 right-3 z-40 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => {
            refreshSubmissions();
            setConfig(getEmailJSConfig());
            setIsOpen(true);
          }}
          className="px-3 py-2 rounded-full bg-white/90 hover:bg-white text-purple-900 shadow-lg backdrop-blur-md border border-purple-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-semibold"
          title="Open Live Responses & Email Settings"
        >
          <Inbox className="w-4 h-4 text-pink-600" />
          <span>Responses</span>
          {submissions.length > 0 ? (
            <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold">
              {submissions.length}
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Floating Real-time Event Toast */}
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
                {toast.isLive ? '✓ Delivered to inbox via EmailJS' : '✓ Captured in your Responses Hub'}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Master Hub Modal: Live Responses & Email Settings */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-purple-100 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Ashwini's Response Hub</h3>
                    <p className="text-[11px] text-purple-600">Everything Ashwini submits is stored here</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 my-3 p-1 rounded-xl bg-purple-50">
                <button
                  onClick={() => setActiveTab('responses')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'responses'
                      ? 'bg-white text-purple-900 shadow-sm'
                      : 'text-purple-600 hover:text-purple-900'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Live Responses ({submissions.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'email'
                      ? 'bg-white text-purple-900 shadow-sm'
                      : 'text-purple-600 hover:text-purple-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Configuration</span>
                </button>
              </div>

              {/* TAB 1: LIVE RESPONSES HUB */}
              {activeTab === 'responses' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {submissions.length === 0 ? (
                    <div className="py-12 text-center text-purple-700 flex flex-col items-center">
                      <Sparkles className="w-8 h-8 text-pink-400 mb-2 animate-bounce" />
                      <p className="font-bold text-slate-800 text-sm">No responses yet!</p>
                      <p className="text-[11px] text-purple-600 max-w-xs mt-1">
                        When Ashwini answers the Long Drive RSVP, Quiz, Wishing Jar, or Wall Card, her full answers will automatically appear here!
                      </p>
                    </div>
                  ) : (
                    submissions.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-white border border-purple-100 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
                            {item.subject || item.type}
                          </span>
                          <span className="text-[10px] text-purple-500 font-medium">
                            {item.receivedAt}
                          </span>
                        </div>

                        {item.type === 'LONG_DRIVE_RSVP' && (
                          <div className="p-2 rounded-xl bg-white/90 border border-purple-100/80 space-y-1 text-[11px] text-slate-700">
                            <p><strong className="text-pink-600">Date:</strong> {item.date}</p>
                            <p><strong className="text-pink-600">Time:</strong> {item.time}</p>
                            <p><strong className="text-pink-600">Note:</strong> "{item.playlistOrNote}"</p>
                          </div>
                        )}

                        {item.type === 'QUIZ_COMPLETION' && (
                          <div className="p-2 rounded-xl bg-white/90 border border-purple-100/80 space-y-1 text-[11px] text-slate-700">
                            <p><strong className="text-purple-600">Score:</strong> {item.score} / {item.total} ({item.resultTier})</p>
                          </div>
                        )}

                        {item.type === 'WISHING_JAR_MESSAGE' && (
                          <div className="p-2 rounded-xl bg-white/90 border border-purple-100/80 space-y-1 text-[11px] text-slate-700">
                            <p><strong className="text-amber-600">Wish:</strong> "{item.message}"</p>
                          </div>
                        )}

                        {item.type === 'WALL_PERMISSION' && (
                          <div className="p-2 rounded-xl bg-white/90 border border-purple-100/80 space-y-1 text-[11px] text-slate-700">
                            <p><strong className="text-purple-600">Choice:</strong> "{item.choice}"</p>
                          </div>
                        )}

                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleCopyText(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-[10px] font-semibold text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Response</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {submissions.length > 0 && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={handleClearSubmissions}
                        className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear History</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EMAIL CONFIGURATION (EMAILJS & NETLIFY) */}
              {activeTab === 'email' && (
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                    <p className="font-bold flex items-center gap-1.5 text-xs text-emerald-800 mb-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Netlify Native Forms Enabled</span>
                    </p>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Your website is already wired with <strong>Netlify Forms</strong>! When hosted on Netlify, every response is automatically captured on your Netlify dashboard and can send free alerts directly to <strong>harshitkurtakoti@gmail.com</strong> without any third-party keys!
                    </p>
                  </div>

                  <form onSubmit={handleSaveEmail} className="space-y-3">
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
                    <span>EmailJS Account</span>
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
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
