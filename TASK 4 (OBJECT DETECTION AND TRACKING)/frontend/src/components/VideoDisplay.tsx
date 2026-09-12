import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Camera, AlertTriangle, MonitorPlay, Zap } from 'lucide-react';

interface VideoDisplayProps {
  currentFrame: string | null;
  isRunning: boolean;
  activeSource: 'webcam' | 'file' | null;
  fps: number;
  objectsCount: number;
  tracksCount: number;
  isGridOverlay: boolean;
  spectrumMode?: 'optical' | 'thermal' | 'nightvision';
  tripwireCounts?: { in: number; out: number; total: number };
  isTripwireActive?: boolean;
  onResetTripwire?: () => void;
  errorMessage: string | null;
  onDismissError: () => void;
}

export interface VideoDisplayHandle {
  getCanvasElement: () => HTMLCanvasElement | null;
  getContainerElement: () => HTMLDivElement | null;
}

export const VideoDisplay = forwardRef<VideoDisplayHandle, VideoDisplayProps>(({
  currentFrame,
  isRunning,
  activeSource,
  fps,
  objectsCount,
  tracksCount,
  isGridOverlay,
  spectrumMode = 'optical',
  tripwireCounts = { in: 0, out: 0, total: 0 },
  isTripwireActive = false,
  onResetTripwire,
  errorMessage,
  onDismissError
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvasElement: () => canvasRef.current,
    getContainerElement: () => containerRef.current
  }));

  // Render base64 frame onto canvas with optional tactical cyber grid
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

      // Render Tactical Target Reticle Overlay if enabled
      if (isGridOverlay) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.25)'; // Brand Red with transparency
        ctx.lineWidth = 1;

        // Center crosshair
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();

        // Outer focus brackets
        const bSize = 30;
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.6)';
        ctx.lineWidth = 2;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(20, 20 + bSize);
        ctx.lineTo(20, 20);
        ctx.lineTo(20 + bSize, 20);
        // Top-right
        ctx.moveTo(w - 20 - bSize, 20);
        ctx.lineTo(w - 20, 20);
        ctx.lineTo(w - 20, 20 + bSize);
        // Bottom-left
        ctx.moveTo(20, h - 20 - bSize);
        ctx.lineTo(20, h - 20);
        ctx.lineTo(20 + bSize, h - 20);
        // Bottom-right
        ctx.moveTo(w - 20 - bSize, h - 20);
        ctx.lineTo(w - 20, h - 20);
        ctx.lineTo(w - 20, h - 20 - bSize);
        ctx.stroke();

        // Center reticle ring
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 40, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
        ctx.stroke();
      }
    };
    img.src = `data:image/jpeg;base64,${currentFrame}`;
  }, [currentFrame, isGridOverlay]);

  return (
    <div className="bg-white dark:bg-[#111622] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xs p-4 mb-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <MonitorPlay className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase flex items-center">
            <span>Live Vision Feed</span>
            {isGridOverlay && (
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                TACTICAL RETICLE ON
              </span>
            )}
          </h2>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {activeSource === 'webcam' ? 'Source: Real-time Camera' : activeSource === 'file' ? 'Source: Video Stream' : 'Source: Standby'}
        </span>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-gray-950 dark:bg-black rounded-lg overflow-hidden flex items-center justify-center border border-gray-800 dark:border-gray-900 shadow-inner group"
      >
        {/* Error Notification Overlay */}
        {errorMessage && (
          <div className="absolute top-4 left-4 right-4 z-20 bg-red-900/90 backdrop-blur-sm border border-red-500 text-white rounded-md p-3.5 flex items-start justify-between shadow-lg animate-slideDown">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Vision Pipeline Notice</h4>
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
              style={{
                filter:
                  spectrumMode === 'thermal'
                    ? 'invert(100%) hue-rotate(180deg) saturate(240%) contrast(150%)'
                    : spectrumMode === 'nightvision'
                    ? 'sepia(100%) hue-rotate(85deg) saturate(350%) contrast(140%) brightness(95%)'
                    : 'none'
              }}
              className="max-w-full max-h-full w-auto h-auto object-contain transition-[filter] duration-300"
            />

            {/* In-Viewport HUD Badge (Top-Right) */}
            <div className="absolute top-3 right-3 z-10 flex items-center space-x-2 pointer-events-none">
              <div className="bg-black/75 backdrop-blur-xs border border-gray-700/80 text-white rounded-md px-3 py-1.5 flex items-center space-x-3 text-xs font-mono shadow-md">
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

            {/* Spectrum Mode Status Pill (Top-Left) */}
            {spectrumMode !== 'optical' && (
              <div className="absolute top-3 left-3 z-10">
                <div className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border shadow-md flex items-center space-x-1.5 ${
                  spectrumMode === 'thermal'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-600/80 animate-pulse'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  <span>{spectrumMode === 'thermal' ? 'FLIR Thermal IR Active' : 'Tactical Night Vision'}</span>
                </div>
              </div>
            )}

            {/* Virtual Tripwire Flow Counter Banner (Bottom-Left) */}
            {isTripwireActive && (
              <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-2">
                <div className="bg-black/85 backdrop-blur-sm border border-amber-500/80 text-white rounded-md px-3 py-1.5 text-xs font-mono shadow-lg flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-amber-400 font-bold">
                    <span>⚡ TRIPWIRE:</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">⬆️ IN:</span>
                    <span className="font-bold text-emerald-400">{tripwireCounts.in}</span>
                  </div>
                  <div className="w-px h-3 bg-gray-700" />
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">⬇️ OUT:</span>
                    <span className="font-bold text-rose-400">{tripwireCounts.out}</span>
                  </div>
                  <div className="w-px h-3 bg-gray-700" />
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-bold text-amber-300">{tripwireCounts.total}</span>
                  </div>
                  {onResetTripwire && (
                    <button
                      onClick={onResetTripwire}
                      className="ml-2 px-2 py-0.5 text-[10px] rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 transition-colors pointer-events-auto"
                      title="Reset tripwire counters"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Standby / Inactive Placeholder */
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 max-w-md">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/60 flex items-center justify-center text-brand-500 shadow-lg">
                <Camera className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-600 rounded-full border-2 border-gray-950 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            </div>
            <h3 className="text-base font-bold text-gray-200 mb-1">TrackOptic Command Ready</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Initiate <span className="font-semibold text-brand-400">"Start Webcam"</span> for real-time live sensor tracking, or <span className="font-semibold text-brand-400">"Upload Video"</span> for high-throughput batch detection.
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-gray-400 bg-gray-900/80 border border-gray-800 px-3.5 py-1.5 rounded-full font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>YOLOv8n</span>
              </span>
              <span>•</span>
              <span>SORT Kalman</span>
              <span>•</span>
              <span>25 FPS Stream</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

VideoDisplay.displayName = 'VideoDisplay';
