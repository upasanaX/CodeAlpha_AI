import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { VisionToolbar } from './components/VisionToolbar';
import { VideoDisplay, VideoDisplayHandle } from './components/VideoDisplay';
import { SessionTable } from './components/SessionTable';
import { DetectionModal } from './components/DetectionModal';
import { AuthModal } from './components/AuthModal';
import { videoApi } from './api/videoApi';
import { Session, HealthResponse, FramePayload, UploadResponse, User } from './types';

export const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('trackoptic_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('trackoptic_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('trackoptic_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [filterMySessions, setFilterMySessions] = useState<boolean>(false);

  // Application State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeSource, setActiveSource] = useState<'webcam' | 'file' | null>(null);
  const [cameraIndex, setCameraIndex] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [inferenceMs, setInferenceMs] = useState<number>(0);
  const [objectsCount, setObjectsCount] = useState<number>(0);
  const [tracksCount, setTracksCount] = useState<number>(0);
  const [classDistribution, setClassDistribution] = useState<Record<string, number>>({});
  const [resolution, setResolution] = useState<string>("640x480");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Dynamic Vision Controls
  const [confThreshold, setConfThreshold] = useState<number>(0.40);
  const [iouThreshold, setIouThreshold] = useState<number>(0.30);
  const [isGridOverlay, setIsGridOverlay] = useState<boolean>(false);
  const [isAudioAlert, setIsAudioAlert] = useState<boolean>(false);

  // Sessions & Telemetry
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const videoDisplayRef = useRef<VideoDisplayHandle | null>(null);
  const prevTrackCountRef = useRef<number>(0);

  // Web Audio Context for Target Lock Chimes
  const playTargetLockAudio = useCallback(() => {
    if (!isAudioAlert) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isAudioAlert]);

  // Load User & Health on Mount
  useEffect(() => {
    videoApi.getMe().then(user => setCurrentUser(user)).catch(() => {});
    videoApi.getHealth().then(h => setHealth(h)).catch(() => {});
  }, []);

  // Fetch Sessions
  const loadSessions = useCallback(async (filterUser: boolean = filterMySessions) => {
    setIsLoadingSessions(true);
    try {
      const s = await videoApi.getSessions(filterUser);
      setSessions(s);
    } catch (e) {
      console.warn('Failed to load sessions:', e);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [filterMySessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Clean close stream
  const stopStream = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsRunning(false);
    setActiveSource(null);
    setCurrentFrame(null);
    setFps(0);
    setInferenceMs(0);
    setObjectsCount(0);
    setTracksCount(0);
    setClassDistribution({});
    prevTrackCountRef.current = 0;
    videoApi.stopProcessing().catch(() => {});
    setTimeout(() => {
      loadSessions();
    }, 500);
  }, [loadSessions]);

  // Connect to WebSocket stream
  const connectWebSocket = useCallback((sourceType: 'webcam' | 'file', videoId?: string) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setErrorMessage(null);
    setIsRunning(true);
    setActiveSource(sourceType);

    const wsUrl = videoApi.getWebSocketUrl(
      sourceType,
      videoId,
      undefined,
      cameraIndex,
      confThreshold,
      iouThreshold
    );
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`[WebSocket] Connected to ${wsUrl}`);
    };

    ws.onmessage = (event) => {
      try {
        const payload: FramePayload = JSON.parse(event.data);
        if (payload.type === 'frame' && payload.frame_data) {
          setCurrentFrame(payload.frame_data);
          if (payload.fps !== undefined) setFps(payload.fps);
          if (payload.inference_ms !== undefined) setInferenceMs(payload.inference_ms);
          if (payload.objects_count !== undefined) setObjectsCount(payload.objects_count);
          if (payload.tracks_count !== undefined) {
            // Audio target acquisition alert if new track detected
            if (payload.tracks_count > prevTrackCountRef.current) {
              playTargetLockAudio();
            }
            prevTrackCountRef.current = payload.tracks_count;
            setTracksCount(payload.tracks_count);
          }
          if (payload.class_distribution) setClassDistribution(payload.class_distribution);
          if (payload.resolution) setResolution(payload.resolution);
        } else if (payload.type === 'finished') {
          console.log('[WebSocket] Video stream completed');
          stopStream();
        } else if (payload.type === 'error') {
          setErrorMessage(payload.message || 'Stream error occurred.');
          stopStream();
        }
      } catch (e) {
        console.error('Failed to parse frame message:', e);
      }
    };

    ws.onerror = (e) => {
      console.error('[WebSocket] Socket error:', e);
      setErrorMessage('Failed to connect to video stream. Ensure the backend is active and camera permissions are allowed.');
      stopStream();
    };

    ws.onclose = () => {
      setIsRunning(false);
      setActiveSource(null);
    };
  }, [cameraIndex, confThreshold, iouThreshold, playTargetLockAudio, stopStream]);

  // Real-time threshold adjustment over WebSocket
  const handleConfChange = (newVal: number) => {
    setConfThreshold(newVal);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'set_thresholds',
        conf_threshold: newVal,
        iou_threshold: iouThreshold
      }));
    }
  };

  const handleIouChange = (newVal: number) => {
    setIouThreshold(newVal);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'set_thresholds',
        conf_threshold: confThreshold,
        iou_threshold: newVal
      }));
    }
  };

  // Snapshot Download
  const handleTakeSnapshot = () => {
    const canvas = videoDisplayRef.current?.getCanvasElement();
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `trackoptic_snapshot_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Fullscreen Viewport
  const handleToggleFullscreen = () => {
    const container = videoDisplayRef.current?.getContainerElement();
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Handlers
  const handleStartWebcam = () => {
    connectWebSocket('webcam');
  };

  const handleUploadFile = async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    try {
      const res = await videoApi.uploadVideo(file);
      loadSessions();
      return res;
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartFileProcessing = (uploaded: UploadResponse) => {
    connectWebSocket('file', uploaded.video_id);
  };

  const handleSwitchCamera = (newIndex: number) => {
    setCameraIndex(newIndex);
    if (isRunning && activeSource === 'webcam') {
      stopStream();
      setTimeout(() => {
        connectWebSocket('webcam');
      }, 300);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await videoApi.deleteSession(sessionId);
      loadSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete session');
    }
  };

  const handleLogout = () => {
    videoApi.removeToken();
    setCurrentUser(null);
    setFilterMySessions(false);
    loadSessions(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b0f17] text-gray-900 dark:text-gray-100 selection:bg-brand-100 selection:text-brand-900 transition-colors duration-200">
      {/* Header with Auth & Theme */}
      <Header
        health={health}
        isConnected={isRunning}
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        onToggleTheme={toggleTheme}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <ControlPanel
          isRunning={isRunning}
          activeSource={activeSource}
          cameraIndex={cameraIndex}
          onStartWebcam={handleStartWebcam}
          onStop={stopStream}
          onUploadFile={handleUploadFile}
          onStartFileProcessing={handleStartFileProcessing}
          onSwitchCamera={handleSwitchCamera}
          fps={fps}
          objectsCount={objectsCount}
          tracksCount={tracksCount}
          isUploading={isUploading}
        />

        {/* Vision Intelligence & Sensitivity Toolbar */}
        <VisionToolbar
          confThreshold={confThreshold}
          iouThreshold={iouThreshold}
          onConfChange={handleConfChange}
          onIouChange={handleIouChange}
          classDistribution={classDistribution}
          inferenceMs={inferenceMs}
          resolution={resolution}
          isGridOverlay={isGridOverlay}
          onToggleGridOverlay={() => setIsGridOverlay(prev => !prev)}
          isAudioAlert={isAudioAlert}
          onToggleAudioAlert={() => setIsAudioAlert(prev => !prev)}
          onTakeSnapshot={handleTakeSnapshot}
          onToggleFullscreen={handleToggleFullscreen}
          isRunning={isRunning}
        />

        {/* Live Video Viewport */}
        <VideoDisplay
          ref={videoDisplayRef}
          currentFrame={currentFrame}
          isRunning={isRunning}
          activeSource={activeSource}
          fps={fps}
          objectsCount={objectsCount}
          tracksCount={tracksCount}
          isGridOverlay={isGridOverlay}
          errorMessage={errorMessage}
          onDismissError={() => setErrorMessage(null)}
        />

        {/* Telemetry Audit & Session Registry */}
        <SessionTable
          sessions={sessions}
          isLoading={isLoadingSessions}
          currentUser={currentUser}
          filterMySessions={filterMySessions}
          onToggleFilterMySessions={() => {
            const next = !filterMySessions;
            setFilterMySessions(next);
            loadSessions(next);
          }}
          onRefresh={() => loadSessions()}
          onSelectSession={(sess) => setSelectedSession(sess)}
          onDeleteSession={handleDeleteSession}
        />
      </main>

      {/* Telemetry Modal */}
      {selectedSession && (
        <DetectionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          loadSessions();
        }}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-[#111622] border-t border-gray-200 dark:border-gray-800 py-4 mt-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700 dark:text-gray-200">TrackOptic AI</span>
            <span>•</span>
            <span>CodeAlpha AI Internship Task 4</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 dark:text-gray-500 font-mono text-[11px]">
            <span>FastAPI + WebSockets</span>
            <span>•</span>
            <span>YOLOv8 + SORT</span>
            <span>•</span>
            <span>JWT Auth</span>
            <span>•</span>
            <span>React 18</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
