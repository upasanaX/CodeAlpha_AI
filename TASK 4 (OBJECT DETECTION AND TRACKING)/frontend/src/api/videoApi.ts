import { Session, DetectionRecord, UploadResponse, HealthResponse } from '../types';

const API_BASE = '/api';

export const videoApi = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async uploadVideo(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload_video`, {
      method: 'POST',
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
      headers: { 'Content-Type': 'application/json' },
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

  async getSessions(): Promise<Session[]> {
    const res = await fetch(`${API_BASE}/sessions`);
    if (!res.ok) throw new Error('Failed to load sessions');
    return res.json();
  },

  async getDetections(sessionId: number): Promise<DetectionRecord[]> {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/detections`);
    if (!res.ok) throw new Error('Failed to load detections');
    return res.json();
  },

  getWebSocketUrl(sourceType: 'webcam' | 'file', videoId?: string, sessionId?: number, cameraIndex: number = 0): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const params = new URLSearchParams();
    params.append('source_type', sourceType);
    if (videoId) params.append('video_id', videoId);
    if (sessionId) params.append('session_id', sessionId.toString());
    params.append('camera_index', cameraIndex.toString());

    return `${protocol}//${host}/ws/video?${params.toString()}`;
  }
};
