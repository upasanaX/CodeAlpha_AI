import React, { useRef, useEffect } from 'react';
import { Camera, AlertTriangle, MonitorPlay, Zap } from 'lucide-react';

interface VideoDisplayProps {
  currentFrame: string | null;
  isRunning: boolean;
  activeSource: 'webcam' | 'file' | null;
  fps: number;
  objectsCount: number;
  tracksCount: number;
  errorMessage: string | null;
  onDismissError: () => void;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({
  currentFrame,
  isRunning,
  activeSource,
  fps,
  objectsCount,
  tracksCount,
  errorMessage,
  onDismissError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render base64 frame onto canvas for crisp hardware-accelerated rendering
  useEffect(() => {
    if (!currentFrame || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      if (canvas.width !== img.width || canvas.height !== img.height) {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      ctx.drawImage(img, 0, 0);
    };
    img.src = `data:image/jpeg;base64,${currentFrame}`;
  }, [currentFrame]);

  return (
    <div className="bg-white dark:bg-[#111622] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xs p-4 mb-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <MonitorPlay className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">Live Processing Viewport</h2>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {activeSource === 'webcam' ? 'Source: Real-time Camera' : activeSource === 'file' ? 'Source: Video File Stream' : 'Source: None'}
        </span>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-video bg-gray-950 dark:bg-black rounded-lg overflow-hidden flex items-center justify-center border border-gray-800 dark:border-gray-900 shadow-inner">
        {/* Error Notification Overlay */}
        {errorMessage && (
          <div className="absolute top-4 left-4 right-4 z-20 bg-red-900/90 backdrop-blur-sm border border-red-500 text-white rounded-md p-3.5 flex items-start justify-between shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Video Stream Error</h4>
                <p className="text-xs text-red-200 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={onDismissError}
              className="text-xs bg-red-800/80 hover:bg-red-700 px-2.5 py-1 rounded border border-red-400/50 ml-3 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Canvas View */}
        {isRunning && currentFrame ? (
          <>
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />

            {/* Minimal In-Viewport HUD Badge (Top-Right) */}
            <div className="absolute top-3 right-3 z-10 flex items-center space-x-2 pointer-events-none">
              <div className="bg-black/75 backdrop-blur-sm border border-gray-700/80 text-white rounded-md px-3 py-1.5 flex items-center space-x-3 text-xs font-mono shadow-md">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span className="font-semibold text-gray-200">{fps.toFixed(1)} FPS</span>
                </div>
                <div className="w-px h-3 bg-gray-700" />
                <div>
                  <span className="text-gray-400">Objs: </span>
                  <span className="font-bold text-red-400">{objectsCount}</span>
                </div>
                <div className="w-px h-3 bg-gray-700" />
                <div>
                  <span className="text-gray-400">Tracks: </span>
                  <span className="font-bold text-emerald-400">{tracksCount}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Standby / Inactive Placeholder */
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 max-w-md">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 text-brand-500/80">
              <Camera className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-semibold text-gray-200 mb-1">No Active Video Stream</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Click <span className="font-medium text-brand-400">"Start Webcam"</span> to begin live detection & tracking from your camera, or <span className="font-medium text-brand-400">"Upload Video"</span> to track objects in a recorded MP4/AVI clip.
            </p>
            <div className="flex items-center space-x-4 text-[11px] text-gray-400 bg-gray-900/80 border border-gray-800 px-3 py-1.5 rounded-full font-mono">
              <span>YOLOv8 Detection</span>
              <span>•</span>
              <span>SORT Kalman Tracking</span>
              <span>•</span>
              <span>WebSocket Stream</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
