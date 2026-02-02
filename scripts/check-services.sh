#!/bin/bash

# Piel Lighthouse Resort - Service Status Checker
# This script checks the status of frontend, backend, and database services

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          PIEL LIGHTHOUSE RESORT - SERVICE STATUS             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if frontend is running
echo "🌐 Checking Frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on http://localhost:3000"
    FRONTEND_STATUS="running"
else
    echo "   ❌ Frontend is not running"
    FRONTEND_STATUS="stopped"
fi

# Check if backend health endpoint exists
echo ""
echo "🔌 Checking Backend..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend API is accessible"
    BACKEND_STATUS="running"
else
    echo "   ❌ Backend API is not accessible"
    BACKEND_STATUS="stopped"
fi

# Check if database is connected
echo ""
echo "🗄️  Checking Database..."
DB_RESPONSE=$(curl -s http://localhost:3000/api/health 2>/dev/null)
if echo "$DB_RESPONSE" | grep -q "connected"; then
    echo "   ✅ Database is connected"
    DB_STATUS="connected"
else
    echo "   ❌ Database connection status unknown"
    DB_STATUS="unknown"
fi

# Summary
echo ""
echo "─────────────────────────────────────────────────────────────"
echo "📊 Service Status Summary:"
echo "─────────────────────────────────────────────────────────────"
echo "🌐 Frontend:  ${FRONTEND_STATUS}"
echo "🔌 Backend:   ${BACKEND_STATUS}"
echo "🗄️  Database:  ${DB_STATUS}"
echo "─────────────────────────────────────────────────────────────"

# Overall status
if [ "$FRONTEND_STATUS" = "running" ] && [ "$BACKEND_STATUS" = "running" ]; then
    echo ""
    echo "🎉 All services are operational!"
    echo ""
    exit 0
else
    echo ""
    echo "⚠️  Some services are not running. Please check the logs."
    echo ""
    exit 1
fi
