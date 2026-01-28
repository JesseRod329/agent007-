# Agent Nexus Backend

This document describes the backend implementation for Agent Nexus, which provides API endpoints and WebSocket connections for multi-agent AI collaboration.

## Architecture

- **Next.js 16** with App Router
- **Prisma ORM** with SQLite database (easily upgradeable to PostgreSQL)
- **Custom Node.js Server** with WebSocket support
- **Three AI Provider Integrations**: Ollama (local), OpenAI, Google Gemini

## Features

✅ Real-time agent responses via WebSocket
✅ Multiple AI provider support (Ollama, OpenAI, Gemini)
✅ Database persistence for agents, conversations, and messages
✅ Streaming responses for better UX
✅ RESTful API endpoints
✅ Type-safe with TypeScript

## Quick Start

### 1. Install Dependencies

Already done! Dependencies are installed via:
```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and add your API keys:

```bash
# Database
DATABASE_URL="file:./dev.db"

# OpenAI (optional - only needed if using OpenAI models)
OPENAI_API_KEY="sk-your-key-here"

# Google Gemini (optional - only needed if using Gemini models)
GOOGLE_API_KEY="your-gemini-key-here"

# Ollama (local - default configuration)
OLLAMA_BASE_URL="http://localhost:11434"
```

### 3. Set Up Database

Database is already initialized! If you need to reset:

```bash
DATABASE_URL="file:./dev.db" npx prisma migrate dev
DATABASE_URL="file:./dev.db" npx prisma db seed
```

### 4. Start the Server

```bash
DATABASE_URL="file:./dev.db" npm run dev
```

Server will start on:
- **HTTP**: http://localhost:3001
- **WebSocket**: ws://localhost:3001

## API Endpoints

### GET /api/agents

List all active agents.

**Response:**
```json
[
  {
    "id": "uuid",
    "identityName": "Llama 3 Assistant",
    "identityEmoji": "🦙",
    "workspace": "local",
    "model": "llama3",
    "provider": "ollama",
    "description": "Fast local Llama 3 model via Ollama",
    "status": "active"
  }
]
```

### POST /api/agents

Create a new agent.

**Request:**
```json
{
  "name": "My Agent",
  "description": "Custom agent description",
  "provider": "ollama",
  "model": "llama3",
  "emoji": "🤖",
  "workspace": "default"
}
```

### POST /api/invoke

Invoke an agent with a message.

**Request:**
```json
{
  "agentId": "uuid",
  "message": "Hello, how can you help me?",
  "conversationId": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Agent response text...",
  "conversationId": "uuid",
  "messageId": "uuid"
}
```

## WebSocket Events

Connect to `ws://localhost:3001` to receive real-time updates.

### Connection Event
```json
{
  "type": "connection",
  "status": "connected",
  "timestamp": "2024-01-28T..."
}
```

### Agent Response Streaming
```json
{
  "type": "neural-event",
  "kind": "agent-response",
  "data": {
    "agentId": "uuid",
    "agentName": "Agent Name",
    "chunk": "Response chunk...",
    "conversationId": "uuid"
  }
}
```

### Agent Response Complete
```json
{
  "type": "neural-event",
  "kind": "agent-response-complete",
  "data": {
    "agentId": "uuid",
    "agentName": "Agent Name",
    "response": "Complete response text",
    "conversationId": "uuid",
    "messageId": "uuid"
  }
}
```

## AI Provider Setup

### Ollama (Local)

1. Install Ollama: https://ollama.ai
2. Start Ollama server:
   ```bash
   ollama serve
   ```
3. Pull models:
   ```bash
   ollama pull llama3
   ollama pull codellama
   ```

### OpenAI

1. Get API key from: https://platform.openai.com/api-keys
2. Add to `.env.local`:
   ```
   OPENAI_API_KEY="sk-your-key-here"
   ```

### Google Gemini

1. Get API key from: https://makersuite.google.com/app/apikey
2. Add to `.env.local`:
   ```
   GOOGLE_API_KEY="your-gemini-key-here"
   ```

## Database Schema

### Agent
- `id`: UUID primary key
- `name`: Agent display name
- `description`: Optional description
- `provider`: "ollama" | "openai" | "gemini"
- `model`: Model name (e.g., "llama3", "gpt-4")
- `emoji`: Display emoji
- `workspace`: Workspace identifier
- `status`: "active" | "paused" | "error"
- `config`: JSON string for provider-specific config

### Conversation
- `id`: UUID primary key
- `title`: Optional conversation title

### Message
- `id`: UUID primary key
- `conversationId`: Foreign key to Conversation
- `agentId`: Foreign key to Agent (nullable)
- `role`: "user" | "agent"
- `content`: Message text
- `type`: "message" | "thought" | "action"

## Database Management

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
DATABASE_URL="file:./dev.db" npx prisma migrate reset
```

### Create Migration
```bash
DATABASE_URL="file:./dev.db" npx prisma migrate dev --name migration_name
```

## Development

### Project Structure
```
my-app/
├── app/
│   ├── api/
│   │   ├── agents/route.ts    # Agents CRUD
│   │   └── invoke/route.ts    # Agent invocation
│   └── [pages]                # Frontend pages
├── lib/
│   ├── db/
│   │   └── prisma.ts          # Prisma client singleton
│   └── agents/
│       ├── types.ts           # TypeScript interfaces
│       ├── provider-factory.ts # Provider factory
│       └── providers/
│           ├── ollama.ts      # Ollama integration
│           ├── openai.ts      # OpenAI integration
│           └── gemini.ts      # Gemini integration
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── server.ts                  # Custom Next.js server with WebSocket
└── .env.local                 # Environment variables (not committed)
```

## Testing

### Test Agents Endpoint
```bash
curl http://localhost:3001/api/agents
```

### Test Invoke Endpoint (example with local Ollama)
```bash
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "your-agent-id",
    "message": "What is the meaning of life?"
  }'
```

### Test WebSocket
```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

## Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
DATABASE_URL="your-production-db-url" npm start
```

### PostgreSQL Migration (Recommended for Production)

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Set PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### Port 3001 Already in Use
```bash
lsof -i :3001
kill -9 <PID>
```

### Prisma Client Not Generated
```bash
DATABASE_URL="file:./dev.db" npx prisma generate
```

### WebSocket Not Connecting
- Ensure custom server is running (not `next dev`)
- Check that `npm run dev` uses `tsx server.ts`
- Verify no firewall blocking port 3001

### Agent Not Responding
- **Ollama**: Ensure `ollama serve` is running and model is pulled
- **OpenAI**: Verify API key is valid and has credits
- **Gemini**: Verify API key is valid

## Support

For issues or questions, check:
- Frontend integration: `/app/meeting/page.tsx`
- Provider implementations: `/lib/agents/providers/`
- Database schema: `/prisma/schema.prisma`
