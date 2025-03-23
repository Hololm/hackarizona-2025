import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import Card from "@/components/Card";

interface GameVisualizerProps {
  className?: string;
}

const GameVisualizer: React.FC<GameVisualizerProps> = ({ className }) => {
  const { data: gameState, isLoading } = useQuery({
    queryKey: ["gameState"],
    queryFn: api.getGameState,
    refetchInterval: 1000,
  });

  if (isLoading || !gameState) {
    return (
      <div
        className={cn(
          "glass-panel rounded-xl p-6 animate-pulse min-h-[300px] flex items-center justify-center",
          className
        )}
      >
        <div className="text-center text-muted-foreground">
          Loading game visualizer...
        </div>
      </div>
    );
  }

  const getTableStateClass = () => {
    if (gameState.status === "waiting")
      return "bg-neutral-100/80 dark:bg-neutral-900/80";
    if (gameState.status === "completed") {
      if (gameState.result === "win")
        return "bg-neutral-100/80 dark:bg-neutral-900/80";
      if (gameState.result === "lose")
        return "bg-neutral-100/80 dark:bg-neutral-900/80";
      if (gameState.result === "push")
        return "bg-neutral-100/80 dark:bg-neutral-900/80";
    }
    return "bg-neutral-100/80 dark:bg-neutral-900/80";
  };

  const generateOtherPlayerHands = () => {
    const otherPlayers = [];

    for (let i = 0; i < 6; i++) {
      const cardCount = Math.floor(Math.random() * 3) + 2;
      const hand = [];

      for (let j = 0; j < cardCount; j++) {
        hand.push({
          suit: ["hearts", "diamonds", "clubs", "spades"][
            Math.floor(Math.random() * 4)
          ],
          rank: [
            "A",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
          ][Math.floor(Math.random() * 13)],
          hidden: false,
        });
      }

      otherPlayers.push(hand);
    }

    return otherPlayers;
  };

  const otherPlayerHands = generateOtherPlayerHands();

  return (
    <div
      className={cn(
        "glass-panel rounded-xl overflow-hidden animate-slide-up shadow-xl",
        "transition-all duration-300 border-2 border-neutral-200/40 dark:border-neutral-800/40",
        className
      )}
    >
      <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Live Blackjack Table
        </h2>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {gameState.status === "playing" ? "Game in Progress" : "Table View"}
        </div>
      </div>

      <div
        className={cn(
          "relative min-h-[420px] p-6",
          "transition-colors duration-500",
          getTableStateClass()
        )}
      >
        {/* Table border pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full rounded-b-xl border-8 border-neutral-200 dark:border-neutral-800/40 flex items-center justify-center">
            <div className="w-[98%] h-[97%] rounded-[100%] border-2 border-neutral-300/20 dark:border-neutral-700/20"></div>
          </div>
        </div>

        {/* Casino table emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300/20 dark:text-neutral-700/20 text-sm font-serif tracking-widest pointer-events-none">
          BLACKJACK PAYS 3 TO 2
        </div>

        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300/20 dark:text-neutral-700/20 text-xs font-serif tracking-widest pointer-events-none rotate-180">
          DEALER MUST STAND ON 17
        </div>

        {/* Semi-circular table layout */}
        <div className="relative w-full h-[320px] mt-8">
          {/* Dealer area - top center */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full text-center z-10">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-medium">
              DEALER
            </div>
            <div className="flex justify-center">
              {gameState.dealerHand.map((card, index) => (
                <Card
                  key={`dealer-${index}`}
                  card={card}
                  className="transform scale-75 -ml-10 first:ml-0 border border-white/10 shadow-md"
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Left side players - positioned in semi-circular arc */}
          <div className="absolute top-[60px] left-0 w-[40%]">
            {otherPlayerHands.slice(0, 3).map((hand, playerIndex) => (
              <div
                key={`left-player-${playerIndex}`}
                className="absolute"
                style={{
                  top: `${playerIndex * 70}px`,
                  left: `${10 + playerIndex * 80}px`,
                }}
              >
                <div
                  className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-1"
                  style={{
                    position: "relative",
                    top: "45px", // Move name down
                    left: "25px", // Move name right
                  }}
                >
                  PLAYER {playerIndex + 1}
                </div>

                <div className="flex flex-row">
                  {hand.map((card, cardIndex) => (
                    <Card
                      key={`left-player-${playerIndex}-card-${cardIndex}`}
                      card={card}
                      className="transform scale-[0.4] -ml-[52px] first:ml-0 border border-white/10 shadow-sm"
                      animationDelay={cardIndex * 0.05}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right side players - positioned in semi-circular arc */}
          <div className="absolute top-[60px] right-0 w-[40%]">
            {otherPlayerHands.slice(3, 6).map((hand, playerIndex) => (
              <div
                key={`right-player-${playerIndex}`}
                className="absolute"
                style={{
                  top: `${playerIndex * 70}px`,
                  right: `${10 + playerIndex * 80}px`,
                }}
              >
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-1"
                style={{
                    position: "relative",
                    top: "45px", // Move name down
                    left: "25px", // Move name right
                  }}
                >
                  PLAYER {playerIndex + 4}
                </div>
                <div className="flex flex-row justify-end">
                  {hand.map((card, cardIndex) => (
                    <Card
                      key={`right-player-${playerIndex}-card-${cardIndex}`}
                      card={card}
                      className="transform scale-[0.4] -mr-[52px] last:mr-0 border border-white/10 shadow-sm"
                      animationDelay={cardIndex * 0.05}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Game status indicator - center of table */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="py-2 px-5 rounded-full bg-neutral-100/30 dark:bg-neutral-900/30 backdrop-blur-sm shadow-sm border border-neutral-300/20 dark:border-neutral-700/20 text-center">
              {gameState.status === "waiting" && (
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  PLACE YOUR BET
                </div>
              )}
              {gameState.status === "playing" && (
                <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                  IN PLAY
                </div>
              )}
              {gameState.status === "completed" && (
                <div
                  className={cn(
                    "text-xs font-medium",
                    gameState.result === "win"
                      ? "text-green-600 dark:text-green-400"
                      : gameState.result === "lose"
                      ? "text-red-600 dark:text-red-400"
                      : "text-neutral-600 dark:text-neutral-300"
                  )}
                >
                  {gameState.result === "win"
                    ? "YOU WIN!"
                    : gameState.result === "lose"
                    ? "DEALER WINS"
                    : "PUSH"}
                </div>
              )}
            </div>
          </div>

          {/* Main player - bottom center */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full text-center z-10">
            <div className="flex justify-center gap-1">
              {gameState.playerHand.map((card, index) => (
                <Card
                  key={`player-${index}`}
                  card={card}
                  className="transform scale-75 -ml-4 first:ml-0 border border-white/10 shadow-md"
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 font-medium">
              YOU
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameVisualizer;
