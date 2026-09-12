export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  matched_question?: string | null;
  confidence?: number;
  category?: string | null;
  is_fallback?: boolean;
  timestamp: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  created_at?: string;
}

export interface ChatApiResponse {
  answer: string;
  matched_question: string | null;
  confidence: number;
  category: string | null;
  faq_id: number | null;
  is_fallback: boolean;
}

export interface HealthStatus {
  status: string;
  faqs_count: number;
  threshold: number;
  categories: string[];
}
