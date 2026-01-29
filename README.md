# Agent Nexus - AI Agent Collaboration Platform

A full-stack Next.js application that enables multiple AI agents from different providers (Ollama, OpenAI, Google Gemini) to connect, collaborate, and communicate in real-time.

![Agent Nexus](https://img.shields.io/badge/Agent-Nexus-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green)

## Features

### Frontend
- **Landing Page** - Hero section with animated agent network visualization
- **Dashboard** - Real-time monitoring of agent network topology, metrics, and activity
- **Meeting Room** - Interactive chat interface where multiple AI agents can converse
- **Agent Management** - Create, configure, and manage AI agents from different providers
- **Settings** - User profile, notifications, security, and API key management

### Backend (New! 🎉)
- **Multi-Provider Support** - Integrate Ollama (local), OpenAI, and Google Gemini
- **Real-time Communication** - WebSocket server for live agent responses
- **Database Persistence** - SQLite with Prisma ORM (upgradeable to PostgreSQL)
- **Streaming Responses** - Real-time token streaming from AI providers
- **RESTful API** - Full CRUD operations for agents and conversations

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

### Backend
- **Runtime**: Node.js with custom Next.js server
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **WebSocket**: ws library for real-time communication
- **AI Providers**:
  - Ollama (local OSS models)
  - OpenAI SDK (GPT-4, GPT-3.5)
  - Google Generative AI SDK (Gemini Pro)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project
cd my-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (optional - Ollama works without keys)

# Initialize database
DATABASE_URL="file:./dev.db" npx prisma migrate dev
DATABASE_URL="file:./dev.db" npx prisma db seed

# Run development server
DATABASE_URL="file:./dev.db" npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

> **Note**: The server now runs on port 3001 with WebSocket support.

### Build for Production

```bash
npm run build
DATABASE_URL="your-production-db" npm start
```

> **Production Tip**: Use PostgreSQL for production deployments.

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (NEW!)
│   │   ├── agents/        # Agent CRUD endpoints
│   │   └── invoke/        # Agent invocation endpoint
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard page
│   ├── meeting/           # Meeting room page
│   ├── agents/            # Agent management page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── agent-network.tsx # Animated network visualization
│   ├── agent-topology.tsx # Dashboard topology view
│   ├── navigation.tsx    # Site navigation
│   └── ...
├── lib/                   # Utility functions
│   ├── db/               # Database (NEW!)
│   │   └── prisma.ts     # Prisma client
│   └── agents/           # Agent providers (NEW!)
│       ├── types.ts      # TypeScript interfaces
│       ├── provider-factory.ts
│       └── providers/
│           ├── ollama.ts # Ollama integration
│           ├── openai.ts # OpenAI integration
│           └── gemini.ts # Gemini integration
├── prisma/               # Database (NEW!)
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
├── server.ts            # Custom Next.js + WebSocket server (NEW!)
├── .env.local           # Environment variables (create this)
└── public/              # Static assets
```

## Backend Setup & Configuration

See [BACKEND_README.md](./BACKEND_README.md) for comprehensive backend documentation including:
- AI provider setup (Ollama, OpenAI, Gemini)
- API endpoint reference
- WebSocket event documentation
- Database schema details
- Production deployment guide

### Quick Backend Test

```bash
# Test agents endpoint
curl http://localhost:3001/api/agents

# Test agent invocation (requires Ollama running)
curl -X POST http://localhost:3001/api/invoke \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "message": "Hello!"}'
```

## Key Features Explained

### Agent Network Visualization
- Interactive SVG-based network diagram
- Animated data packets flowing between nodes
- Real-time status indicators
- Hover tooltips with agent details

### Meeting Room
- Multi-agent chat interface with **real AI responses** 🤖
- WebSocket-based real-time communication
- Streaming responses from AI providers
- Message types: regular messages, thoughts, actions
- Participant management sidebar with live agent status

### Dashboard
- Live metrics cards with animated numbers
- Network topology visualization
- System health monitoring
- Recent activity feed
- Agent status list

### Agent Management
- Grid and list view modes
- Filter by provider (Ollama, OpenAI, Google Gemini)
- Create new agents via UI or API
- Live database-backed agent persistence
- Status management and configuration

## Customization

### Themes
The project uses CSS variables for theming. Edit `app/globals.css` to customize colors.

### Adding New Agents
Create agents via:
1. **UI**: Use the Agent Management page
2. **API**: POST to `/api/agents`
3. **Database**: Add directly via Prisma Studio (`npx prisma studio`)
4. **Seed**: Modify `prisma/seed.ts`

### Adding New AI Providers
1. Create a new provider class in `lib/agents/providers/`
2. Implement the `AgentProvider` interface
3. Update `provider-factory.ts` to include the new provider

## License

MIT License - feel free to use this for your own projects!
