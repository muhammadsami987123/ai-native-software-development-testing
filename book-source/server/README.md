# Chatbot API Server

Backend API server for the AI Native Software Development chatbot.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

3. Start server:
```bash
npm run start:api
```

## API Endpoints

### POST `/api/chat/message`

Send a chat message and get an AI response.

**Request:**
```json
{
  "message": "What is spec-driven development?",
  "conversationHistory": [
    {
      "text": "Hello",
      "isBot": false
    }
  ]
}
```

**Response:**
```json
{
  "message": "Spec-driven development is...",
  "isInTone": true,
  "confidence": 0.95,
  "sources": [
    {
      "type": "project_file",
      "path": "docs/05-Spec-Driven-Development/01-introduction.md",
      "title": "Introduction to Spec-Driven Development"
    }
  ],
  "metadata": {
    "structuredQuery": {
      "intent": "question",
      "topics": ["spec-driven development"],
      "complexity": "medium"
    },
    "usedBrowserSearch": false
  }
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Chatbot API is running"
}
```

## Architecture

- **JSON Conversion Agent**: Structures user queries
- **Answer Agent**: Generates responses using Gemini API
- **Tone Tester**: Detects query relevance to project
- **Project Context Indexer**: Searches project files for context
- **Browser Search**: Handles external queries

## Environment Variables

- `GEMINI_API_KEY`: Required. Google Gemini API key
- `PORT`: Optional. Server port (default: 3001)
- `API_BASE_URL`: Optional. For CORS configuration

