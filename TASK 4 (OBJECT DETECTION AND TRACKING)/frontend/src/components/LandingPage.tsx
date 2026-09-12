import React from 'react';
import { 
  Crosshair, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Download, 
  ArrowRight, 
  Zap, 
  Layers, 
  Sparkles,
  Camera
} from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onOpenAuth: () => void;
  currentUser: { username: string; email: string; full_name?: string } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onOpenAuth,
  currentUser,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0b0e14] dark:via-[#0f141f] dark:to-[#090c12] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 max-w-7xl mx-auto text-center">
        {/* Glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-8 shadow-sm backdrop-blur-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Next-Gen Computer Vision & Trajectory Intelligence</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span className="font-mono text-[11px] opacity-80">v2.4 Active</span>
        </div>

        {/* Big Brand Lockup */}
        <div className="flex justify-center mb-6">
          <div className="relative p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 shadow-2xl border border-gray-200/80 dark:border-gray-800 backdrop-blur-md">
            <Logo className="w-20 h-20 sm:w-24 sm:h-24" showText={false} />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-600 opacity-20 blur group-hover:opacity-40 transition duration-500 -z-10" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Real-Time Object Detection &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-rose-500 to-red-600 dark:from-brand-500 dark:via-rose-400 dark:to-red-400">
            Multi-Target Tracking
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          High-performance vision intelligence powered by <strong className="text-gray-900 dark:text-white font-semibold">YOLOv8</strong> neural detection and <strong className="text-gray-900 dark:text-white font-semibold">SORT</strong> Kalman filter trajectory estimation. Stream real-time webcam feeds or uploaded videos with sub-frame latency, interactive tactical reticle HUD, and telemetry logging.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Crosshair className="w-5 h-5 animate-spin-slow" />
            <span>Launch Command Center</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 font-semibold text-base shadow-sm backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>1-Click Demo Analyst Login</span>
            </button>
          ) : (
            <div className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Signed in as <strong>{currentUser.full_name || currentUser.username}</strong></span>
            </div>
          )}
        </div>

        {/* Live Metrics Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 backdrop-blur-sm shadow-sm hover:border-brand-500/50 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detection Model</span>
              <Cpu className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">YOLOv8n</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">80 COCO Classes</div>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 backdrop-blur-sm shadow-sm hover:border-brand-500/50 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracking Core</span>
              <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">SORT Filter</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">7-State Kalman + Hungarian</div>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 backdrop-blur-sm shadow-sm hover:border-brand-500/50 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stream Protocol</span>
              <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">WebSocket</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Full-Duplex Telemetry</div>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 backdrop-blur-sm shadow-sm hover:border-brand-500/50 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latency</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">&lt; 15 ms</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Hardware Accelerated</div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Architecture Showcase */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Engineered For Military-Grade Optical Precision
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Explore the multi-stage pipeline connecting computer vision models, motion prediction filters, and user telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="group p-6 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 hover:border-brand-500/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Dual-Source Input
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Connect physical webcam devices with instant camera indexing or upload video files (MP4, AVI, MOV, WEBM) for frame-by-frame analysis.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-mono text-brand-600 dark:text-brand-400 font-medium">
              Webcam (Index 0/1) • MP4 Uploads
            </div>
          </div>

          {/* Card 2 */}
          <div className="group p-6 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 hover:border-brand-500/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                SORT Multi-Object Tracker
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Employs Kalman filters to predict linear bounding box trajectories across occlusion, paired with Hungarian IoU bipartite matching.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-mono text-brand-600 dark:text-brand-400 font-medium">
              Persistent Track IDs • Color Coded
            </div>
          </div>

          {/* Card 3 */}
          <div className="group p-6 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 hover:border-brand-500/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Tactical HUD & Controls
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Dynamic sensitivity sliders transmit threshold changes live without halting stream. Toggle holographic crosshairs and capture frame snapshots.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-mono text-brand-600 dark:text-brand-400 font-medium">
              Live Sliders • Tactical Reticle HUD
            </div>
          </div>

          {/* Card 4 */}
          <div className="group p-6 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 hover:border-brand-500/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Audits & Telemetry Export
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Audit every detection session with timestamps, frame counts, and author tagging. Export logs with 1 click directly to CSV or JSON formats.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-mono text-brand-600 dark:text-brand-400 font-medium">
              CSV Export • JSON Telemetry • SQLite
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-[#1a1c26] to-gray-900 text-white p-8 sm:p-12 border border-gray-800 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-600/30 border border-brand-500/40 text-brand-300 text-xs font-semibold mb-3">
                <Activity className="w-3.5 h-3.5 text-brand-400" />
                <span>Command Stream Ready</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Experience TrackOptic AI?
              </h3>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">
                Jump into the live command center to start webcam object detection or upload a video file for Kalman trajectory tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <button
                onClick={onLaunchConsole}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/40 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Crosshair className="w-5 h-5" />
                <span>Open Command Center</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
