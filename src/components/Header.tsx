
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      'w-full py-6 px-8 flex justify-between items-center glass-panel',
      'bg-background/90 backdrop-blur-md border-b',
      'animate-fade-in z-50',
      className
    )}>
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-sm">
          B
        </div>
        <div>
          <h1 className="text-xl font-medium leading-none">Blackjack AI</h1>
          <p className="text-sm text-muted-foreground">Headless Client</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="h-6 w-6 rounded-full bg-green-500 pulse-subtle shadow-sm" />
        <span className="text-sm font-medium">AI Connected</span>
      </div>
    </header>
  );
};

export default Header;
