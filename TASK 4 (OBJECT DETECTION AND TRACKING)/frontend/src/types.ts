export interface Session {
  id: number;
  created_at: string;
  source_type: 'webcam' | 'file';
  video_filename?: string;
  duration_sec?: number;
  total_frames?: number;
  notes?: string;
  detections_count?: number;
}

export interface DetectionRecord {
  id: number;
  session_id: number;
  frame_index: number;
  timestamp_ms: number;
  class_name: string;
  confidence: number;
  track_id: number;
  bbox_x: number;
  bbox_y: number;
  bbox_w: number;
  bbox_h: number;
}

export interface FramePayload {
  type: 'frame' | 'finished' | 'error';
  frame_data?: string; // base64 JPEG
  fps?: number;
  objects_count?: number;
  tracks_count?: number;
  frame_index?: number;
  message?: string;
}

export interface UploadResponse {
  video_id: string;
  session_id: number;
  filename: string;
  status: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  model: string;
  device: string;
  conf_threshold: number;
  iou_threshold: number;
}
