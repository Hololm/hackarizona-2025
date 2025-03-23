
import React from 'react';
import { Card as CardType } from '@/types';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  className?: string;
  flipped?: boolean;
  animationDelay?: number;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  className, 
  flipped = false,
  animationDelay = 0
}) => {
  const suitColor = card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-black';
  
  const getSuitSymbol = (suit: CardType['suit']) => {
    switch(suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };
  
  return (
    <div 
      className={cn(
        'relative w-20 h-32 perspective-1000 transform transition-transform',
        flipped && 'rotate-y-180',
        className
      )}
      style={{ 
        transformStyle: 'preserve-3d',
        animation: `fade-in 0.3s ease-out forwards`,
        animationDelay: `${animationDelay}s`
      }}
    >
      {/* Card Front */}
      <div 
        className={cn(
          'absolute w-full h-full rounded-lg bg-white shadow-md p-2 flex flex-col justify-between card-face',
          'border border-gray-200 transition-all duration-300'
        )}
      >
        {!card.hidden && (
          <>
            <div className={cn('flex justify-between items-center', suitColor)}>
              <span className="text-lg font-medium">{card.rank}</span>
              <span className="text-lg">{getSuitSymbol(card.suit)}</span>
            </div>
            <div className={cn('text-4xl flex justify-center items-center', suitColor)}>
              {getSuitSymbol(card.suit)}
            </div>
            <div className={cn('flex justify-between items-center rotate-180', suitColor)}>
              <span className="text-lg font-medium">{card.rank}</span>
              <span className="text-lg">{getSuitSymbol(card.suit)}</span>
            </div>
          </>
        )}
        {card.hidden && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 text-xl">?</div>
          </div>
        )}
      </div>
      
      {/* Card Back */}
      <div 
        className={cn(
          'absolute w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-2 card-face card-back',
          'border border-blue-600 shadow-md'
        )}
      >
        <div className="w-full h-full border-2 border-white/30 rounded flex items-center justify-center">
          <div className="text-white text-opacity-70 text-2xl">♠️</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
