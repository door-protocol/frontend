'use client';

import { AlertTriangle } from 'lucide-react';

interface RatioGaugeProps {
  seniorRatio: number; // 0-100
  juniorRatio: number; // 0-100
  minJuniorRatio: number; // e.g., 10
}

export default function RatioGauge({
  seniorRatio,
  juniorRatio,
  minJuniorRatio,
}: RatioGaugeProps) {
  const isHealthy = juniorRatio >= minJuniorRatio;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Senior / Junior Ratio</span>
        <span className="text-zinc-600 text-zinc-400">
          {seniorRatio.toFixed(1)}% / {juniorRatio.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-8 bg-zinc-200 bg-zinc-800 rounded-full overflow-hidden">
        {/* Senior (Blue) */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 bg-blue-600 transition-all"
          style={{ width: `${seniorRatio}%` }}
        />
        {/* Junior (Orange) */}
        <div
          className="absolute top-0 h-full bg-orange-500 bg-orange-600 transition-all"
          style={{ left: `${seniorRatio}%`, width: `${juniorRatio}%` }}
        />

        {/* Min Junior Ratio indicator (danger line) */}
        <div
          className="absolute top-0 h-full w-0.5 bg-red-600 z-10"
          style={{ left: `${100 - minJuniorRatio}%` }}
        >
          <div className="absolute -top-6 -left-2 text-xs text-red-600 text-red-400 font-medium">
            Min
          </div>
        </div>
      </div>

      {/* Status Message */}
      {!isHealthy && (
        <div className="flex items-center gap-2 text-sm text-red-600 text-red-400 bg-red-50 bg-red-950/20 p-2 rounded">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            Junior ratio is below minimum threshold ({minJuniorRatio}%). Senior
            deposits may be restricted.
          </span>
        </div>
      )}
    </div>
  );
}
