#!/bin/sh
set -e

echo "🔗 Checking database connection..."

# Wait for database to be ready (max 30 seconds)
TIMEOUT=30
ELAPSED=0
until echo "SELECT 1" | npx prisma db execute --stdin > /dev/null 2>&1 || [ $ELAPSED -ge $TIMEOUT ]; do
  echo "⏳ Waiting for database..."
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
  echo "❌ Database connection timeout!"
  exit 1
fi

echo "✅ Database is ready"

echo "🔄 Running database migrations..."
if npx prisma migrate deploy; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migration failed!"
  exit 1
fi

echo "🚀 Starting application..."
exec "$@"
