'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export type TrancheType = 'senior' | 'junior';

interface TrancheSelectorProps {
  selectedTranche: TrancheType;
  onSelect: (tranche: TrancheType) => void;
  seniorAPY: number;
  juniorAPYRange: readonly [number, number];
}

export default function TrancheSelector({
  selectedTranche,
  onSelect,
  seniorAPY,
  juniorAPYRange,
}: TrancheSelectorProps) {
  const isSelected = (tranche: TrancheType) => selectedTranche === tranche;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Senior Tranche */}
      <Card
        className={`cursor-pointer transition-all duration-500 ease-in-out ${
          isSelected('senior')
            ? 'ring-4 ring-blue-500 dark:ring-blue-600 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 shadow-2xl shadow-blue-500/20 scale-105'
            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:shadow-xl'
        }`}
        onClick={() => onSelect('senior')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${isSelected('senior') ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              >
                🛡️
              </div>
              <span>Stable (DOOR-FIX)</span>
            </CardTitle>
            {isSelected('senior') && (
              <div className="p-2 rounded-full bg-blue-500 dark:bg-blue-600 animate-fade-in">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {seniorAPY}% APY
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Target return rate
              </p>
            </div>
            <div className="border-t pt-3 space-y-2 text-sm dark:border-zinc-800">
              <p className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    ✓
                  </span>
                </div>
                <span>Priority yield distribution</span>
              </p>
              <p className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    ✓
                  </span>
                </div>
                <span>Junior buffer protection</span>
              </p>
              <div className="mt-3 pt-3 border-t dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Risk:{' '}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    Low
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Junior Tranche */}
      <Card
        className={`cursor-pointer transition-all duration-500 ease-in-out ${
          isSelected('junior')
            ? 'ring-4 ring-orange-500 dark:ring-orange-600 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 shadow-2xl shadow-orange-500/20 scale-105'
            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:shadow-xl'
        }`}
        onClick={() => onSelect('junior')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${isSelected('junior') ? 'bg-orange-100 dark:bg-orange-900/50' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              >
                ⚔️
              </div>
              <span>Aggressive (DOOR-BOOST)</span>
            </CardTitle>
            {isSelected('junior') && (
              <div className="p-2 rounded-full bg-orange-500 dark:bg-orange-600 animate-fade-in">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {juniorAPYRange[0]}-{juniorAPYRange[1]}% APY
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Target return rate
              </p>
            </div>
            <div className="border-t pt-3 space-y-2 text-sm dark:border-zinc-800">
              <p className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 text-xs">
                    ⚡
                  </span>
                </div>
                <span>Excess yield concentration</span>
              </p>
              <p className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 text-xs">
                    ⚡
                  </span>
                </div>
                <span>Leverage effect</span>
              </p>
              <div className="mt-3 pt-3 border-t dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Risk:{' '}
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    High
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
