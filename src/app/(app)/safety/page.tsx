'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import {
  useCurrentSafetyLevel,
  useCurrentSafetyConfig,
  useHealthStatus,
  useSeniorDepositsPaused,
  useJuniorDepositsPaused,
  SafetyLevel,
  getSafetyLevelName,
} from '@/hooks/useSafetyModule';
import { useCoreVaultStats } from '@/hooks/useCoreVault';
import { formatUnits } from 'viem';
import { DEFAULT_MIN_JUNIOR_RATIO, DEFAULT_TARGET_APY } from '@/lib/config';

export default function SafetyPage() {
  const { level, isLoading: levelLoading } = useCurrentSafetyLevel();
  const { config } = useCurrentSafetyConfig();
  const { healthStatus } = useHealthStatus();
  const { stats } = useCoreVaultStats();
  const { isPaused: seniorPausedValue } = useSeniorDepositsPaused();
  const { isPaused: juniorPausedValue } = useJuniorDepositsPaused();

  // Use fallback values when data is not available
  const currentLevel = level ?? SafetyLevel.HEALTHY;
  const seniorPausedValueValue = seniorPausedValue ?? false;
  const juniorPausedValueValue = juniorPausedValue ?? false;

  const getLevelColor = (levelValue: SafetyLevel) => {
    switch (levelValue) {
      case SafetyLevel.HEALTHY:
        return 'green';
      case SafetyLevel.CAUTION:
        return 'blue';
      case SafetyLevel.WARNING:
        return 'yellow';
      case SafetyLevel.DANGER:
        return 'orange';
      case SafetyLevel.CRITICAL:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getLevelIcon = (levelValue: SafetyLevel) => {
    switch (levelValue) {
      case SafetyLevel.HEALTHY:
      case SafetyLevel.CAUTION:
        return <ShieldCheck className="h-8 w-8" />;
      case SafetyLevel.WARNING:
        return <AlertCircle className="h-8 w-8" />;
      case SafetyLevel.DANGER:
      case SafetyLevel.CRITICAL:
        return <AlertTriangle className="h-8 w-8" />;
      default:
        return <Info className="h-8 w-8" />;
    }
  };

  const getLevelDescription = (levelValue: SafetyLevel) => {
    switch (levelValue) {
      case SafetyLevel.HEALTHY:
        return 'Protocol is operating optimally with sufficient junior buffer';
      case SafetyLevel.CAUTION:
        return 'Junior ratio is slightly below optimal levels';
      case SafetyLevel.WARNING:
        return 'Junior ratio is approaching critical thresholds';
      case SafetyLevel.DANGER:
        return 'Junior ratio is critically low, senior deposits disabled';
      case SafetyLevel.CRITICAL:
        return 'Protocol is in critical state, all deposits paused';
      default:
        return 'Loading safety status...';
    }
  };

  console.log('=== Safety Page Data ===');
  console.log('healthStatus:', healthStatus);
  console.log('stats:', stats);
  console.log('config:', config);
  console.log('level:', level);

  const currentRatio = healthStatus
    ? Number(healthStatus.currentRatio) / 100
    : stats
      ? Number(stats.juniorRatio) / 100
      : 0;
  const minRatio = config
    ? Number(config.minJuniorRatio) / 100
    : DEFAULT_MIN_JUNIOR_RATIO;
  const targetAPY = config
    ? Number(config.seniorTargetAPY) / 100
    : DEFAULT_TARGET_APY;

  console.log('Calculated currentRatio:', currentRatio);
  console.log('Calculated minRatio:', minRatio);
  console.log('Calculated targetAPY:', targetAPY);
  console.log('===========================');

  const color = getLevelColor(currentLevel);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-red-600 bg-clip-text text-transparent mb-3">
          Safety Monitor
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time protocol health and 5-level safety system
        </p>
      </div>

      {/* Current Safety Level */}
      <Card
        className={`border-2 border-${color}-200 dark:border-${color}-900 bg-linear-to-br from-${color}-50/50 dark:from-${color}-950/20 to-transparent shadow-xl`}
      >
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className={`p-4 rounded-full bg-${color}-100 dark:bg-${color}-950/30 text-${color}-600 dark:text-${color}-400`}
              >
                {getLevelIcon(currentLevel)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Safety Level
                </p>
                <h2
                  className={`text-4xl font-bold text-${color}-600 dark:text-${color}-400 mb-2`}
                >
                  {getSafetyLevelName(currentLevel)}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  {getLevelDescription(currentLevel)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Junior Ratio</p>
              <p className="text-5xl font-bold text-foreground">
                {currentRatio.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Min: {minRatio.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Protocol Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                (healthStatus?.isHealthy ?? true)
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              {(healthStatus?.isHealthy ?? true) ? 'Healthy' : 'Unhealthy'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                (healthStatus?.isCritical ?? false)
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {(healthStatus?.isCritical ?? false) ? 'Critical' : 'Normal'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Senior Target APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {targetAPY.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deposit Status */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-6 rounded-lg border-2 ${
                seniorPausedValue
                  ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20'
                  : config?.seniorDepositsEnabled
                    ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20'
                    : 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">🛡️ Senior Deposits</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    seniorPausedValue
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      : config?.seniorDepositsEnabled
                        ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                        : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                  }`}
                >
                  {seniorPausedValue
                    ? 'Paused'
                    : config?.seniorDepositsEnabled
                      ? 'Enabled'
                      : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {seniorPausedValue
                  ? 'Senior deposits are manually paused by admin'
                  : config?.seniorDepositsEnabled
                    ? 'Senior deposits are currently accepting new funds'
                    : 'Senior deposits disabled due to safety level'}
              </p>
              {config?.maxSeniorDeposit &&
                config.maxSeniorDeposit < BigInt(10 ** 12) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Max deposit: {formatUnits(config.maxSeniorDeposit, 6)} USDC
                  </p>
                )}
            </div>

            <div
              className={`p-6 rounded-lg border-2 ${
                juniorPausedValue
                  ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20'
                  : config?.juniorDepositsEnabled
                    ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20'
                    : 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">⚔️ Junior Deposits</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    juniorPausedValue
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      : config?.juniorDepositsEnabled
                        ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                        : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                  }`}
                >
                  {juniorPausedValue
                    ? 'Paused'
                    : config?.juniorDepositsEnabled
                      ? 'Enabled'
                      : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {juniorPausedValue
                  ? 'Junior deposits are manually paused by admin'
                  : config?.juniorDepositsEnabled
                    ? 'Junior deposits are currently accepting new funds'
                    : 'Junior deposits disabled due to critical safety level'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Levels Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Level System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                level: SafetyLevel.HEALTHY,
                name: 'Healthy',
                ratio: '≥ 20%',
                description:
                  'Optimal protocol health with strong junior buffer',
                seniorAPY: '6.0%',
                deposits: 'All deposits enabled',
              },
              {
                level: SafetyLevel.CAUTION,
                name: 'Caution',
                ratio: '15-20%',
                description: 'Protocol operating normally with adequate buffer',
                seniorAPY: '5.5%',
                deposits: 'All deposits enabled',
              },
              {
                level: SafetyLevel.WARNING,
                name: 'Warning',
                ratio: '10-15%',
                description: 'Junior buffer approaching critical levels',
                seniorAPY: '5.0%',
                deposits: 'Limited senior deposits ($100K max)',
              },
              {
                level: SafetyLevel.DANGER,
                name: 'Danger',
                ratio: '5-10%',
                description:
                  'Critical junior buffer, protective measures active',
                seniorAPY: '4.0%',
                deposits: 'Senior deposits disabled',
              },
              {
                level: SafetyLevel.CRITICAL,
                name: 'Critical',
                ratio: '< 5%',
                description: 'Emergency state, all deposits paused',
                seniorAPY: '3.0%',
                deposits: 'All deposits disabled',
              },
            ].map((item) => {
              const itemColor = getLevelColor(item.level);
              const isCurrentLevel = currentLevel === item.level;

              return (
                <div
                  key={item.name}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCurrentLevel
                      ? `border-${itemColor}-500 bg-${itemColor}-50 dark:bg-${itemColor}-950/30 shadow-md`
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`px-3 py-1 rounded-lg font-bold text-sm ${
                          isCurrentLevel
                            ? `bg-${itemColor}-100 dark:bg-${itemColor}-950 text-${itemColor}-700 dark:text-${itemColor}-300`
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            isCurrentLevel
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {item.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Junior Ratio: {item.ratio} • Senior APY:{' '}
                          {item.seniorAPY} • {item.deposits}
                        </p>
                      </div>
                    </div>
                    {isCurrentLevel && (
                      <div className="ml-4">
                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          Current
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Protocol Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">
                  Senior Principal
                </p>
                <p className="text-xl font-bold text-foreground">
                  ${formatUnits(stats.seniorPrincipal, 6)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">
                  Junior Principal
                </p>
                <p className="text-xl font-bold text-foreground">
                  ${formatUnits(stats.juniorPrincipal, 6)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Assets
                </p>
                <p className="text-xl font-bold text-foreground">
                  ${formatUnits(stats.totalAssets, 6)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">
                  Junior Ratio
                </p>
                <p className="text-xl font-bold text-foreground">
                  {(Number(stats.juniorRatio) / 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
