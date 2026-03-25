# Rock Paper Scissors

A full-stack Rock Paper Scissors web game with real-time high score sync.

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + SCSS Modules
- **Backend**: NestJS + TypeScript
- **Real-time**: Socket.IO
- **Storage**: JSON file for high score persistence
- **Score tracking**: js-cookie (no login required)

## Project Structure

```
rock-paper-scissors/
├── backend/          # NestJS API server (port 3001)
└── frontend/         # Next.js app (port 3000)
```

## Features

- Play Rock, Paper, or Scissors against a bot
- Bot picks randomly via backend API call
- 2-second reveal animation (buttons disabled during reveal)
- Your score persisted in a browser cookie
- High score persisted on the server (JSON file)
- Real-time high score broadcast to all connected clients via WebSocket

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

The backend runs on `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port to run the server on |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3001` | Backend WebSocket URL |

## API Endpoints

### GET /api/game/bot-action

Returns a random bot action.

**Response:**
```json
{ "action": "ROCK" }
```

### GET /api/score/high-score

Returns the current high score.

**Response:**
```json
{ "highScore": 42 }
```

### POST /api/score/high-score

Updates the high score if the submitted score is higher. Broadcasts updated score via WebSocket.

**Request body:**
```json
{ "score": 10 }
```

**Response:**
```json
{ "updated": true, "highScore": 10 }
```

## WebSocket Events

### `highScore:updated`

Emitted to all connected clients when the high score is updated.

**Payload:**
```json
{ "highScore": 10 }
```

## Running Tests

### Backend

```bash
cd backend
npm test
npm run test:cov
```

### Frontend

```bash
cd frontend
npm test
```

## Production Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

Set the appropriate environment variables for your production environment.
