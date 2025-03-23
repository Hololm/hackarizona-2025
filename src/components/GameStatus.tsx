
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import Card from '@/components/Card';
import { cn } from '@/lib/utils';

interface GameStatusProps {
  className?: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ className }) => {
  const { data: gameState, isLoading } = useQuery({
    queryKey: ['gameState'],
    queryFn: api.getGameState,
    refetchInterval: 1000, // Refresh every second
  });

  if (isLoading || !gameState) {
    return (
      <div className={cn('glass-panel rounded-xl p-6 animate-pulse', className)}>
        <div className="text-center text-muted-foreground">Loading game state...</div>
      </div>
    );
  }

  const getStatusText = () => {
    switch (gameState.status) {
      case 'waiting':
        return 'Waiting to Start';
      case 'playing':
        return 'Game in Progress';
      case 'player_turn':
        return 'Player Turn';
      case 'dealer_turn':
        return 'Dealer Turn';
      case 'completed':
        if (gameState.result === 'win') return 'Player Wins!';
        if (gameState.result === 'lose') return 'Dealer Wins';
        if (gameState.result === 'push') return 'Push (Tie)';
        return 'Game Completed';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    if (gameState.status === 'waiting') return 'text-muted-foreground';
    if (gameState.status === 'completed') {
      if (gameState.result === 'win') return 'text-green-500';
      if (gameState.result === 'lose') return 'text-red-500';
      if (gameState.result === 'push') return 'text-amber-500';
    }
    return 'text-primary';
  };

  const getActionText = () => {
    if (!gameState.actionTaken) return null;
    
    const actionMap = {
      hit: 'AI chose to Hit',
      stand: 'AI chose to Stand',
      double: 'AI chose to Double Down',
      split: 'AI chose to Split',
    };
    
    return actionMap[gameState.actionTaken];
  };

  return (
    <div className={cn(
      'glass-panel rounded-xl p-6 animate-slide-up',
      'transition-all duration-300',
      className
    )}>
      <div className="flex flex-col space-y-8">
        <div className="text-center">
          <h2 className={cn('text-2xl font-medium mb-1', getStatusColor())}>
            {getStatusText()}
          </h2>
          {gameState.actionTaken && (
            <div className="text-sm text-muted-foreground">
              {getActionText()}
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">Dealer</h3>
              <span className="text-sm font-mono bg-secondary/70 px-2 py-0.5 rounded">
                Score: {gameState.dealerScore}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto py-2">
              {gameState.dealerHand.map((card, index) => (
                <Card
                  key={`dealer-${index}`}
                  card={card}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">Player</h3>
              <span className="text-sm font-mono bg-secondary/70 px-2 py-0.5 rounded">
                Score: {gameState.playerScore}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto py-2">
              {gameState.playerHand.map((card, index) => (
                <Card
                  key={`player-${index}`}
                  card={card}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
