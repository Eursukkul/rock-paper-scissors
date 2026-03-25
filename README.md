# Rock Paper Scissors — Full-Stack Challenge

A production-ready Rock Paper Scissors game built with Next.js 14 and NestJS, featuring real-time high score sync, load balancing, message queue, and full observability.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack & Design Decisions](#tech-stack--design-decisions)
3. [Project Structure](#project-structure)
4. [Quick Start (Docker — Recommended)](#quick-start-docker--recommended)
5. [Ubuntu 20.04 Server Setup](#ubuntu-2004-server-setup)
6. [Local Development Setup](#local-development-setup)
7. [Environment Variables](#environment-variables)
8. [Configuration Guide](#configuration-guide)
9. [API Reference](#api-reference)
10. [WebSocket Events](#websocket-events)
11. [Running Tests](#running-tests)
12. [Monitoring](#monitoring)
13. [Kubernetes Deployment](#kubernetes-deployment)
14. [Anti-Cheat Design](#anti-cheat-design)
15. [Adding New Features](#adding-new-features)

---

## Architecture Overview

```
                        ┌─────────────────────────────┐
  Browser               │         Nginx               │
  Chrome / Safari  ───► │  API Gateway + Load Balancer│  :80
                        └──────┬──────────┬───────────┘
                               │          │
                    ┌──────────▼──┐   ┌───▼───────────┐
                    │  Backend-1  │   │   Backend-2   │
                    │  NestJS     │   │   NestJS      │  :3001
                    └──────┬──────┘   └───┬───────────┘
                           │              │
                    ┌──────▼──────────────▼───┐
                    │       RabbitMQ           │  :5672
                    │  (Event Message Broker)  │
                    └──────────────────────────┘
                           │
                    ┌──────▼──────────┐
                    │   Prometheus    │  :9090
                    └──────┬──────────┘
                           │
                    ┌──────▼──────────┐
                    │    Grafana      │  :3002
                    └─────────────────┘
```

**Key design choices:**

| Concern | Solution | Why |
|---------|----------|-----|
| API Gateway | Nginx | Single entry point, TLS termination, security headers |
| Load Balancing | Nginx `least_conn` | Distributes traffic evenly across backend instances |
| Real-time sync | Socket.IO | WebSocket with automatic fallback, works behind proxies |
| Score storage | JSON file + shared Docker volume | Simple, no DB dependency, survives container restarts |
| Message bus | RabbitMQ topic exchange | Decouples services, enables future event-driven features |
| Metrics | Prometheus + Grafana | Industry standard, pre-built dashboards |
| Player score | Cookie (`rps_your_score`) | No login required, 365-day persistence |

---

## Tech Stack & Design Decisions

### Frontend — Next.js 14 (App Router)
- **No jQuery** — uses native `fetch`, React hooks, and CSS modules (see [youmightnotneedjquery.com](http://youmightnotneedjquery.com/))
- `js-cookie` for cookie management
- `socket.io-client` for real-time WebSocket
- SCSS Modules for scoped styling — no global class conflicts
- Fully responsive — tested on Desktop (1440px) and Mobile (375px)

### Backend — NestJS (Node.js)
- **Modular architecture**: each domain (`game`, `score`, `events`, `messaging`, `metrics`) is an isolated NestJS module
- **SOLID principles**: each service has a single responsibility; controllers delegate to services only
- **Dependency Injection**: NestJS IoC container — easy to swap implementations and mock in tests
- Score persistence via JSON file with atomic read/write — survives restarts without a database

### Anti-Cheat
- Bot action is **only generated server-side** — the client cannot influence the result
- High score updates are **validated server-side** — only scores greater than the current high score are accepted
- Nginx **rate limiting** (30 req/s per IP, burst 20) prevents automated spam

---

## Project Structure

```
rock-paper-scissors/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── game/               # Bot action logic
│   │   │   ├── game.controller.ts
│   │   │   ├── game.service.ts
│   │   │   └── game.module.ts
│   │   ├── score/              # High score persistence
│   │   │   ├── score.controller.ts
│   │   │   ├── score.service.ts
│   │   │   └── score.module.ts
│   │   ├── events/             # Socket.IO WebSocket gateway
│   │   │   ├── events.gateway.ts
│   │   │   └── events.module.ts
│   │   ├── messaging/          # RabbitMQ publisher
│   │   │   ├── messaging.service.ts
│   │   │   └── messaging.module.ts
│   │   ├── metrics/            # Prometheus metrics
│   │   │   ├── metrics.controller.ts  # GET /metrics
│   │   │   ├── metrics.service.ts
│   │   │   └── metrics.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Next.js 14 App Router
│   ├── src/
│   │   ├── app/                # Next.js pages
│   │   ├── components/         # UI components (ActionButtons, BotDisplay, GameBoard, ScoreBoard)
│   │   ├── hooks/              # useGame, useSocket
│   │   ├── services/           # api.ts — all fetch calls
│   │   └── types/              # Shared TypeScript types
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── nginx/
│   ├── nginx.conf              # API Gateway + Load Balancer + WebSocket proxy
│   └── nginx-base.conf         # Rate limiting zones + gzip
│
├── monitoring/
│   ├── prometheus/prometheus.yml
│   └── grafana/
│       ├── provisioning/       # Auto-provisioned datasource + dashboard
│       └── dashboards/         # rps-dashboard.json
│
├── k8s/                        # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── rabbitmq.yaml
│   ├── backend.yaml            # Deployment + HPA (2–5 replicas)
│   ├── frontend.yaml
│   ├── nginx.yaml              # LoadBalancer Service + Ingress
│   ├── monitoring.yaml
│   ├── kustomization.yaml
│   └── deploy.sh
│
├── api-tests/                  # Jest API integration tests
│   ├── game.test.ts
│   ├── score.test.ts
│   └── health.test.ts
│
├── e2e/                        # Playwright end-to-end tests
│   ├── playwright.config.ts    # Chrome, iPhone 13, Pixel 5
│   └── tests/
│       ├── game.spec.ts
│       └── api-integration.spec.ts
│
├── docker-compose.yml          # Full production stack
├── docker-compose.dev.yml      # Dev: RabbitMQ + Prometheus only
└── README.md
```

---

## Quick Start (Docker — Recommended)

> Requires: Docker Engine 20+ and Docker Compose v2+

```bash
# 1. Clone the repository
git clone <repo-url>
cd rock-paper-scissors

# 2. Start the full stack
docker compose up --build

# 3. Open the app
open http://localhost
```

All services start automatically. No manual configuration needed.

| Service | URL | Credentials |
|---------|-----|-------------|
| Game | http://localhost | — |
| Grafana | http://localhost:3002 | admin / admin |
| Prometheus | http://localhost:9090 | — |
| RabbitMQ UI | http://localhost:15672 | rps_user / rps_password |

---

## Ubuntu 20.04 Server Setup

### Step 1 — Install Docker Engine

```bash
# Update package index
sudo apt-get update

# Install dependencies
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Allow current user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### Step 2 — Clone & Deploy

```bash
# Clone the repository
git clone <repo-url>
cd rock-paper-scissors

# (Optional) Customize environment — see Configuration Guide below
# cp backend/.env.example backend/.env
# nano backend/.env

# Build and start all services in the background
docker compose up --build -d

# Verify all containers are running
docker compose ps
```

Expected output:
```
NAME              STATUS          PORTS
rps-nginx         running         0.0.0.0:80->80/tcp
rps-frontend      running
rps-backend-1     running
rps-backend-2     running
rps-rabbitmq      running (healthy)
rps-prometheus    running         0.0.0.0:9090->9090/tcp
rps-grafana       running         0.0.0.0:3002->3000/tcp
```

### Step 3 — Open Firewall Ports (if needed)

```bash
sudo ufw allow 80/tcp      # Game
sudo ufw allow 3002/tcp    # Grafana (optional)
sudo ufw allow 9090/tcp    # Prometheus (optional)
sudo ufw reload
```

### Step 4 — Verify the Deployment

```bash
# Check the game is responding
curl http://localhost/api/game/bot-action

# Check high score endpoint
curl http://localhost/api/score/high-score

# Check backend metrics
curl http://localhost:9090/targets
```

### Stopping & Restarting

```bash
# Stop all services (data is preserved in Docker volumes)
docker compose down

# Stop and remove all data volumes (full reset)
docker compose down -v

# Restart a single service
docker compose restart backend-1

# View logs
docker compose logs -f backend-1
docker compose logs -f nginx
```

### Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart with zero manual steps
docker compose up --build -d
```

---

## Local Development Setup

Use this when you want hot-reload during development.

### Prerequisites

- Node.js 18+
- npm 9+
- (Optional) RabbitMQ — start with `docker compose -f docker-compose.dev.yml up -d`

### Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start with hot-reload
npm run start:dev
```

Backend runs at `http://localhost:3001`.

### Frontend

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install

# Start with hot-reload
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Start RabbitMQ (dev only)

```bash
# Starts only RabbitMQ and Prometheus — no Docker build required
docker compose -f docker-compose.dev.yml up -d
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port the NestJS server listens on |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin for WebSocket |
| `RABBITMQ_URL` | `amqp://rps_user:rps_password@localhost:5672/rps_vhost` | RabbitMQ connection string |
| `INSTANCE_ID` | `backend-1` | Identifier tag for Prometheus metrics |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend REST API base URL |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3001` | Backend WebSocket URL |

> In Docker, these are set automatically via `docker-compose.yml`. You do not need to create `.env` files for Docker deployments.

---

## Configuration Guide

### Change the Port

Edit `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8080:80"   # Change 8080 to any free port
```

### Scale Backend Instances

```bash
# Add a third backend instance on the fly
docker compose up --scale backend=3 -d
```

Or edit `docker-compose.yml` to add `backend-3` following the same pattern as `backend-1`.

### Change RabbitMQ Credentials

1. Update `docker-compose.yml` under `rabbitmq.environment`:
   ```yaml
   RABBITMQ_DEFAULT_USER: your_user
   RABBITMQ_DEFAULT_PASS: your_password
   ```
2. Update the `RABBITMQ_URL` for both backend services to match.

### Change Nginx Rate Limit

Edit `nginx/nginx-base.conf`:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
#                                                    ^^^^
#                              Change this value (e.g. 10r/s for stricter limiting)
```

Then restart Nginx: `docker compose restart nginx`

### Change Grafana Password

Edit `docker-compose.yml`:
```yaml
grafana:
  environment:
    GF_SECURITY_ADMIN_PASSWORD: your_new_password
```

---

## API Reference

All API endpoints are available at `http://localhost/api/` (via Nginx gateway) or `http://localhost:3001/api/` (direct to backend in dev).

### `GET /api/game/bot-action`

Returns a random bot action generated server-side.

**Response:**
```json
{ "action": "ROCK" }
```

Possible values: `ROCK`, `PAPER`, `SCISSORS`

---

### `GET /api/score/high-score`

Returns the current server-side high score.

**Response:**
```json
{ "highScore": 42 }
```

---

### `POST /api/score/high-score`

Submits a new score. Updates the high score only if it is strictly greater than the current value. Broadcasts the new value to all connected clients via WebSocket.

**Request body:**
```json
{ "score": 10 }
```

**Response (new record):**
```json
{ "updated": true, "highScore": 10 }
```

**Response (no change):**
```json
{ "updated": false, "highScore": 42 }
```

---

### `GET /metrics`

Prometheus-format metrics endpoint (available on backend port directly).

---

## WebSocket Events

Connect to `NEXT_PUBLIC_WS_URL` using Socket.IO client.

### `highScore:updated` (server → client)

Emitted to **all connected clients** whenever the high score is updated.

```json
{ "highScore": 15 }
```

The frontend listens to this event in `useSocket.ts` and updates the displayed high score in real time — no page refresh required.

---

## Running Tests

### Backend Unit Tests

```bash
cd backend
npm test                  # Run all unit tests
npm run test:cov          # Run with coverage report
```

Test files are co-located with source files (`*.spec.ts`). Covered modules:
- `GameService` — bot action randomness and result logic
- `ScoreService` — high score update logic (with `MessagingService` mocked)

### API Integration Tests

> Requires the backend to be running at `http://localhost:3001` (or set `API_URL` env var).

```bash
cd api-tests
npm install
npm test
```

Tests cover:
- `GET /api/game/bot-action` — valid response, correct content-type, randomness
- `GET /api/score/high-score` — reads current score
- `POST /api/score/high-score` — updates only when higher
- Latency under 500ms, concurrent request handling

### End-to-End Tests (Playwright)

> Requires the full stack to be running at `http://localhost`.

```bash
cd e2e
npm install
npx playwright install    # Install browsers (first time only)
npm test                  # Run on Desktop Chrome, iPhone 13, Pixel 5
```

Tests cover:
- UI rendering and score display
- Button disable/enable cycle during animation
- Bot action reveal and result display
- Score reset
- Mobile responsiveness
- Cookie persistence across page loads
- API integration via Playwright request context

---

## Monitoring

### Prometheus Metrics (exposed by backend)

| Metric | Type | Description |
|--------|------|-------------|
| `rps_bot_actions_total` | Counter | Bot actions by choice (ROCK/PAPER/SCISSORS) |
| `rps_high_score` | Gauge | Current server high score |
| `rps_http_request_duration_seconds` | Histogram | HTTP request latency by route |

### Grafana Dashboard

The dashboard is auto-provisioned at startup. Open http://localhost:3002 (admin / admin) to view:
- High Score stat panel
- Bot action distribution over time
- HTTP p95 latency
- Per-instance memory usage

---

## Kubernetes Deployment

> Requires: `kubectl` configured, `docker` for image builds.

```bash
# Build images and deploy to cluster
chmod +x k8s/deploy.sh
./k8s/deploy.sh

# Or apply manually
kubectl apply -k k8s/

# Check status
kubectl get pods -n rock-paper-scissors
kubectl get svc -n rock-paper-scissors
```

The backend Deployment has a **HorizontalPodAutoscaler** configured (2–5 replicas, 70% CPU target). Kubernetes will scale automatically under load.

Access the app via the Nginx LoadBalancer service IP, or add `rps.local` to `/etc/hosts` for local Ingress.

---

## Anti-Cheat Design

The system is designed to prevent score manipulation:

1. **Server-side bot action** — `GET /api/game/bot-action` generates the bot's choice on the backend using `Math.random()`. The client has no input into this decision.

2. **Server-side score validation** — `POST /api/score/high-score` only accepts a new high score if `newScore > currentHighScore`. Sending an arbitrary large number will only work once per actual game win — the client must still win a round to increment its local score.

3. **Rate limiting** — Nginx limits API requests to 30 req/s per IP (burst 20). Automated scripts are throttled before they can spam the score endpoint.

4. **No client-controlled game logic** — win/loss determination can be duplicated client-side for UI purposes, but the score that matters is always derived from the client's locally tracked win count, submitted to the server for comparison only.

---

## Adding New Features

### Add a New API Endpoint

1. Create a new NestJS module (or add to an existing one):
   ```bash
   cd backend/src
   mkdir myfeature
   ```
2. Add `myfeature.module.ts`, `myfeature.controller.ts`, `myfeature.service.ts`
3. Import the module in `app.module.ts`

### Add a New Frontend Component

1. Create `frontend/src/components/MyComponent/`
2. Add `MyComponent.tsx` and `MyComponent.module.scss`
3. Import into the relevant page or parent component

### Add a New RabbitMQ Event

In `backend/src/messaging/messaging.service.ts`, call:
```typescript
await this.messagingService.publish('score.something.happened', { payload });
```

Consumers can be added as NestJS microservice listeners in a separate process.

### Add a New Prometheus Metric

In `backend/src/metrics/metrics.service.ts`, add:
```typescript
myCounter = new Counter({
  name: 'rps_my_metric_total',
  help: 'Description of my metric',
  labelNames: ['label'],
  registers: [this.registry],
});
```

It will automatically appear in the `/metrics` endpoint and Prometheus scrape.
