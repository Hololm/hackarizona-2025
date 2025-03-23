
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';

interface StatisticsProps {
  className?: string;
}

const Statistics: React.FC<StatisticsProps> = ({ className }) => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: api.getStatistics,
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  if (isLoading || !statistics) {
    return (
      <div className={cn('glass-panel rounded-xl p-6 animate-pulse', className)}>
        <div className="text-center text-muted-foreground">Loading statistics...</div>
      </div>
    );
  }

  const StatItem = ({ label, value, suffix = '', highlight = false }: { 
    label: string;
    value: number | string;
    suffix?: string;
    highlight?: boolean;
  }) => (
    <div className="flex flex-col">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn(
        "text-lg font-medium",
        highlight && "text-primary"
      )}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix}
      </div>
    </div>
  );

  return (
    <div className={cn(
      'glass-panel rounded-xl p-6 animate-slide-up',
      'transition-all duration-300',
      className
    )}>
      <h2 className="text-xl font-medium mb-6">Game Statistics</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <StatItem 
          label="Total Games" 
          value={statistics.totalGames} 
          highlight 
        />
        <StatItem 
          label="Win Rate" 
          value={(statistics.winRate * 100).toFixed(1)} 
          suffix="%" 
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatItem 
          label="Wins" 
          value={statistics.wins} 
        />
        <StatItem 
          label="Losses" 
          value={statistics.losses} 
        />
        <StatItem 
          label="Pushes" 
          value={statistics.pushes} 
        />
      </div>
      
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-6">
          <StatItem 
            label="Starting Bankroll" 
            value={statistics.bankroll.toLocaleString()} 
            suffix=" coins" 
          />
          <StatItem 
            label="Profit/Loss" 
            value={statistics.profit.toLocaleString()} 
            suffix=" coins" 
          />
        </div>
        <div className="mt-4 p-3 bg-background/50 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Net Result:</div>
            <div className={cn(
              "text-lg font-semibold",
              statistics.profit > 0 ? "text-green-500" : 
              statistics.profit < 0 ? "text-red-500" : "text-muted-foreground"
            )}>
              {statistics.netResult.toLocaleString()} coins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
