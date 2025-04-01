# Mermaid Diagram Generator

Web application that generates mermaid diagrams from user prompts using AI.

## Architecture

- **Frontend**: Alpine.js with TypeScript
- **Backend**: Hono REST API
- **AI Model**: google/gemini-2.0-flash-001 via OpenRouter API
- **Testing**: Vitest

## Features

- Input field for user prompts
- Generate button to create diagrams
- Rendered mermaid diagram display
- Copy-pasteable mermaid syntax code

## Technical Requirements

### Frontend

- Single page application using Alpine.js with TypeScript
- Components:
  - Text input for user prompt
  - Generation button
  - Mermaid diagram rendering area
  - Code snippet display with copy functionality
- Error handling with console logging of backend responses

### Backend

- Hono-based REST API with Node.js
- Endpoints:
  - POST `/generate` - Accepts prompt, returns mermaid syntax
  - GET `/health` - Health check endpoint
- OpenRouter API integration using environment variable `$LAB_OPENROUTER_TOKEN`
- System prompt to guide model in generating well-formatted, colored mermaid diagrams
- Error handling for invalid requests and API failures
- Automatic copying of system prompt to dist folder during build

### System Prompt

- Must instruct model to generate only valid mermaid syntax
- Should encourage use of colors and full mermaid functionality
- Needs to be available in the `dist/` folder

## Development

1. Setup frontend and backend
2. Implement API communication
3. Create system prompt
4. Add error handling
5. Implement tests with Vitest

## Project Structure

```
/
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── app.ts
│   │   └── styles.css
│   ├── dist/
│   ├── e2e/ # only end to end for frontend
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── openrouter.ts
│   │   └── prompts/
│   │       └── system-prompt.txt
│   ├── tests/
│   │   └── backend.test.ts
│   └── package.json
└── README.md
```

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev  # Starts development server with hot reload
npm run build  # Builds for production
npm run start  # Runs production build
npm test  # Runs tests
```

### Testing the Backend API

You can test the backend API using curl commands:

```bash
# Test health endpoint
curl -X GET http://localhost:3001/health

# Test generate endpoint
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a simple flowchart showing a login process"}'
```

The generate endpoint returns a JSON response with the following structure:

```json
{
  "diagram": "mermaid diagram syntax here",
  "success": true
}
```

In case of an error, it returns:

```json
{
  "error": "Error message",
  "success": false
}
```
