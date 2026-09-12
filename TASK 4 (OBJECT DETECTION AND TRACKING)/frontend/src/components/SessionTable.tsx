import React from 'react';
import { History, Eye, Film, Camera, RefreshCw, Calendar, Clock, Trash2, User as UserIcon, FileSpreadsheet, FileCode } from 'lucide-react';
import { Session, User } from '../types';
import { videoApi } from '../api/videoApi';

interface SessionTableProps {
  sessions: Session[];
  isLoading: boolean;
  currentUser: User | null;
  filterMySessions: boolean;
  onToggleFilterMySessions: () => void;
  onRefresh: () => void;
  onSelectSession: (session: Session) => void;
  onDeleteSession: (sessionId: number) => void;
}

export const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  isLoading,
  currentUser,
  filterMySessions,
  onToggleFilterMySessions,
  onRefresh,
  onSelectSession,
  onDeleteSession
}) => {
  const handleExport = (sessionId: number, format: 'csv' | 'json', e: React.MouseEvent) => {
    e.stopPropagation();
    const url = videoApi.getExportUrl(sessionId, format);
    window.open(url, '_blank');
  };

  const handleDelete = (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete session #${sessionId} and its telemetry records?`)) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111622] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xs overflow-hidden transition-colors duration-200">
      {/* Table Header Controls */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111622]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              Telemetry Audit Log & History
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Session registry with instant CSV/JSON exports and telemetry inspection
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentUser && (
            <button
              onClick={onToggleFilterMySessions}
              className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors shadow-2xs ${
                filterMySessions
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white dark:bg-[#161c28] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{filterMySessions ? 'My Sessions' : 'All Sessions'}</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-600 dark:text-brand-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {sessions.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <History className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No session telemetry recorded yet.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Start a webcam stream or process an uploaded video to populate audit records.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
            <thead className="bg-gray-50 dark:bg-[#0c1017] text-gray-600 dark:text-gray-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Session ID</th>
                <th className="py-3 px-4 text-left">Source & Author</th>
                <th className="py-3 px-4 text-left">Timestamp</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Processed Frames</th>
                <th className="py-3 px-4 text-left">Detections</th>
                <th className="py-3 px-4 text-right">Actions & Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 bg-white dark:bg-[#111622]">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-gray-100">
                    #{s.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        s.source_type === 'webcam'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                          : 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-900'
                      }`}>
                        {s.source_type === 'webcam' ? <Camera className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                        <span className="capitalize">{s.source_type}</span>
                      </span>
                      {s.username && (
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                          @{s.username}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1 font-mono">
                      <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      <span>{s.duration_sec ? `${s.duration_sec.toFixed(1)}s` : 'Active'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">
                    {s.total_frames || 0} frames
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {s.detections_count || 0} records
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onSelectSession(s)}
                        title="View Telemetry Records"
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleExport(s.id, 'csv', e)}
                        title="Export Telemetry to CSV"
                        className="text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleExport(s.id, 'json', e)}
                        title="Export Telemetry to JSON"
                        className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 transition-colors"
                      >
                        <FileCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(s.id, e)}
                        title="Delete Session"
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
