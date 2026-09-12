import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { VideoDisplay } from './components/VideoDisplay';
import { SessionTable } from './components/SessionTable';
import { DetectionModal } from './components/DetectionModal';
import { videoApi } from './api/videoApi';
import { Session, HealthResponse, FramePayload, UploadResponse } from './types';

export const App: React.FC = () => {
  // Application State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeSource, setActiveSource] = useState<'webcam' | 'file' | null>(null);
  const [cameraIndex, setCameraIndex] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [objectsCount, setObjectsCount] = useState<number>(0);
  const [tracksCount, setTracksCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Sessions & Telemetry
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // WebSocket Ref
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial health & sessions
  const fetchHealthAndSessions = useCallback(async () => {
    try {
      const h = await videoApi.getHealth();
      setHealth(h);
    } catch (e) {
      console.warn('Backend health check error:', e);
    }

    try {
      setIsLoadingSessions(true);
      const s = await videoApi.getSessions();
      setSessions(s);
    } catch (e) {
      console.warn('Failed to load sessions:', e);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthAndSessions();
  }, [fetchHealthAndSessions]);

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
    setObjectsCount(0);
    setTracksCount(0);
    videoApi.stopProcessing().catch(() => {});
    // Refresh sessions list to show newly completed session
    setTimeout(() => {
      videoApi.getSessions().then(setSessions).catch(() => {});
    }, 500);
  }, []);

  // Connect to WebSocket stream
  const connectWebSocket = useCallback((sourceType: 'webcam' | 'file', videoId?: string) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setErrorMessage(null);
    setIsRunning(true);
    setActiveSource(sourceType);

    const wsUrl = videoApi.getWebSocketUrl(sourceType, videoId, undefined, cameraIndex);
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
          if (payload.objects_count !== undefined) setObjectsCount(payload.objects_count);
          if (payload.tracks_count !== undefined) setTracksCount(payload.tracks_count);
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
      setErrorMessage('Failed to connect to video stream. Please ensure the backend is running and camera permissions are granted.');
      stopStream();
    };

    ws.onclose = () => {
      console.log('[WebSocket] Connection closed.');
      setIsRunning(false);
      setActiveSource(null);
    };
  }, [cameraIndex, stopStream]);

  // Handlers
  const handleStartWebcam = () => {
    connectWebSocket('webcam');
  };

  const handleUploadFile = async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    try {
      const res = await videoApi.uploadVideo(file);
      // Refresh sessions
      const s = await videoApi.getSessions();
      setSessions(s);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Header */}
      <Header health={health} isConnected={isRunning} />

      {/* Main Workspace Container */}
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

        {/* Live Video Viewport */}
        <VideoDisplay
          currentFrame={currentFrame}
          isRunning={isRunning}
          activeSource={activeSource}
          fps={fps}
          objectsCount={objectsCount}
          tracksCount={tracksCount}
          errorMessage={errorMessage}
          onDismissError={() => setErrorMessage(null)}
        />

        {/* Recent Session Table */}
        <SessionTable
          sessions={sessions}
          isLoading={isLoadingSessions}
          onRefresh={() => {
            setIsLoadingSessions(true);
            videoApi.getSessions().then(setSessions).finally(() => setIsLoadingSessions(false));
          }}
          onSelectSession={(sess) => setSelectedSession(sess)}
        />
      </main>

      {/* Telemetry Modal */}
      {selectedSession && (
        <DetectionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-gray-700">CodeAlpha AI Internship</span> • Task 4: Real-Time Object Detection & Tracking
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>Ultralytics YOLOv8</span>
            <span>•</span>
            <span>SORT Tracking</span>
            <span>•</span>
            <span>Vite + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
