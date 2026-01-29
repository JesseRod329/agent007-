# Quick Start Guide

Get Agent Nexus running in 3 minutes! ⚡

## Prerequisites

- Node.js 18+ installed
- Terminal/Command line access

## Option 1: Use with Ollama (Recommended - No API Keys Needed!)

### Step 1: Install Ollama
```bash
# Visit https://ollama.ai and download for your OS
# Or on macOS:
brew install ollama
```

### Step 2: Start Ollama and Pull a Model
```bash
# Terminal 1: Start Ollama server
ollama serve

# Terminal 2: Pull Llama 3
ollama pull llama3
```

### Step 3: Start Agent Nexus
```bash
cd my-app
DATABASE_URL="file:./dev.db" npm run dev
```

### Step 4: Open Your Browser
Visit: http://localhost:3001

Navigate to **Meeting Room** and start chatting with the Llama 3 Agent! 🦙

## Option 2: Use with OpenAI or Gemini

### Step 1: Get API Keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://makersuite.google.com/app/apikey

### Step 2: Configure Environment
```bash
cd my-app

# Edit .env.local and add your keys:
# OPENAI_API_KEY="sk-your-key-here"
# GOOGLE_API_KEY="your-gemini-key-here"
```

### Step 3: Start Server
```bash
DATABASE_URL="file:./dev.db" npm run dev
```

### Step 4: Open Your Browser
Visit: http://localhost:3001

## Test the API

```bash
# List agents
curl http://localhost:3001/api/agents

# Invoke an agent (replace AGENT_ID with one from above)
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID", "message": "Hello!"}'
```

## Explore the App

1. **Landing Page** (`/`) - Overview and hero section
2. **Dashboard** (`/dashboard`) - System metrics and monitoring
3. **Meeting Room** (`/meeting`) - Chat with AI agents in real-time
4. **Agents** (`/agents`) - Manage and create new agents
5. **Settings** (`/settings`) - Configuration options

## Database Management

```bash
# View database in browser
npx prisma studio
# Opens at http://localhost:5555

# Reset database (if needed)
DATABASE_URL="file:./dev.db" npx prisma migrate reset
```

## Available Agents (Pre-seeded)

1. 🦙 **Llama 3 Assistant** - Local via Ollama
2. 🧠 **GPT-4 Strategist** - OpenAI (requires API key)
3. ✨ **Gemini Analyst** - Google (requires API key)
4. 💻 **Code Helper** - Local via Ollama
5. ⚡ **GPT-3.5 Turbo** - OpenAI (requires API key)

## Need Help?

- **Backend Documentation**: See `BACKEND_README.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Main README**: See `README.md`

## Common Issues

**Port already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

**Ollama not connecting:**
```bash
# Make sure Ollama is running
ollama serve

# Test Ollama directly
curl http://localhost:11434/api/tags
```

**Database errors:**
```bash
# Reset and reseed
DATABASE_URL="file:./dev.db" npx prisma migrate reset
```

## That's It! 🎉

You now have a fully functional AI agent collaboration platform running locally!
