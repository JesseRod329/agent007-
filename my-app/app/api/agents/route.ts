import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend expectations
    const transformedAgents = agents.map(agent => ({
      id: agent.id,
      identityName: agent.name,
      identityEmoji: agent.emoji,
      workspace: agent.workspace,
      model: agent.model,
      provider: agent.provider,
      description: agent.description,
      status: agent.status,
    }));

    return NextResponse.json(transformedAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, provider, model, emoji, workspace, config } = body;

    // Validate required fields
    if (!name || !provider || !model) {
      return NextResponse.json(
        { error: 'Missing required fields: name, provider, model' },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        provider,
        model,
        emoji: emoji || '🤖',
        workspace: workspace || 'default',
        config: config ? JSON.stringify(config) : null,
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
