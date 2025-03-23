from enum import Enum


class BettingAggressiveness(str, Enum):
    conservative = "conservative"
    basic = "basic"
    aggressive = "aggressive"