
import { GameState, GameStatistics, AISettings } from '@/types';

// Mock API functions for frontend development
// These would be replaced with actual API calls to your Python backend

const BACKEND_URL = 'http://localhost:8000/api';

// Simulate API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Random card generation for the mock
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

const generateRandomCard = (hidden = false) => ({
  suit: SUITS[Math.floor(Math.random() * SUITS.length)],
  rank: RANKS[Math.floor(Math.random() * RANKS.length)],
  hidden
});

// Calculate card values
const getCardValue = (rank: string) => {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
};

// Calculate hand value including Ace logic
const calculateHandValue = (cards: Array<{ rank: string; suit: string; hidden?: boolean }>) => {
  // Filter out hidden cards
  const visibleCards = cards.filter(card => !card.hidden);
  
  let sum = 0;
  let aces = 0;
  
  // Count aces separately
  for (const card of visibleCards) {
    if (card.rank === 'A') {
      aces += 1;
    } else {
      sum += getCardValue(card.rank);
    }
  }
  
  // Add aces optimally
  for (let i = 0; i < aces; i++) {
    if (sum + 11 <= 21) {
      sum += 11;
    } else {
      sum += 1;
    }
  }
  
  return sum;
};

// Check if a hand contains an Ace that can be counted as 11
const hasSoftAce = (cards: Array<{ rank: string; suit: string; hidden?: boolean }>) => {
  const visibleCards = cards.filter(card => !card.hidden);
  
  let sum = 0;
  let hasAce = false;
  
  for (const card of visibleCards) {
    if (card.rank === 'A') {
      hasAce = true;
    } else {
      sum += getCardValue(card.rank);
    }
  }
  
  // If there's an Ace and the total would be <= 21 with Ace as 11
  return hasAce && (sum + 11 <= 21);
};

// Mock data
let mockGameState: GameState = {
  playerHand: [generateRandomCard(), generateRandomCard()],
  dealerHand: [generateRandomCard(), generateRandomCard(true)],
  playerScore: 0,
  dealerScore: 0,
  status: 'waiting'
};

// Initialize scores based on initial hands
mockGameState.playerScore = calculateHandValue(mockGameState.playerHand);
mockGameState.dealerScore = calculateHandValue(mockGameState.dealerHand);

let mockStatistics: GameStatistics = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  winRate: 0,
  bankroll: 1000,
  profit: 0,
  netResult: 0
};

let mockSettings: AISettings = {
  isRunning: false,
  betAmount: 10,
  strategy: 'basic',
  autoRestart: true
};

export const api = {
  // Status check
  checkConnection: async (): Promise<boolean> => {
    try {
      // In a real implementation, this would ping the backend
      await delay(500);
      return true;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  },
  
  // Game control
  startAI: async (settings: Partial<AISettings>): Promise<boolean> => {
    try {
      await delay(1000);
      mockSettings = { ...mockSettings, ...settings, isRunning: true };
      mockGameState = { ...mockGameState, status: 'playing' };
      return true;
    } catch (error) {
      console.error('Failed to start AI:', error);
      return false;
    }
  },
  
  stopAI: async (): Promise<boolean> => {
    try {
      await delay(500);
      mockSettings.isRunning = false;
      mockGameState.status = 'waiting';
      return true;
    } catch (error) {
      console.error('Failed to stop AI:', error);
      return false;
    }
  },
  
  // Game state
  getGameState: async (): Promise<GameState> => {
    await delay(300);
    
    // Simulate some game progress if AI is running
    if (mockSettings.isRunning && mockGameState.status === 'playing') {
      const actions = ['hit', 'stand', 'double'] as const;
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      if (randomAction === 'hit') {
        mockGameState.playerHand.push(generateRandomCard());
        mockGameState.playerScore = calculateHandValue(mockGameState.playerHand);
      } else if (randomAction === 'double') {
        mockGameState.playerHand.push(generateRandomCard());
        mockGameState.playerScore = calculateHandValue(mockGameState.playerHand);
      }
      
      mockGameState.actionTaken = randomAction;
      
      // Simulate game completion randomly
      if (Math.random() > 0.7 || mockGameState.playerScore >= 21) {
        mockGameState.status = 'completed';
        mockGameState.dealerHand[1].hidden = false;
        
        // Dealer plays their hand according to rules
        // Dealer must hit until they have at least 17
        // But must hit on soft 17 (A + 6)
        while (
          calculateHandValue(mockGameState.dealerHand) < 17 ||
          (calculateHandValue(mockGameState.dealerHand) === 17 && hasSoftAce(mockGameState.dealerHand))
        ) {
          mockGameState.dealerHand.push(generateRandomCard());
        }
        
        mockGameState.dealerScore = calculateHandValue(mockGameState.dealerHand);
        
        // Determine result
        // Player busts (over 21)
        if (mockGameState.playerScore > 21) {
          mockGameState.result = 'lose';
          mockStatistics.losses += 1;
        } 
        // Dealer busts (over 21)
        else if (mockGameState.dealerScore > 21) {
          mockGameState.result = 'win';
          mockStatistics.wins += 1;
        } 
        // Player has higher score
        else if (mockGameState.playerScore > mockGameState.dealerScore) {
          mockGameState.result = 'win';
          mockStatistics.wins += 1;
        } 
        // Push (tie)
        else if (mockGameState.playerScore === mockGameState.dealerScore) {
          mockGameState.result = 'push';
          mockStatistics.pushes += 1;
        } 
        // Dealer has higher score
        else {
          mockGameState.result = 'lose';
          mockStatistics.losses += 1;
        }
        
        mockStatistics.totalGames += 1;
        mockStatistics.winRate = mockStatistics.wins / mockStatistics.totalGames;
        mockStatistics.profit = mockStatistics.wins * mockSettings.betAmount - mockStatistics.losses * mockSettings.betAmount;
        mockStatistics.netResult = mockStatistics.bankroll + mockStatistics.profit;
        
        // Auto restart if enabled
        if (mockSettings.autoRestart) {
          setTimeout(() => {
            const playerCards = [generateRandomCard(), generateRandomCard()];
            const dealerCards = [generateRandomCard(), generateRandomCard(true)];
            
            mockGameState = {
              playerHand: playerCards,
              dealerHand: dealerCards,
              playerScore: calculateHandValue(playerCards),
              dealerScore: calculateHandValue(dealerCards),
              status: 'playing'
            };
          }, 2000);
        } else {
          mockSettings.isRunning = false;
        }
      }
    }
    
    return { ...mockGameState };
  },
  
  getStatistics: async (): Promise<GameStatistics> => {
    await delay(300);
    return { ...mockStatistics };
  },
  
  getSettings: async (): Promise<AISettings> => {
    await delay(300);
    return { ...mockSettings };
  },
  
  updateSettings: async (settings: Partial<AISettings>): Promise<AISettings> => {
    await delay(300);
    mockSettings = { ...mockSettings, ...settings };
    return { ...mockSettings };
  },
  
  // For testing purposes
  resetStatistics: async (): Promise<GameStatistics> => {
    await delay(300);
    mockStatistics = {
      totalGames: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      winRate: 0,
      bankroll: 1000,
      profit: 0,
      netResult: 1000
    };
    return { ...mockStatistics };
  }
};
