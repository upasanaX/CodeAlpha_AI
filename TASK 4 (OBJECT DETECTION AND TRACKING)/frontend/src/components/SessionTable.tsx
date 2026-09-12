import React from 'react';
import { History, Eye, Film, Camera, RefreshCw, Calendar, Clock } from 'lucide-react';
import { Session } from '../types';

interface SessionTableProps {
  sessions: Session[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectSession: (session: Session) => void;
}

export const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  isLoading,
  onRefresh,
  onSelectSession
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Recent Processing Sessions
            </h3>
            <p className="text-xs text-gray-500">
              Audit log of webcam streams and processed video uploads
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-gray-700 hover:text-brand-600 px-3 py-1.5 rounded-md border border-gray-200 hover:border-brand-200 hover:bg-brand-50/50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {sessions.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <History className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-600">No sessions recorded yet.</p>
            <p className="text-xs text-gray-400 mt-0.5">Start a webcam stream or upload a video to generate session history.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Session ID</th>
                <th className="py-3 px-4 text-left">Source Type</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Total Frames</th>
                <th className="py-3 px-4 text-left">Logged Detections</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900">
                    #{s.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      s.source_type === 'webcam'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-brand-50 text-brand-700 border border-brand-200'
                    }`}>
                      {s.source_type === 'webcam' ? <Camera className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                      <span className="capitalize">{s.source_type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      <span className="text-gray-400">•</span>
                      <span>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{s.duration_sec ? `${s.duration_sec.toFixed(1)}s` : 'Active / N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700">
                    {s.total_frames || 0} frames
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-800">
                      {s.detections_count || 0} records
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectSession(s)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Telemetry</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
