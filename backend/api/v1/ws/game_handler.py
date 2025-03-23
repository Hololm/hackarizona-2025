import asyncio
import numpy as np
import boto3
import pickle
import os
from dotenv import load_dotenv
from pragmatic_blackjack import HandlerBase, BetsOpen, Subscribe, DecisionInc
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

        self.q_table = self.load_trained_model()


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
        if not os.getenv('AWS_ACCESS_KEY_ID') or not os.getenv('AWS_SECRET_ACCESS_KEY'):
            raise ValueError("AWS credentials not found.")

        s3 = boto3.client('s3')
        obj = s3.get_object(Bucket=os.getenv('S3_BUCKET'), Key=os.getenv('S3_KEY'))
        data = obj['Body'].read()
        return pickle.loads(data)

    def handle_decision_inc(self, event: DecisionInc, raw: str = None):
        if not self.seat == event.seat:
            return

        dealer_upcard = event.dealer_score
        player_score = event.score

        state = (player_score, dealer_upcard, int(event.can_split))

        # Get action with fallback
        action_values = self.q_table.get(state, np.zeros(4))  # Standard 4 actions
        action = np.argmax(action_values)

        # Standard Blackjack action space
        decision_map = {
            0: self.seat.hit,
            1: self.seat.stand,
            2: self.seat.double if event.can_double else self.seat.hit,
        }

        decision_map[action]()