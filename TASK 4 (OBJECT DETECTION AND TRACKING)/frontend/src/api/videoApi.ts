import { Session, DetectionRecord, UploadResponse, HealthResponse, User, AuthResponse } from '../types';

const API_BASE = '/api';

export const videoApi = {
  // Token helper
  getToken(): string | null {
    return localStorage.getItem('trackoptic_token');
  },

  setToken(token: string) {
    localStorage.setItem('trackoptic_token', token);
  },

  removeToken() {
    localStorage.removeItem('trackoptic_token');
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Auth APIs
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async login(usernameOrEmail: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Invalid username/email or password');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) {
        this.removeToken();
        return null;
      }
      return res.json();
    } catch {
      return null;
    }
  },

  // Health
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  // Video Upload
  async uploadVideo(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload_video`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  async startProcessing(sourceType: 'webcam' | 'file', videoId?: string) {
    const res = await fetch(`${API_BASE}/start_processing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({
        source_type: sourceType,
        video_id: videoId,
      }),
    });
    if (!res.ok) throw new Error('Failed to start processing');
    return res.json();
  },

  async stopProcessing(sessionId?: number) {
    const res = await fetch(`${API_BASE}/stop_processing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    return res.json();
  },

  // Sessions
  async getSessions(filterUser: boolean = false): Promise<Session[]> {
    const url = filterUser ? `${API_BASE}/sessions?filter_user=true` : `${API_BASE}/sessions`;
    const res = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load sessions');
    return res.json();
  },

  async deleteSession(sessionId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete session');
  },

  async getDetections(sessionId: number): Promise<DetectionRecord[]> {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/detections`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load detections');
    return res.json();
  },

  getExportUrl(sessionId: number, format: 'csv' | 'json'): string {
    return `${API_BASE}/sessions/${sessionId}/export?format=${format}`;
  },

  getWebSocketUrl(
    sourceType: 'webcam' | 'file',
    videoId?: string,
    sessionId?: number,
    cameraIndex: number = 0,
    confThreshold: number = 0.4,
    iouThreshold: number = 0.3
  ): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const params = new URLSearchParams();
    params.append('source_type', sourceType);
    if (videoId) params.append('video_id', videoId);
    if (sessionId) params.append('session_id', sessionId.toString());
    params.append('camera_index', cameraIndex.toString());
    params.append('conf_threshold', confThreshold.toString());
    params.append('iou_threshold', iouThreshold.toString());

    const token = this.getToken();
    if (token) params.append('token', token);

    return `${protocol}//${host}/ws/video?${params.toString()}`;
  }
};
