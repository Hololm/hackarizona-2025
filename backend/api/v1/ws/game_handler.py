import asyncio
import numpy as np
import boto3
import pickle
import os
from dotenv import load_dotenv
from typing import Optional, Dict, Tuple
from pragmatic_blackjack import HandlerBase, BetsOpen, Subscribe, DecisionInc, Decision, Card
from pragmatic_blackjack.event import Seat as SeatEvent
from pragmatic_blackjack.seat import Seat


load_dotenv()

class GameHandler(HandlerBase):
    def __init__(self, table, websocket, min_bet, max_bet):
        super().__init__()

        self.table = table
        self.websocket = websocket
        self.min_bet: int = min_bet
        self.max_bet: int = max_bet

        self.seats: list[SeatEvent] = []
        self.seat: Seat | None = None
        self.q_table: Dict[Tuple[int, bool, int], np.ndarray] = {}
        self.has_ace = False

        self.s3_bucket = os.getenv('S3_BUCKET')
        self.s3_key = os.getenv('S3_KEY')

        self.aws_key = os.getenv('AWS_ACCESS_KEY_ID')
        self.aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')


    @property
    def get_empty_seat(self) -> int | None:
        seat_numbers = [seat.seat_number for seat in self.seats]
        empty_seats = [x for x in range(0, 6) if x not in seat_numbers]

        if empty_seats:
            return max(empty_seats)

    def handle_subscribe(self, event: Subscribe, raw: str = None):
        self.seat = self.table.sit(self.get_empty_seat)

        if self.websocket and self.seat:
           data = {
                "event": "sat_down",
                "data": {"seat_num": self.seat.seat_number}
            }

           asyncio.create_task(self.websocket.send_json(data))

    def handle_bets_open(self, event: BetsOpen, raw: str = None):
        self.seat.bet(self.min_bet, event.game)

    def load_trained_model(self):
        """Load the trained Q-table from S3."""
        if self.aws_key and self.aws_secret_key:
            s3 = boto3.client('s3')
            obj = s3.get_object(Bucket=self.s3_bucket, Key=self.s3_key)
            data = obj['Body'].read()
            q_table = pickle.loads(data)

            return q_table

    def handle_decision_inc(self, event: DecisionInc, raw: str = None):
        if not self.seat == event.seat:
            return

        # Extract necessary values from the event
        dealer_upcard = int(event.dealer_score) if event.dealer_score else 0
        player_score = int(event.score)
        is_soft = self.handle_card(event)  # Check if the hand is soft (contains an Ace)

        # Create state tuple for Q-table lookup
        state = (player_score, is_soft, dealer_upcard)

        # Get action from Q-table with fallback to zeros if state isn't found
        action = np.argmax(self.q_table.get(state, np.zeros(3)))

        # Map action index to decision string
        decisions = {
            0: "Hit",
            1: "Stand",
            2: "Double down" if event.can_double else "Hit"
        }
        decision = decisions[action]

        # Handle splits if applicable
        if event.can_split and player_score in [4, 6, 8, 12, 14, 16, 18]:  # Pairs that might be split
            decision = "Split"

        # Send the decision to handle_decision
        self.handle_decision(
            Decision(
                seat=event.seat, game=event.game,
                code=0, action="playerCall",
                hand=event.hand, decision=decision
            )
        )

    def handle_card(self, event: Card, raw: str = None):
        """Check if the hand contains an Ace."""
        if self.seat == event.seat:
            return 'A' in event.sc.upper()  # Returns True if card contains 'A'

    def handle_decision(self, event: Decision, raw: str = None):
        """Send the decision to the game server via websocket."""
        print(f"Decision made: {event.decision}")

        data = {
        "event": "decision",
        "data": {
            "seat": event.seat,
            "game": event.game,
            "action": event.action,  # Changed from "playerCall"
            "hand": event.hand,
            "decision": event.decision
        }
    }
        asyncio.create_task(self.websocket.send_json(data))