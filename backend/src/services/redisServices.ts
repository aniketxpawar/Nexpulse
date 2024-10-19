import Redis from 'ioredis';

// Create a Redis instance (You can set the connection string or individual options)
const redis = new Redis({
  host: process.env.REDIS_HOST,  // replace with your Redis host
  port: Number(process.env.REDIS_PORT),         // replace with your Redis port
  password: process.env.REDIS_PASSWORD,       // optional, if your Redis requires a password
});

// Function to add a key-value pair with an expiry
export const setKeyValueWithExpiry = async (
  key: string,
  value: string,
  expiry: number // Expiry in seconds
): Promise<string> => {
  try {
    // Set the key-value pair with expiry
    const result = await redis.set(key, value, 'EX', expiry);
    return result; // 'OK' if successful
  } catch (error) {
    console.error('Error setting key-value pair in Redis:', error);
    throw error;
  }
};

export const getValueByKey = async (
    key: string,
  ): Promise<string | null> => {
    try {
      // Set the key-value pair with expiry
      const result = await redis.get(key);
      return result; // 'OK' if successful
    } catch (error) {
      console.error('Error setting key-value pair in Redis:', error);
      throw error;
    }
  };

// Example usage
// setKeyValueWithExpiry('exampleKey', 'exampleValue', 60); // Adds key with 60-second expiry

// Function to close the Redis connection (optional)
export const closeRedisConnection = (): void => {
  redis.quit();
};
