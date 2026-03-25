#!/bin/bash
set -e

echo "🚀 Deploying Rock Paper Scissors to Kubernetes..."

# Build Docker images
echo "📦 Building Docker images..."
docker build -t rock-paper-scissors-backend:latest ./backend
docker build -t rock-paper-scissors-frontend:latest ./frontend

# Apply Kubernetes manifests
echo "☸️  Applying Kubernetes manifests..."
kubectl apply -k k8s/

echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/rps-backend --timeout=120s -n rock-paper-scissors
kubectl wait --for=condition=available deployment/rps-frontend --timeout=120s -n rock-paper-scissors
kubectl wait --for=condition=available deployment/rps-nginx --timeout=60s -n rock-paper-scissors

echo "✅ Deployment complete!"
echo "🌐 Access the app at: http://rps.local"
echo "📊 Grafana: http://rps.local:3002 (admin/admin)"
echo "📈 Prometheus: http://rps.local:9090"
echo "🐰 RabbitMQ Management: http://rps.local:15672 (rps_user/rps_password)"
