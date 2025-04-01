import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import routes from '../src/routes';
import * as openrouter from '../src/openrouter';

// Mock the generateMermaidDiagram function
vi.mock('../src/openrouter', () => ({
  generateMermaidDiagram: vi.fn()
}));

describe('Backend API', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.route('/', routes);
    vi.resetAllMocks();
  });

  describe('GET /health', () => {
    it('should return a 200 status and ok message', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data).toEqual({ status: 'ok' });
    });
  });

  describe('POST /generate', () => {
    it('should return a 400 error if prompt is missing', async () => {
      const res = await app.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      expect(res.status).toBe(400);
      
      const data = await res.json();
      expect(data.error).toContain('Invalid request');
    });

    it('should return a 400 error if prompt is not a string', async () => {
      const res = await app.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: 123 })
      });
      
      expect(res.status).toBe(400);
      
      const data = await res.json();
      expect(data.error).toContain('Invalid request');
    });

    it('should return generated diagram on success', async () => {
      const mockDiagram = 'graph TD; A-->B;';
      vi.mocked(openrouter.generateMermaidDiagram).mockResolvedValue(mockDiagram);
      
      const res = await app.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: 'Create a simple flowchart' })
      });
      
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.diagram).toBe(mockDiagram);
      expect(openrouter.generateMermaidDiagram).toHaveBeenCalledWith('Create a simple flowchart');
    });

    it('should handle errors from the diagram generation', async () => {
      vi.mocked(openrouter.generateMermaidDiagram).mockRejectedValue(new Error('API error'));
      
      const res = await app.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: 'Create a simple flowchart' })
      });
      
      expect(res.status).toBe(500);
      
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('API error');
    });
  });
});
