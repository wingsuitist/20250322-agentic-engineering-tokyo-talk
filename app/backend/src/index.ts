import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import routes from './routes';
import fs from 'fs';
import path from 'path';

// Create the main Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Mount our routes
app.route('/', routes);

// Ensure the system prompt is copied to the dist folder during build
const copySystemPrompt = () => {
  try {
    const srcPath = path.join(__dirname, 'prompts', 'system-prompt.txt');
    const distDir = path.join(__dirname, '..', 'dist', 'prompts');
    const distPath = path.join(distDir, 'system-prompt.txt');
    
    // Create the dist/prompts directory if it doesn't exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy the system prompt file
    fs.copyFileSync(srcPath, distPath);
    console.log('System prompt copied to dist folder');
  } catch (error) {
    console.error('Error copying system prompt:', error);
  }
};

// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
console.log(`Server is starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port
});

console.log(`Server is running on http://localhost:${port}`);

// Copy the system prompt when the server starts
copySystemPrompt();
