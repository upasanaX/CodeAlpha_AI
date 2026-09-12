import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { FAQItem } from '../types/faq';
import { chatApi } from '../api/chatApi';

const DEFAULT_CATEGORIES = [
  'Courses & Access',
  'Billing & Refunds',
  'Account & Security',
  'Certificates',
  'Technical Support',
  'General',
];

interface AdminPageProps {
  onFaqCountChange?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onFaqCountChange }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Courses & Access',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [faqList, catList] = await Promise.all([
        chatApi.fetchFaqs(selectedCategory, searchQuery),
        chatApi.fetchCategories(),
      ]);
      setFaqs(faqList);
      setCategories(catList);
      if (onFaqCountChange) onFaqCountChange();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load FAQs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const allCategoryOptions = Array.from(new Set([...DEFAULT_CATEGORIES, ...categories])).filter(Boolean);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'Courses & Access' });
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setModalOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    const isStandard = allCategoryOptions.includes(faq.category);
    if (isStandard) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      });
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    } else {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: '__CUSTOM__',
      });
      setIsCustomCategory(true);
      setCustomCategoryInput(faq.category);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingFaq(null);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = (isCustomCategory ? customCategoryInput.trim() : formData.category.trim()) || 'General';
    if (!formData.question.trim() || !formData.answer.trim()) return;

    const payload = {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      category: finalCategory,
    };

    try {
      setActionLoading(true);
      if (editingFaq) {
        await chatApi.updateFaq(editingFaq.id, payload);
        setFeedback({ type: 'success', message: 'FAQ updated and TF-IDF index refreshed!' });
      } else {
        await chatApi.createFaq(payload);
        setFeedback({ type: 'success', message: 'New FAQ added! NLP model automatically retrained.' });
      }
      closeModal();
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving FAQ' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ? This will update the TF-IDF model.')) {
      return;
    }

    try {
      setActionLoading(true);
      await chatApi.deleteFaq(id);
      setFeedback({ type: 'success', message: 'FAQ deleted and index updated.' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete FAQ' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Reset database to the 22 original sample FAQs? Any custom additions will be replaced.')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await chatApi.reseedFaqs();
      setFeedback({ type: 'success', message: `${res.message} TF-IDF model re-fitted.` });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to reseed database' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>FAQ Knowledge Base Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Add, update, or remove FAQs. The TF-IDF vectorizer and cosine similarity index automatically update on every modification.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReseed}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs sm:text-sm font-medium transition-all"
            title="Reset to initial 22 curated FAQs"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset Sample Seed</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-850 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question or answer keyword..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="flex space-x-1">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs List Table / Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm">Loading knowledge base...</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-850/50 rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-300">No FAQs found matching your criteria.</p>
          <p className="text-xs text-slate-500">Try clearing filters or click "Add New FAQ".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {faq.category}
                  </span>
                  <span className="text-[11px] text-slate-500">ID: #{faq.id}</span>
                </div>
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base leading-snug">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {faq.answer}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
                <button
                  onClick={() => openEditModal(faq)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors text-xs"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors text-xs"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">
              {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ to Knowledge Base'}
            </h2>
            <p className="text-xs text-slate-400">
              Upon saving, the NLP preprocessing and TF-IDF matrix will re-fit automatically.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="faq-category-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="faq-category-select"
                    value={isCustomCategory ? '__CUSTOM__' : formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__CUSTOM__') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    {allCategoryOptions.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-800 text-slate-100 py-1">
                        {cat}
                      </option>
                    ))}
                    <option value="__CUSTOM__" className="bg-slate-800 text-indigo-400 font-semibold py-1">
                      + Create Custom Category...
                    </option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {isCustomCategory && (
                  <div className="mt-2.5 animate-fade-in">
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Type custom category name (e.g., Mobile App)..."
                      required={isCustomCategory}
                      className="w-full bg-slate-800/90 border border-indigo-500/60 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g., How do I download my certificate?"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Answer
                </label>
                <textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed, helpful answer to provide the user..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-2"
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingFaq ? 'Save Changes' : 'Create FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
