
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';
import GameStatus from '@/components/GameStatus';
import Statistics from '@/components/Statistics';
import ControlPanel from '@/components/ControlPanel';
import GameVisualizer from '@/components/GameVisualizer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GameVisualizer />
            <GameStatus />
          </div>
          
          <div className="space-y-6">
            <ControlPanel />
            <Statistics />
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Blackjack AI Client • Built with precision and simplicity</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
