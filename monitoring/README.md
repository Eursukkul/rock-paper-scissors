# Service Monitoring

## Stack
- **Prometheus** - Metrics collection (port 9090)
- **Grafana** - Visualization dashboard (port 3002)

## Access
| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://localhost:3002 | admin / admin |
| Prometheus | http://localhost:9090 | - |
| RabbitMQ | http://localhost:15672 | rps_user / rps_password |

## Metrics Exposed (Backend `/metrics`)
| Metric | Type | Description |
|--------|------|-------------|
| `rps_bot_actions_total` | Counter | Bot actions per action type |
| `rps_high_score` | Gauge | Current high score value |
| `rps_http_request_duration_seconds` | Histogram | HTTP request latency |

## Dashboard
The Grafana dashboard is auto-provisioned and shows:
- Current High Score
- Bot action distribution over time
- HTTP request duration (p95)
- Memory usage per backend instance
