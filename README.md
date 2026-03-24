# Rock Paper Scissors

A full-stack Rock Paper Scissors web application with real-time high score updates.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, SCSS Modules |
| Backend | NestJS, TypeScript, Socket.IO |
| Containerization | Docker, docker-compose |

## Prerequisites

- Docker ≥ 24 and Docker Compose ≥ 2
- Node.js ≥ 20 (for local development only)

---

## Deployment (Ubuntu 20 Server)

### 1. Install Docker

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone the Repository

```bash
git clone <repository-url> rock-paper-scissors
cd rock-paper-scissors
```

### 3. Configure Environment (Optional)

Copy the example env file if you need to override defaults:

```bash
cp .env.example .env
# Edit .env as needed (e.g. change CORS_ORIGIN to your domain)
```

Default values work out of the box for localhost.

### 4. Build and Start

```bash
docker compose up --build -d
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### 5. View Logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

### 6. Stop Services

```bash
docker compose down
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend
npm install
npm run start:dev   # runs on port 3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev         # runs on port 3000
```

---

## Running Tests

### Backend

```bash
cd backend
npm install
npm test              # run all tests
npm run test:cov      # with coverage report
```

### Frontend

```bash
cd frontend
npm install
npm test              # run all tests
npm run test:cov      # with coverage report
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│                                                         │
│   Next.js 14 App (port 3000)                           │
│   ┌────────────┐  ┌────────────┐  ┌─────────────────┐ │
│   │ ScoreBoard │  │ BotDisplay │  │  ActionButtons  │ │
│   └────────────┘  └────────────┘  └─────────────────┘ │
│          │               │                 │            │
│          └───────────────┴─────────────────┘            │
│                          │                              │
│                      useGame hook                       │
│                    /     |      \                       │
│              HTTP API  Cookie  WebSocket                │
└──────────────────/──────|───────\──────────────────────┘
                  /        |        \
┌────────────────/─────────|─────────\───────────────────┐
│  NestJS API (port 3001)  |   Socket.IO                 │
│                          |                              │
│  POST /api/game/play     |   Event: highScoreUpdated   │
│  POST /api/game/reset-score                             │
│  GET  /api/score/high-score                             │
│  POST /api/score/high-score                             │
│                                                         │
│  In-memory high score storage                           │
└─────────────────────────────────────────────────────────┘
```

## Game Flow

1. Player clicks Rock / Paper / Scissors
2. Frontend calls `POST /api/game/play` with the chosen action
3. Backend picks a random bot action, computes win/lose/draw, updates cookie score
4. Frontend reveals the bot action for **2 seconds** (buttons disabled)
5. After 2 seconds:
   - If player won → score increments
   - If new score beats high score → `POST /api/score/high-score` updates server
   - Backend broadcasts `highScoreUpdated` via WebSocket to **all** connected clients
6. Bot display resets to "???"

## Configuration Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend listen port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Backend REST URL (build-time) |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3001` | Backend WebSocket URL (build-time) |
