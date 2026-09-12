import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { SupportModal } from './components/SupportModal';
import { HealthStatus } from './types/faq';
import { chatApi } from './api/chatApi';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [faqCount, setFaqCount] = useState<number>(0);
  const [supportModalOpen, setSupportModalOpen] = useState<boolean>(false);
  const [supportDetails, setSupportDetails] = useState<{ subject?: string; body?: string }>({});

  const fetchStatus = async () => {
    try {
      const data = await chatApi.fetchHealth();
      setHealth(data);
      setFaqCount(data.faqs_count);
    } catch {
      setHealth(null);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);

    const handleOpenSupport = (e: any) => {
      setSupportDetails({
        subject: e.detail?.subject,
        body: e.detail?.body,
      });
      setSupportModalOpen(true);
    };

    window.addEventListener('open-support-modal', handleOpenSupport);
    return () => {
      clearInterval(interval);
      window.removeEventListener('open-support-modal', handleOpenSupport);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        health={health}
        faqCount={faqCount}
        onOpenSupport={() => setSupportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'chat' ? (
          <HomePage />
        ) : (
          <AdminPage onFaqCountChange={fetchStatus} />
        )}
      </main>

      {/* Interactive Direct Email Support Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        defaultSubject={supportDetails.subject}
        defaultBody={supportDetails.body}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            CodeAlpha AI Internship • <span className="text-slate-300 font-medium">Task 2: FAQ Chatbot AI</span>
          </p>
          <p className="text-slate-400 text-[11px]">
            Built by <span className="text-indigo-400 font-semibold">Upasana Roy</span> with FastAPI, NLTK & React
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
