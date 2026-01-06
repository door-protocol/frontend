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
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Label */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Deposit Amount</label>
            {balance > 0 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Balance: {formatNumber(balance)} USDT
              </p>
            )}
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-2xl h-14 pr-20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => handlePercentClick(percent)}
                className="text-xs"
              >
                {percent}%
              </Button>
            ))}
          </div>

          {/* Estimated Return */}
          {value && Number(value) > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-1">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Estimated return (annual)
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                +${formatNumber(Number(value) * (apy / 100))}{' '}
                <span className="text-sm font-normal">({apy}% APY)</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
