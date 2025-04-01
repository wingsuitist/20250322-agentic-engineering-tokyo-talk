import { Hono } from 'hono';
import { generateMermaidDiagram } from './openrouter';

// Create a new Hono app for our routes
const routes = new Hono();

// POST endpoint to generate mermaid diagrams
routes.post('/generate', async (c) => {
  try {
    // Parse the request body
    const body = await c.req.json();
    
    // Validate the request
    if (!body.prompt || typeof body.prompt !== 'string') {
      return c.json({ error: 'Invalid request. "prompt" field is required and must be a string.' }, 400);
    }
    
    // Generate the mermaid diagram
    const mermaidDiagram = await generateMermaidDiagram(body.prompt);
    
    // Return the generated diagram
    return c.json({ 
      diagram: mermaidDiagram,
      success: true
    });
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    return c.json({ 
      error: (error as Error).message || 'An unexpected error occurred',
      success: false
    }, 500);
  }
});

// Health check endpoint
routes.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

export default routes;
