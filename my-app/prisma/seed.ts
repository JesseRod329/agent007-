import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing agents
  await prisma.agent.deleteMany({});
  console.log('Cleared existing agents');

  // Create example agents for each provider
  const agents = await prisma.agent.createMany({
    data: [
      {
        name: 'Llama 3 Assistant',
        description: 'Fast local Llama 3 model via Ollama',
        provider: 'ollama',
        model: 'llama3',
        emoji: '🦙',
        workspace: 'local',
        status: 'active',
      },
      {
        name: 'GPT-4 Strategist',
        description: 'OpenAI GPT-4 for complex reasoning',
        provider: 'openai',
        model: 'gpt-4',
        emoji: '🧠',
        workspace: 'cloud',
        status: 'active',
      },
      {
        name: 'Gemini Analyst',
        description: 'Google Gemini Pro for analysis',
        provider: 'gemini',
        model: 'gemini-pro',
        emoji: '✨',
        workspace: 'cloud',
        status: 'active',
      },
      {
        name: 'Code Helper',
        description: 'Local coding assistant via Ollama',
        provider: 'ollama',
        model: 'codellama',
        emoji: '💻',
        workspace: 'local',
        status: 'active',
      },
      {
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient OpenAI model',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        emoji: '⚡',
        workspace: 'cloud',
        status: 'active',
      },
    ],
  });

  console.log(`✅ Created ${agents.count} agents`);

  // Verify agents were created
  const allAgents = await prisma.agent.findMany();
  console.log('\n📋 Seeded agents:');
  allAgents.forEach(agent => {
    console.log(`  ${agent.emoji} ${agent.name} (${agent.provider}/${agent.model})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
