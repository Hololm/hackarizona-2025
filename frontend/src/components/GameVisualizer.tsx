import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "@/components/Card";

interface GameVisualizerProps {
  className?: string;
}

interface GameState {
  status: "waiting" | "playing" | "completed";
  dealerHand: any[];
  seats: any[];
}

const GameVisualizer: React.FC<GameVisualizerProps> = ({ className }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    dealerHand: [],
    seats: [],
  });

  useEffect(() => {
    const sessionId = "Y43CF1lOp5jrEDGAFf7cTMJeHPwsm8EZlCTNMlHuilieyLryQuUs!1225057540-b01c23b6";
    const tableId = "cy8me4k2b1en4r09";
    const wsUrl = `ws://127.0.0.1:8000/api/v1/ws?session_id=${sessionId}&table_id=${tableId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const messages = event.data.split("\n");
      messages.forEach((message) => {
        try {
          const parsedMessage = JSON.parse(message);
          console.log("Parsed message:", parsedMessage);
          handleWebSocketMessage(parsedMessage);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    console.log("Handling WebSocket message:", message);
    switch (message.event) {
      case "handle_dealer":
        console.log("Updating dealer hand:", message.data);
        setGameState((prev) => ({
          ...prev,
          dealerHand: [{ name: message.data.name, id: message.data.id }],
        }));
        break;

      case "handle_seat":
        console.log("Updating seats:", message.data);
        setGameState((prev) => ({
          ...prev,
          seats: [
            ...prev.seats,
            {
              ...message.data,
              cards: [],
            },
          ],
        }));
        break;

      case "handle_card":
        console.log("Updating cards for seat:", message.data.seat);
        setGameState((prev) => {
          const updatedSeats = prev.seats.map((seat) =>
            seat.seat_number === message.data.seat
              ? { ...seat, cards: [...(seat.cards || []), message.data] }
              : seat
          );
          return { ...prev, seats: updatedSeats };
        });
        break;

      default:
        console.warn("Unhandled event type:", message.event);
    }
  };

  // Find your seat (seat number 0)
  const yourSeat = gameState.seats.find((seat) => seat.seat_number === 0);

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

      <div className="relative min-h-[420px] p-6">
        {/* Dealer area */}
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

        {/* Your seat (seat number 0) */}
        {yourSeat && (
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full text-center z-10"
            style={{ bottom: "20px" }} // Adjust position as needed
          >
            <div
              className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-1"
              style={{
                position: "relative",
                top: "45px",
                left: "25px",
              }}
            >
              YOU
            </div>
            <div className="flex justify-center">
              {yourSeat.cards?.map((card, cardIndex) => (
                <Card
                  key={`your-seat-card-${cardIndex}`}
                  card={card}
                  className="transform scale-75 -ml-4 first:ml-0 border border-white/10 shadow-md"
                  animationDelay={cardIndex * 0.1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other players */}
        <div className="absolute top-[60px] left-0 w-[40%]">
          {gameState.seats
            .filter((seat) => seat.seat_number !== 0) // Exclude your seat
            .slice(0, 3)
            .map((seat, playerIndex) => (
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
                    top: "45px",
                    left: "25px",
                  }}
                >
                  {seat.screen_name || `PLAYER ${playerIndex + 1}`}
                </div>
                <div className="flex flex-row">
                  {seat.cards?.map((card, cardIndex) => (
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

        {/* Right side players */}
        <div className="absolute top-[60px] right-0 w-[40%]">
          {gameState.seats
            .filter((seat) => seat.seat_number !== 0) // Exclude your seat
            .slice(3, 6)
            .map((seat, playerIndex) => (
              <div
                key={`right-player-${playerIndex}`}
                className="absolute"
                style={{
                  top: `${playerIndex * 70}px`,
                  right: `${10 + playerIndex * 80}px`,
                }}
              >
                <div
                  className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-1"
                  style={{
                    position: "relative",
                    top: "45px",
                    left: "25px",
                  }}
                >
                  {seat.screen_name || `PLAYER ${playerIndex + 4}`}
                </div>
                <div className="flex flex-row justify-end">
                  {seat.cards?.map((card, cardIndex) => (
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
      </div>
    </div>
  );
};

export default GameVisualizer;