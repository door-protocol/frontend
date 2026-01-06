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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Senior Tranche */}
      <Card
        className={`cursor-pointer transition-all ${
          isSelected('senior')
            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
        }`}
        onClick={() => onSelect('senior')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              🛡️ Stable (DOOR-FIX)
            </CardTitle>
            {isSelected('senior') && (
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {seniorAPY}% APY
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Target return rate
              </p>
            </div>
            <div className="border-t pt-2 space-y-1 text-sm dark:border-zinc-800">
              <p className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>{' '}
                Priority yield distribution
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>{' '}
                Junior buffer protection
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Risk: <span className="font-medium">Low</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Junior Tranche */}
      <Card
        className={`cursor-pointer transition-all ${
          isSelected('junior')
            ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950/20'
            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
        }`}
        onClick={() => onSelect('junior')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              ⚔️ Aggressive (DOOR-BOOST)
            </CardTitle>
            {isSelected('junior') && (
              <Check className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {juniorAPYRange[0]}-{juniorAPYRange[1]}% APY
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Target return rate
              </p>
            </div>
            <div className="border-t pt-2 space-y-1 text-sm dark:border-zinc-800">
              <p className="flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">⚡</span>{' '}
                Excess yield concentration
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">⚡</span>{' '}
                Leverage effect
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Risk: <span className="font-medium">High</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
