import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      'w-full py-4 px-6 flex justify-between items-center',
      'bg-gradient-to-r from-gray-900 to-gray-800',
      'border-b border-gray-700 shadow-lg',
      'animate-fade-in z-50',
      className
    )}>
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 relative">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
            <rect width="24" height="24" rx="6" fill="#4CAF50"/>
            <path d="M7 17L17 7M17 7H11M17 7V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 12H10L12 10L14 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white leading-none">Blackjack AI</h1>
          <p className="text-sm text-green-400">Intelligent Gaming Assistant</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-glow" />
        <span className="text-sm font-medium text-green-400">AI Active</span>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
          Start Game
        </button>
      </div>
    </header>
  );
};

export default Header;
