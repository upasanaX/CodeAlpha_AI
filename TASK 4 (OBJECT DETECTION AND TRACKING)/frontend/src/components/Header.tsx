import React from 'react';
import { ShieldCheck, Eye, Cpu, Activity } from 'lucide-react';
import { HealthResponse } from '../types';

interface HeaderProps {
  health: HealthResponse | null;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ health, isConnected }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-sm">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Real-Time Object Detection & Tracking
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded">
                YOLOv8 + SORT
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Task 4 – AI Internship <span className="mx-1">•</span> Production Computer Vision Suite
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border font-medium ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isConnected ? 'Stream Active' : 'Idle / Standby'}</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200 font-medium">
            <Cpu className="w-3.5 h-3.5 text-brand-600" />
            <span>Model: {health ? health.model : 'YOLOv8n'}</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200 font-medium">
            <Activity className="w-3.5 h-3.5 text-brand-600" />
            <span>Tracker: SORT (Kalman)</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{health ? health.device.toUpperCase() : 'CPU'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
