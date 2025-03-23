
export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: CardSuit;
  rank: CardRank;
  hidden?: boolean;
}

export interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  playerScore: number;
  dealerScore: number;
  status: 'waiting' | 'playing' | 'player_turn' | 'dealer_turn' | 'completed';
  result?: 'win' | 'lose' | 'push';
  actionTaken?: 'hit' | 'stand' | 'double' | 'split';
}

export interface GameStatistics {
  totalGames: number;
  wins: number;
  losses: number;
  pushes: number;
  winRate: number;
  bankroll: number;
  profit: number;
  netResult: number;
}

export interface AISettings {
  isRunning: boolean;
  betAmount: number;
  strategy: 'basic' | 'aggressive' | 'conservative';
  autoRestart: boolean;
}

export interface APIStatus {
  connected: boolean;
  lastPing: Date | null;
  error: string | null;
}
