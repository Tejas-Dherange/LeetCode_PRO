# Redis Rate Limiting & Queue System - Environment Variables

Add these environment variables to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost        # Use 'redis' if running in Docker
REDIS_PORT=6379
REDIS_PASSWORD=            # Optional - leave empty if no password

# Queue Configuration
QUEUE_CONCURRENCY=5        # Number of concurrent jobs the worker can process
QUEUE_JOB_TIMEOUT=60000    # Job timeout in milliseconds (60 seconds)

# Existing Judge0 Configuration (keep as is)
# JUDGE0_BATCH_SUBMISSION_ENDPOINT=...
# JUDGE0_SULU_API_KEY=...
# DATABASE_URL=...
```

## Development vs Production

### Local Development
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Docker / Production
```env
REDIS_HOST=redis
REDIS_PORT=6379
```

## Variable Descriptions

- **REDIS_HOST**: Hostname for Redis server
- **REDIS_PORT**: Port for Redis (default: 6379)
- **REDIS_PASSWORD**: Optional password for Redis authentication
- **QUEUE_CONCURRENCY**: Max simultaneous jobs processed by worker (recommended: 5-10)
- **QUEUE_JOB_TIMEOUT**: Max time a job can run before failing (milliseconds)
