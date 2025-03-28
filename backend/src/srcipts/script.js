const fs  = require('fs');
const path = require('path');
const Redis = require('ioredis');

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Function to execute Redis commands
const executeCommands = async (filePath) => {
  try {
    // Read commands from the file
    const commands = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

    for (const command of commands) {
      // Split the command into arguments
      const args = command.split(/\s+/).map(arg => arg.replace(/"/g, ''));
      let [operation, ...params] = args;
      params = params.filter(item => item != '')
// console.log(operation,params)
      // Execute the command in Redis
      console.log(`Executing: ${operation} ${params.join(' ')}`);
      if(operation) await redis[operation.toLowerCase()](...params);
    }

    console.log('All commands executed successfully!');
  } catch (error) {
    console.error('Error executing commands:', error);
  } finally {
    // Close the Redis connection
    redis.disconnect();
  }
};

// File path to the commands file
const tagsFilePath = path.join(__dirname, 'tags.txt');
const specialistFilePath = path.join(__dirname, 'specialist_tag_mapping.txt');

// Execute the script
executeCommands(tagsFilePath);
executeCommands(specialistFilePath);
