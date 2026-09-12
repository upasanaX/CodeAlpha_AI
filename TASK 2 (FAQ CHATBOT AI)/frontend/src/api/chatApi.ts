import { ChatApiResponse, FAQItem, HealthStatus } from '../types/faq';

const API_BASE = '/api';

export const chatApi = {
  /**
   * Sends user query to the backend NLP similarity engine.
   */
  async sendMessage(message: string): Promise<ChatApiResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error: ${res.status}`);
    }
    return res.json();
  },

  /**
   * Retrieves all FAQs from the database with optional search and category filters.
   */
  async fetchFaqs(category?: string, search?: string): Promise<FAQItem[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE}/faqs${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    return res.json();
  },

  /**
   * Creates a new FAQ item and causes backend TF-IDF vectorizer re-training.
   */
  async createFaq(data: { question: string; answer: string; category: string }): Promise<FAQItem> {
    const res = await fetch(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create FAQ');
    }
    return res.json();
  },

  /**
   * Updates an existing FAQ.
   */
  async updateFaq(id: number, data: { question?: string; answer?: string; category?: string }): Promise<FAQItem> {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update FAQ');
    }
    return res.json();
  },

  /**
   * Deletes an FAQ item.
   */
  async deleteFaq(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete FAQ');
    return res.json();
  },

  /**
   * Resets database to sample seeded FAQs.
   */
  async reseedFaqs(): Promise<{ message: string; count: number }> {
    const res = await fetch(`${API_BASE}/faqs/seed`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reseed FAQs');
    return res.json();
  },

  /**
   * Checks health and active FAQ counts.
   */
  async fetchHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend is unreachable');
    return res.json();
  },

  /**
   * Fetches list of all distinct categories.
   */
  async fetchCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return ['General'];
    return res.json();
  },
};
