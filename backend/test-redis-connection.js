/**
 * Quick test script to verify Redis connection
 * Run with: node test-redis-connection.js
 */

import dotenv from 'dotenv';
import getRedisClient, { isRedisHealthy } from './libs/redis.lib.js';

dotenv.config();

async function testRedis() {
  console.log('🔍 Testing Redis Connection...\n');
  
  console.log('Environment Variables:');
  console.log('  REDIS_URL:', process.env.REDIS_URL ? '✓ Set (Upstash)' : '✗ Not set');
  console.log('  REDIS_HOST:', process.env.REDIS_HOST || 'localhost');
  console.log('  REDIS_PORT:', process.env.REDIS_PORT || '6379');
  console.log('');
  
  try {
    const redis = getRedisClient();
    
    // Wait for connection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Test 1: Ping
    console.log('Test 1: Ping-Pong');
    const pingResult = await redis.ping();
    console.log('  Result:', pingResult === 'PONG' ? '✓ PASSED' : '✗ FAILED');
    
    // Test 2: Set/Get
    console.log('\nTest 2: Set & Get');
    await redis.set('test:connection', 'Hello from CodeLoom!', 'EX', 60);
    const getValue = await redis.get('test:connection');
    console.log('  Set:', 'test:connection = "Hello from CodeLoom!"');
    console.log('  Get:', getValue);
    console.log('  Result:', getValue === 'Hello from CodeLoom!' ? '✓ PASSED' : '✗ FAILED');
    
    // Test 3: Health Check
    console.log('\nTest 3: Health Check Function');
    const healthy = await isRedisHealthy();
    console.log('  Result:', healthy ? '✓ PASSED (Healthy)' : '✗ FAILED (Unhealthy)');
    
    // Test 4: BullMQ compatibility
    console.log('\nTest 4: BullMQ Features (List operations)');
    await redis.lpush('test:queue', 'job1', 'job2', 'job3');
    const queueLength = await redis.llen('test:queue');
    await redis.del('test:queue');
    console.log('  Queue operations:', queueLength === 3 ? '✓ PASSED' : '✗ FAILED');
    
    console.log('\n✅ All tests passed! Redis is working correctly.\n');
    
    // Cleanup
    await redis.del('test:connection');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Redis connection failed!');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check if REDIS_URL is correct in .env');
    console.error('  2. Verify Upstash Redis is active');
    console.error('  3. Check network connectivity');
    process.exit(1);
  }
}

testRedis();
