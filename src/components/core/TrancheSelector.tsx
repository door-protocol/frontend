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
            ? 'ring-4 ring-blue-500 dark:ring-primary bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-card dark:to-card shadow-2xl shadow-blue-500/20 scale-105'
            : 'hover:bg-zinc-50 dark:hover:bg-muted hover:shadow-xl'
        }`}
        onClick={() => onSelect('senior')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${isSelected('senior') ? 'bg-blue-100 dark:bg-primary/10' : 'bg-zinc-100 dark:bg-muted'}`}
              >
                🛡️
              </div>
              <span>Stable (DOOR-FIX)</span>
            </CardTitle>
            {isSelected('senior') && (
              <div className="p-2 rounded-full bg-blue-500 dark:bg-primary animate-fade-in">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-primary mb-1">
                {seniorAPY}% APY
              </p>
              <p className="text-sm text-zinc-600 dark:text-muted-foreground">
                Target return rate
              </p>
            </div>
            <div className="border-t pt-3 space-y-2 text-sm dark:border-border">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    ✓
                  </span>
                </div>
                <span>Priority yield distribution</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">
                    ✓
                  </span>
                </div>
                <span>Junior buffer protection</span>
              </div>
              <div className="mt-3 pt-3 border-t dark:border-border">
                <p className="text-xs text-zinc-500 dark:text-muted-foreground">
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
            ? 'ring-4 ring-orange-500 dark:ring-accent bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-card dark:to-card shadow-2xl shadow-orange-500/20 scale-105'
            : 'hover:bg-zinc-50 dark:hover:bg-muted hover:shadow-xl'
        }`}
        onClick={() => onSelect('junior')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${isSelected('junior') ? 'bg-orange-100 dark:bg-accent/10' : 'bg-zinc-100 dark:bg-muted'}`}
              >
                ⚔️
              </div>
              <span>Aggressive (DOOR-BOOST)</span>
            </CardTitle>
            {isSelected('junior') && (
              <div className="p-2 rounded-full bg-orange-500 dark:bg-accent animate-fade-in">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-accent mb-1">
                {juniorAPYRange[0]}-{juniorAPYRange[1]}% APY
              </p>
              <p className="text-sm text-zinc-600 dark:text-muted-foreground">
                Target return rate
              </p>
            </div>
            <div className="border-t pt-3 space-y-2 text-sm dark:border-border">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-accent/20 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-accent text-xs">
                    ⚡
                  </span>
                </div>
                <span>Excess yield concentration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-accent/20 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-accent text-xs">
                    ⚡
                  </span>
                </div>
                <span>Leverage effect</span>
              </div>
              <div className="mt-3 pt-3 border-t dark:border-border">
                <p className="text-xs text-zinc-500 dark:text-muted-foreground">
                  Risk:{' '}
                  <span className="font-bold text-orange-600 dark:text-accent">
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
