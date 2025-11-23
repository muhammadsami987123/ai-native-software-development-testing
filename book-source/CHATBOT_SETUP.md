# Chatbot Integration Setup Guide

This guide explains how to set up and use the AI-powered chatbot integrated into the AI Native Software Development documentation site.

## Features

- **Contextual Answers**: The chatbot uses project files, documentation, and codebase to provide intelligent answers
- **Tone Detection**: Automatically detects if queries are related to the project or off-topic
- **Smart Search**: For out-of-tone queries, performs intelligent web search while relating back to project topics
- **Dual Agent System**:
  - **JSON Conversion Agent**: Structures queries into standardized format
  - **Answer Agent**: Generates meaningful answers using Google Gemini API

## Prerequisites

1. Node.js >= 20.0
2. Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Install Dependencies

```bash
cd book-source
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `book-source` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Start the Development Servers

#### Option A: Run Both Servers Separately

Terminal 1 - Docusaurus:
```bash
npm start
```

Terminal 2 - API Server:
```bash
npm run start:api
```

#### Option B: Run Both with Concurrently

```bash
npm run dev
```

### 4. Access the Chatbot

1. Open your browser to `http://localhost:3000`
2. Click the "Chat" button in the navbar
3. The chatbot sidebar will open on the right side

## Architecture

### Backend Structure

```
server/
├── index.js                 # Express server entry point
├── routes/
│   └── chat.js             # Chat API routes
├── services/
│   └── chatService.js      # Main chat orchestration service
├── agents/
│   ├── jsonConversionAgent.js  # Structures queries into JSON
│   ├── answerAgent.js          # Generates answers using Gemini
│   └── toneTester.js           # Detects query relevance
└── utils/
    ├── projectContextIndexer.js  # Indexes and searches project files
    └── browserSearch.js          # Handles external web search
```

### How It Works

1. **User sends message** → Frontend sends to `/api/chat/message`

2. **Project Context Indexing** → System searches project files for relevant context

3. **Tone Testing** → Determines if query is in-tone (project-related) or out-of-tone

4. **JSON Conversion** → Structures the query into standardized format

5. **Answer Generation**:
   - If in-tone: Uses project context + Gemini API
   - If out-of-tone: Performs browser search + relates back to project

6. **Response** → Returns answer with metadata (sources, tone info, etc.)

## Configuration

### API Base URL

For production deployment, set the API base URL:

**Frontend (docusaurus.config.ts or environment variable):**
```typescript
// In your build process, set:
window.__API_BASE_URL__ = 'https://your-api-domain.com';
```

**Backend (.env):**
```
API_BASE_URL=https://your-api-domain.com
```

### Project Context Indexing

The system automatically indexes:
- Documentation files (`.md`, `.mdx`)
- Source code (`.ts`, `.tsx`, `.js`)
- Configuration files (`.json`, `.yml`)
- Context and spec files

Index is cached for 5 minutes. To force refresh, restart the server.

## Troubleshooting

### Chatbot Not Responding

1. **Check API server is running:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"Chatbot API is running"}`

2. **Verify API key:**
   - Check `.env` file has `GEMINI_API_KEY` set
   - Verify the key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Check browser console:**
   - Open DevTools → Console
   - Look for CORS errors or API connection issues

### CORS Issues

If you see CORS errors, ensure:
- API server has CORS enabled (already configured in `server/index.js`)
- Both servers are running on expected ports

### Slow Responses

- First request may be slow due to project indexing
- Subsequent requests use cached index
- Consider reducing indexed file size limits in `projectContextIndexer.js`

## Advanced Configuration

### Custom Search API Integration

To use actual web search (instead of Gemini-based synthesis), uncomment and configure in `server/utils/browserSearch.js`:

```javascript
// Add to .env:
GOOGLE_SEARCH_API_KEY=your_key
GOOGLE_SEARCH_ENGINE_ID=your_engine_id
```

### Adjusting Tone Detection Sensitivity

Edit `server/agents/toneTester.js`:

```javascript
// Lower threshold = more queries considered "in-tone"
const isInTone = confidence > 0.3; // Change this value
```

### Index Cache TTL

Modify cache duration in `server/utils/projectContextIndexer.js`:

```javascript
this.cacheTTL = 5 * 60 * 1000; // 5 minutes (change as needed)
```

## Production Deployment

### Backend Deployment

Deploy the `server/` directory as a Node.js service:
- Vercel (serverless functions)
- Railway
- Heroku
- AWS Lambda
- Your own server

### Frontend Configuration

Set environment variable during build:

```bash
API_BASE_URL=https://your-api-url.com npm run build
```

Or configure in `docusaurus.config.ts` using environment variables.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for errors
3. Verify all environment variables are set correctly

---

**Note**: The chatbot uses Google Gemini API, which has usage limits. Monitor your API usage at [Google AI Studio](https://makersuite.google.com/app/apikey).

