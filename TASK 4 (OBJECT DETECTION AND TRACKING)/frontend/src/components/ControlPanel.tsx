import React, { useRef, useState } from 'react';
import { Camera, Square, Upload, Play, Film, RefreshCw, AlertCircle } from 'lucide-react';
import { UploadResponse } from '../types';

interface ControlPanelProps {
  isRunning: boolean;
  activeSource: 'webcam' | 'file' | null;
  cameraIndex: number;
  onStartWebcam: () => void;
  onStop: () => void;
  onUploadFile: (file: File) => Promise<UploadResponse>;
  onStartFileProcessing: (uploadedVideo: UploadResponse) => void;
  onSwitchCamera: (index: number) => void;
  fps: number;
  objectsCount: number;
  tracksCount: number;
  isUploading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  activeSource,
  cameraIndex,
  onStartWebcam,
  onStop,
  onUploadFile,
  onStartFileProcessing,
  onSwitchCamera,
  fps,
  objectsCount,
  tracksCount,
  isUploading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedVideo, setUploadedVideo] = useState<UploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      const res = await onUploadFile(file);
      setUploadedVideo(res);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload video');
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const statusLabel = !isRunning
    ? 'Stopped / Ready'
    : activeSource === 'webcam'
    ? 'Webcam Tracking Running'
    : 'Video File Processing Active';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 mb-6">
      {/* Top Status & Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Execution Status</span>
          <div className="mt-1 flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-brand-600 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-semibold text-gray-900 truncate">{statusLabel}</span>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Real-Time FPS</span>
          <div className="mt-1 text-lg font-bold text-gray-900 font-mono">
            {fps.toFixed(1)} <span className="text-xs text-gray-500 font-normal">fps</span>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Detections (YOLOv8)</span>
          <div className="mt-1 text-lg font-bold text-brand-700 font-mono">
            {objectsCount} <span className="text-xs text-gray-500 font-normal">objects</span>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Active Tracks (SORT)</span>
          <div className="mt-1 text-lg font-bold text-emerald-700 font-mono">
            {tracksCount} <span className="text-xs text-gray-500 font-normal">tracks</span>
          </div>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Start Webcam */}
          <button
            onClick={onStartWebcam}
            disabled={isRunning && activeSource === 'webcam'}
            className={`inline-flex items-center space-x-2 font-medium text-sm rounded-md px-4 py-2.5 transition-colors shadow-sm ${
              isRunning && activeSource === 'webcam'
                ? 'bg-brand-700 text-white cursor-not-allowed opacity-90'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isRunning && activeSource === 'webcam' ? 'Webcam Active' : 'Start Webcam'}</span>
          </button>

          {/* Stop Button */}
          <button
            onClick={onStop}
            disabled={!isRunning}
            className={`inline-flex items-center space-x-2 font-medium text-sm rounded-md px-4 py-2.5 transition-colors shadow-sm ${
              !isRunning
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-900 text-white'
            }`}
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop</span>
          </button>

          {/* Switch Camera */}
          <button
            onClick={() => onSwitchCamera(cameraIndex === 0 ? 1 : 0)}
            disabled={isRunning && activeSource !== 'webcam'}
            title="Toggle between Camera 0 and Camera 1"
            className="inline-flex items-center space-x-1.5 font-medium text-sm rounded-md px-3.5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span>Cam: {cameraIndex}</span>
          </button>

          {/* Upload Video Trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm"
            className="hidden"
          />

          <button
            onClick={triggerUploadClick}
            disabled={isUploading}
            className="inline-flex items-center space-x-2 font-medium text-sm rounded-md px-4 py-2.5 bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4 text-brand-600" />
            <span>{isUploading ? 'Uploading...' : 'Upload Video'}</span>
          </button>
        </div>

        {/* Video File Action & Badge if uploaded */}
        {uploadedVideo && (
          <div className="flex items-center space-x-3 bg-red-50/70 border border-brand-200 rounded-md px-3 py-1.5">
            <div className="flex items-center space-x-2 text-xs text-brand-900 truncate max-w-xs">
              <Film className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="font-semibold truncate">{uploadedVideo.filename}</span>
            </div>

            <button
              onClick={() => onStartFileProcessing(uploadedVideo)}
              disabled={isRunning && activeSource === 'file'}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Process Video</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {uploadError && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
