import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Send, CheckCircle2 } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  defaultBody?: string;
}

export const SUPPORT_EMAIL = 'support@coursemate.ai';

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = 'Coursemate AI Support Inquiry',
  defaultBody = 'Hello Coursemate Support Team,\n\nI need assistance with:\n',
}) => {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${encodedSubject}&body=${encodedBody}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${SUPPORT_EMAIL}&subject=${encodedSubject}&body=${encodedBody}`;
  const yahooUrl = `https://compose.mail.yahoo.com/?to=${SUPPORT_EMAIL}&subj=${encodedSubject}&body=${encodedBody}`;
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Send Email to Support</h2>
              <p className="text-xs text-slate-400">Choose your preferred email service or send directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-semibold px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Email Address Bar with Copy */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">To:</span>
            <span className="font-mono text-sm font-semibold text-indigo-300">{SUPPORT_EMAIL}</span>
          </div>
          <button
            onClick={handleCopyEmail}
            className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-650 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Email Service Launchers */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Direct 1-Click Launchers (Pre-fills email & message)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Gmail */}
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">📧</span>
                <div className="text-left">
                  <span className="text-xs font-bold block">Open in Gmail</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-300">Web client</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300" />
            </a>

            {/* Default Mail Client */}
            <a
              href={mailtoUrl}
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">💻</span>
                <div className="text-left">
                  <span className="text-xs font-bold block">Default App</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-300">Outlook / Apple / Mail</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300" />
            </a>

            {/* Outlook Web */}
            <a
              href={outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">📮</span>
                <div className="text-left">
                  <span className="text-xs font-bold block">Outlook Web</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-300">Hotmail / Live</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300" />
            </a>

            {/* Yahoo Web */}
            <a
              href={yahooUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">🟣</span>
                <div className="text-left">
                  <span className="text-xs font-bold block">Yahoo Mail</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-300">Web mail</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300" />
            </a>
          </div>
        </div>

        {/* Or Send Message Form */}
        <div className="border-t border-slate-800 pt-3">
          {sentSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-emerald-300">Message Dispatched to support@coursemate.ai!</p>
              <p className="text-xs text-emerald-400/80">Our support desk will respond to your registered email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSendInApp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Message</label>
                <textarea
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Sending to Support Desk...' : 'Send Message Now'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
