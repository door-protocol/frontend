'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';

interface DepositInputProps {
  value: string;
  onChange: (value: string) => void;
  balance?: number;
  apy?: number;
}

export default function DepositInput({
  value,
  onChange,
  balance = 0,
  apy = 5.5,
}: DepositInputProps) {
  const handleMaxClick = () => {
    if (balance) {
      onChange(balance.toFixed(2));
    }
  };

  const handlePercentClick = (percent: number) => {
    if (balance) {
      const amount = (balance * percent) / 100;
      onChange(amount.toFixed(2));
    }
  };

  return (
    <Card className="border-2 hover:border-border/80 transition-all duration-500 ease-in-out">
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Label */}
          <div className="flex items-center justify-between">
            <label className="text-base font-bold flex items-center gap-2">
              <span className="text-xl">💵</span>
              Deposit Amount
            </label>
            {balance > 0 && (
              <div className="px-3 py-1 rounded-full bg-secondary">
                <p className="text-sm font-medium text-secondary-foreground">
                  Balance: {formatNumber(balance)} USDT
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-3xl h-16 pr-24 font-bold border-2 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-950/30 px-4"
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {[25, 50, 75, 100].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => handlePercentClick(percent)}
                className="font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {percent}%
              </Button>
            ))}
          </div>

          {/* Estimated Return */}
          {value && Number(value) > 0 && (
            <div className="p-4 bg-secondary/50 rounded-xl border-2 space-y-2 animate-fade-in-up">
              <p className="text-sm font-medium text-muted-foreground">
                Estimated Annual Return
              </p>
              <p className="text-2xl font-bold text-blue-600">
                +${formatNumber(Number(value) * (apy / 100))}{' '}
                <span className="text-base font-medium text-muted-foreground">
                  ({apy}% APY)
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
