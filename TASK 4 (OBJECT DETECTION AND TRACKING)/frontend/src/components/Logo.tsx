import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = false }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Precision Optical Vector Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background Rounded Shield */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            className="fill-brand-50 dark:fill-brand-950/40 stroke-brand-200 dark:stroke-brand-900/60"
            strokeWidth="3"
          />

          {/* Optical Corner Brackets (Target Reticle) */}
          <path
            d="M24 36V26C24 24.8954 24.8954 24 26 24H36"
            className="stroke-brand-600 dark:stroke-brand-500"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M76 36V26C76 24.8954 75.1046 24 74 24H64"
            className="stroke-brand-600 dark:stroke-brand-500"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M24 64V74C24 75.1046 24.8954 76 26 76H36"
            className="stroke-brand-600 dark:stroke-brand-500"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M76 64V74C76 75.1046 75.1046 76 74 76H64"
            className="stroke-brand-600 dark:stroke-brand-500"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Outer Lens Circle with Dashes */}
          <circle
            cx="50"
            cy="50"
            r="26"
            className="stroke-brand-500/40 dark:stroke-brand-400/30"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />

          {/* Inner Focused Aperture Ring */}
          <circle
            cx="50"
            cy="50"
            r="16"
            className="stroke-brand-600 dark:stroke-brand-400 fill-brand-600/10 dark:fill-brand-500/20"
            strokeWidth="3.5"
          />

          {/* Central Neural Focal Dot */}
          <circle
            cx="50"
            cy="50"
            r="6"
            className="fill-brand-600 dark:fill-brand-400"
          />

          {/* Precision Crosshair Ticks */}
          <line x1="50" y1="16" x2="50" y2="22" className="stroke-brand-600 dark:stroke-brand-500" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="78" x2="50" y2="84" className="stroke-brand-600 dark:stroke-brand-500" strokeWidth="3" strokeLinecap="round" />
          <line x1="16" y1="50" x2="22" y2="50" className="stroke-brand-600 dark:stroke-brand-500" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="50" x2="84" y2="50" className="stroke-brand-600 dark:stroke-brand-500" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Track<span className="text-brand-600 dark:text-brand-500">Optic</span>
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white shadow-xs">
              AI
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Intelligent Vision & Real-Time Tracking
          </span>
        </div>
      )}
    </div>
  );
};
