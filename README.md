
# Automate Pragmatic Blackjack

Automate playing blackjack on Pragmatic Blackjack tables using basic strategy & card counting


## Deployment

To deploy this project run

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/Hololm/hackarizona-2025.git

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
cd frontend
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

# Step 5: Get Session id and table id

# Step 6: Start the backend
uvicorn backend.main:app --reload
```## WebSocket Integration
The WebSocket connection is established using the following format:
```

### WebSocket Events
The WebSocket server sends different event messages in JSON format. Below are the possible events and their descriptions:

```javascript
const sessionId = "YOUR_SESSION_ID";
const tableId = "YOUR_TABLE_ID";
const wsUrl = `ws://127.0.0.1:8000/api/v1/ws?session_id=${sessionId}&table_id=${tableId}`;
const ws = new WebSocket(wsUrl);
```

### 1. Card-Related Events
| Event Name         | Description |
|-------------------|-------------|
| `handle_card` | A player or dealer receives a card. Includes seat number, card details, and score. |
| `handle_card_inc` | Indicates a new card is being dealt (without details). |

**Example:**
```json
{
  "event": "handle_card",
  "data": {
    "seat": 0,
    "sc": "3H4",
    "score": "18",
    "game": 7872319114,
    "result_time": "Sun Mar 23 07:15:53 UTC 2025",
    "initial": false,
    "hand": 0
  }
}
```

### 2. Player Decision Events
| Event Name         | Description |
|-------------------|-------------|
| `handle_decision_inc` | The player must make a decision (hit, stand, split, etc.). |
| `handle_decision` | A decision has been made (e.g., player stands). |

**Example:**
```json
{
  "event": "handle_decision",
  "data": {
    "seat": 0,
    "game": 7872319114,
    "code": 101,
    "action": "playerCall",
    "hand": 0,
    "decision": "Decision: Stand"
  }
}
```

### 3. Score Updates
| Event Name         | Description |
|-------------------|-------------|
| `handle_score` | Updates a player's or dealer’s hand score. |

**Example:**
```json
{
  "event": "handle_score",
  "data": {
    "seat": 0,
    "game": 7872319114,
    "hand": 0,
    "score": 18
  }
}
```

### 4. Bet & Hand Results
| Event Name         | Description |
|-------------------|-------------|
| `handle_bet_result` | Shows the result of a bet (`Win`, `Lose`, `Push`). |
| `handle_hand_result` | Indicates the result of a hand. |

**Example:**
```json
{
  "event": "handle_bet_result",
  "data": {
    "seat": 0,
    "game": 7872319114,
    "hand_result": "Push"
  }
}
```

### 5. Table Events
| Event Name         | Description |
|-------------------|-------------|
| `handle_table_event` | Provides information about the table status (new table, open time, etc.). |

**Example:**
```json
{
  "event": "handle_table_event",
  "data": {
    "new_table": false,
    "open_time": ""
  }
}
```
