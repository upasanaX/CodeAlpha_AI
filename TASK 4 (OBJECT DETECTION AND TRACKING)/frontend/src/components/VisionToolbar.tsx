import React from 'react';
import { Sliders, Camera, Maximize2, Grid, Volume2, VolumeX, Sparkles, Gauge, Filter, Cpu, Eye, Activity, Zap } from 'lucide-react';

interface VisionToolbarProps {
  confThreshold: number;
  iouThreshold: number;
  onConfChange: (newVal: number) => void;
  onIouChange: (newVal: number) => void;
  classFilter: string;
  onClassFilterChange: (filter: string) => void;
  modelName: string;
  onModelNameChange: (model: string) => void;
  showTrails: boolean;
  onToggleTrails: () => void;
  isTripwire: boolean;
  onToggleTripwire: () => void;
  spectrumMode: 'optical' | 'thermal' | 'nightvision';
  onSpectrumChange: (mode: 'optical' | 'thermal' | 'nightvision') => void;
  classDistribution: Record<string, number>;
  inferenceMs: number;
  resolution?: string;
  isGridOverlay: boolean;
  onToggleGridOverlay: () => void;
  isAudioAlert: boolean;
  onToggleAudioAlert: () => void;
  onTakeSnapshot: () => void;
  onToggleFullscreen: () => void;
  isRunning: boolean;
}

