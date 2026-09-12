import React, { useEffect, useState } from 'react';
import { X, Database, ListFilter } from 'lucide-react';
import { Session, DetectionRecord } from '../types';
import { videoApi } from '../api/videoApi';

interface DetectionModalProps {
  session: Session | null;
  onClose: () => void;
}

export const DetectionModal: React.FC<DetectionModalProps> = ({ session, onClose }) => {
  const [detections, setDetections] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    setError(null);
    videoApi.getDetections(session.id)
      .then((data) => setDetections(data))
      .catch((err) => setError(err.message || 'Failed to load detections'))
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Session #{session.id} Telemetry & Detection Logs
              </h3>
              <p className="text-xs text-gray-500">
                Source: <span className="font-semibold text-gray-700 capitalize">{session.source_type}</span> • Recorded: {new Date(session.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-16 text-center text-gray-500">
              <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Fetching recorded detections from database...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          ) : detections.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <ListFilter className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-700">No detection snapshots logged for this session.</p>
              <p className="text-xs text-gray-400 mt-1">
                (By default, database logging samples every 10 frames to optimize high-FPS performance).
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Frame</th>
                    <th className="py-2.5 px-3 text-left">Time (ms)</th>
                    <th className="py-2.5 px-3 text-left">Track ID</th>
                    <th className="py-2.5 px-3 text-left">Class</th>
                    <th className="py-2.5 px-3 text-left">Confidence</th>
                    <th className="py-2.5 px-3 text-left">Bounding Box (x, y, w, h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white font-mono">
                  {detections.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 text-gray-700">#{d.frame_index}</td>
                      <td className="py-2 px-3 text-gray-500">{d.timestamp_ms.toFixed(0)} ms</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          ID: {d.track_id}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-gray-900">{d.class_name}</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">{(d.confidence * 100).toFixed(1)}%</td>
                      <td className="py-2 px-3 text-gray-500">[{d.bbox_x}, {d.bbox_y}, {d.bbox_w}, {d.bbox_h}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
