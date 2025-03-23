import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { debounce } from 'lodash-es';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('controls');
  const [localBetAmount, setLocalBetAmount] = useState<number>(1);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  });

  useEffect(() => {
    if (settings) {
      setLocalBetAmount(settings.betAmount);
    }
  }, [settings]);

  const startMutation = useMutation({
    mutationFn: api.startAI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
      toast.success('AI started successfully');
    },
    onError: () => {
      toast.error('Failed to start AI');
    },
  });

  const stopMutation = useMutation({
    mutationFn: api.stopAI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
      toast.success('AI stopped successfully');
    },
    onError: () => {
      toast.error('Failed to stop AI');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
      toast.success('Settings updated');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const resetStatisticsMutation = useMutation({
    mutationFn: api.resetStatistics,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['statistics'],
      });
      toast.success('Statistics reset successfully');
    },
    onError: () => {
      toast.error('Failed to reset statistics');
    },
  });

  const debouncedUpdate = useCallback(
    debounce((value: number) => {
      updateSettingsMutation.mutate({ betAmount: value });
    }, 300),
    [updateSettingsMutation]
  );

  useEffect(() => {
    return () => debouncedUpdate.cancel();
  }, [debouncedUpdate]);

  const handleStartAI = () => {
    startMutation.mutate({});
  };

  const handleStopAI = () => {
    stopMutation.mutate();
  };

  const handleBetAmountChange = (value: number[]) => {
    setLocalBetAmount(value[0]);
    debouncedUpdate(value[0]);
  };

  const handleStrategyChange = (strategy: 'basic' | 'aggressive' | 'conservative') => {
    updateSettingsMutation.mutate({ strategy });
  };

  const handleAutoRestartChange = (autoRestart: boolean) => {
    updateSettingsMutation.mutate({ autoRestart });
  };

  const handleResetStatistics = () => {
    resetStatisticsMutation.mutate();
  };

  if (isLoading || !settings) {
    return (
      <div className={cn('glass-panel rounded-xl p-6 animate-pulse', className)}>
        <div className="text-center text-muted-foreground">Loading controls...</div>
      </div>
    );
  }

  return (
    <div className={cn(
      'glass-panel rounded-xl p-6 animate-slide-up',
      'transition-all duration-300',
      className
    )}>
      <Tabs
        defaultValue="controls"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="controls" className="space-y-6">
          <div className="flex items-center justify-center">
            <div className={cn(
              'px-4 py-2 rounded-full text-sm font-medium',
              settings.isRunning
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {settings.isRunning ? 'AI is Running' : 'AI is Stopped'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={handleStartAI}
              disabled={settings.isRunning || startMutation.isPending}
              className="w-full"
            >
              {startMutation.isPending ? 'Starting...' : 'Start AI'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleStopAI}
              disabled={!settings.isRunning || stopMutation.isPending}
              className="w-full"
            >
              {stopMutation.isPending ? 'Stopping...' : 'Stop AI'}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">Current Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bet Amount:</span>
                <span className="text-sm font-medium">${settings.betAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Strategy:</span>
                <span className="text-sm font-medium capitalize">{settings.strategy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Auto Restart:</span>
                <span className="text-sm font-medium">{settings.autoRestart ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetStatistics}
              disabled={resetStatisticsMutation.isPending}
              className="w-full text-muted-foreground hover:text-foreground transition-colors"
            >
              {resetStatisticsMutation.isPending ? 'Resetting...' : 'Reset Statistics'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Bet Amount</h3>
              <div className="space-y-3">
                <Slider
                  value={[localBetAmount]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={handleBetAmountChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$1</span>
                  <span>${localBetAmount}</span>
                  <span>$100</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Playing Strategy</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.strategy === 'conservative' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStrategyChange('conservative')}
                  className="w-full"
                >
                  Conservative
                </Button>
                <Button
                  variant={settings.strategy === 'basic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStrategyChange('basic')}
                  className="w-full"
                >
                  Basic
                </Button>
                <Button
                  variant={settings.strategy === 'aggressive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStrategyChange('aggressive')}
                  className="w-full"
                >
                  Aggressive
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-restart">Auto Restart Games</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically start new games when one is completed
                  </p>
                </div>
                <Switch
                  id="auto-restart"
                  checked={settings.autoRestart}
                  onCheckedChange={handleAutoRestartChange}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