export const VisionToolbar: React.FC<VisionToolbarProps> = ({
  confThreshold,
  iouThreshold,
  onConfChange,
  onIouChange,
  classFilter,
  onClassFilterChange,
  modelName,
  onModelNameChange,
  showTrails,
  onToggleTrails,
  isTripwire,
  onToggleTripwire,
  spectrumMode,
  onSpectrumChange,
  classDistribution,
  inferenceMs,
  resolution = "640x480",
  isGridOverlay,
  onToggleGridOverlay,
  isAudioAlert,
  onToggleAudioAlert,
  onTakeSnapshot,
  onToggleFullscreen,
  isRunning
}) => {
  const classesList = Object.entries(classDistribution);

  return (
    <div className="bg-white dark:bg-[#111622] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xs p-3.5 mb-6 transition-colors duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Dynamic Live Class Breakdown Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="uppercase tracking-wider text-[11px]">Detected Classes:</span>
          </div>

          {classesList.length === 0 ? (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
              {isRunning ? 'Scanning frame for objects...' : 'Standby'}
            </span>
          ) : (
            <div className="flex items-center space-x-1.5">
              {classesList.map(([cls, count]) => (
                <span
                  key={cls}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 shadow-2xs"
                >
                  <span className="capitalize">{cls}</span>
                  <span className="bg-brand-600 dark:bg-brand-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-mono font-bold">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Action Toggles & Sliders */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Hardware Latency Pill */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 dark:bg-[#0c1017] border border-gray-200 dark:border-gray-800 font-mono text-gray-600 dark:text-gray-400">
            <Gauge className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{inferenceMs > 0 ? `${inferenceMs.toFixed(1)}ms` : '0ms'}</span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span>{resolution}</span>
          </div>

          {/* Model Switcher Selector */}
          <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-[#0c1017] border border-gray-200 dark:border-gray-800 px-2 py-1.5 rounded-md">
            <Cpu className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <select
              value={modelName}
              onChange={(e) => onModelNameChange(e.target.value)}
              className="bg-transparent border-none text-[11px] font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer pr-1"
              title="Select YOLOv8 model capacity"
            >
              <option value="yolov8s.pt" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">YOLOv8s (Precision)</option>
              <option value="yolov8n.pt" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">YOLOv8n (Fast)</option>
            </select>
          </div>

          {/* Category Filter Preset */}
          <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-[#0c1017] border border-gray-200 dark:border-gray-800 px-2 py-1.5 rounded-md">
            <Filter className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <select
              value={classFilter}
              onChange={(e) => onClassFilterChange(e.target.value)}
              className="bg-transparent border-none text-[11px] font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer pr-1"
              title="Filter target object classes"
            >
              <option value="workplace" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">Indoor / Office Focus</option>
              <option value="all" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">All 80 Classes</option>
            </select>
          </div>

          {/* Confidence Slider */}
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-[#0c1017] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-md">
            <Sliders className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">Conf:</span>
            <input
              type="range"
              min="0.20"
              max="0.90"
              step="0.05"
              value={confThreshold}
              onChange={(e) => onConfChange(parseFloat(e.target.value))}
              title={`Confidence threshold: ${(confThreshold * 100).toFixed(0)}%`}
              className="w-16 sm:w-20 accent-brand-600 cursor-pointer h-1.5"
            />
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold text-[11px] w-7">
              {(confThreshold * 100).toFixed(0)}%
            </span>
          </div>

          {/* IoU Slider */}
          <div className="hidden sm:flex items-center space-x-2 bg-gray-50 dark:bg-[#0c1017] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-md">
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">IoU:</span>
            <input
              type="range"
              min="0.10"
              max="0.70"
              step="0.05"
              value={iouThreshold}
              onChange={(e) => onIouChange(parseFloat(e.target.value))}
              title={`Tracking IoU threshold: ${(iouThreshold * 100).toFixed(0)}%`}
              className="w-16 accent-brand-600 cursor-pointer h-1.5"
            />
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px] w-7">
              {(iouThreshold * 100).toFixed(0)}%
            </span>
          </div>

          {/* Spectrum Filter Switcher */}
          <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-[#0c1017] border border-gray-200 dark:border-gray-800 px-2 py-1.5 rounded-md">
            <Eye className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <select
              value={spectrumMode}
              onChange={(e) => onSpectrumChange(e.target.value as 'optical' | 'thermal' | 'nightvision')}
              className="bg-transparent border-none text-[11px] font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer pr-1"
              title="Select Optical Filter Spectrum"
            >
              <option value="optical" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">Optical (RGB)</option>
              <option value="thermal" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">Thermal IR (FLIR)</option>
              <option value="nightvision" className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">Night Vision (NVG)</option>
            </select>
          </div>

          {/* Motion Trails Toggle Button */}
          <button
            onClick={onToggleTrails}
            title={showTrails ? "Kalman Motion Trails Active" : "Enable Kalman Motion Trails"}
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-md border text-[11px] font-semibold transition-colors shadow-2xs ${
              showTrails
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-800'
                : 'bg-white dark:bg-[#161c28] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trails</span>
          </button>

          {/* Virtual Tripwire Toggle Button */}
          <button
            onClick={onToggleTripwire}
            title={isTripwire ? "Virtual Tripwire Active" : "Enable Virtual Tripwire Flow Counter"}
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-md border text-[11px] font-semibold transition-colors shadow-2xs ${
              isTripwire
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400/30'
                : 'bg-white dark:bg-[#161c28] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Tripwire</span>
          </button>

          {/* Tactical Grid Overlay Toggle */}
          <button
            onClick={onToggleGridOverlay}
            title={isGridOverlay ? "Disable Tactical Grid Reticle" : "Enable Tactical Grid Reticle"}
            className={`p-1.5 rounded-md border transition-colors shadow-2xs ${
              isGridOverlay
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-800'
                : 'bg-white dark:bg-[#161c28] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleAudioAlert}
            title={isAudioAlert ? "Audio Alert Enabled on Target Acquisition" : "Audio Alert Muted"}
            className={`p-1.5 rounded-md border transition-colors shadow-2xs ${
              isAudioAlert
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-800'
                : 'bg-white dark:bg-[#161c28] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}
          >
            {isAudioAlert ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 1-Click Frame Snapshot */}
          <button
            onClick={onTakeSnapshot}
            disabled={!isRunning}
            title="Download Instant HD Snapshot"
            className="inline-flex items-center space-x-1.5 py-1.5 px-3 rounded-md bg-white dark:bg-[#161c28] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Camera className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="hidden sm:inline font-medium">Snapshot</span>
          </button>

          {/* Fullscreen Viewport Toggle */}
          <button
            onClick={onToggleFullscreen}
            title="Expand Fullscreen Viewport"
            className="p-1.5 rounded-md bg-white dark:bg-[#161c28] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisionToolbar;
