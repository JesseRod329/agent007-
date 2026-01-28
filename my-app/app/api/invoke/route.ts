import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ProviderFactory } from '@/lib/agents/provider-factory';

// Declare global WebSocket broadcast function
declare global {
  var wsBroadcast: ((data: any) => void) | undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, message, conversationId } = body;

    // Validate required fields
    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: agentId, message' },
        { status: 400 }
      );
    }

    // Fetch agent from database
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Create or get conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          title: message.substring(0, 50),
        },
      });
    }

    // Store user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
        type: 'message',
      },
    });

    // Create provider instance
    const config = agent.config ? JSON.parse(agent.config) : {};
    const provider = ProviderFactory.createProvider({
      id: agent.id,
      name: agent.name,
      provider: agent.provider as any,
      model: agent.model,
      ...config,
    });

    // Invoke agent
    let response = '';

    try {
      // Use streaming for real-time updates
      await provider.streamInvoke(message, (chunk) => {
        response += chunk;

        // Broadcast chunk via WebSocket if available
        if (global.wsBroadcast) {
          global.wsBroadcast({
            type: 'neural-event',
            kind: 'agent-response',
            data: {
              agentId: agent.id,
              agentName: agent.name,
              chunk: chunk,
              conversationId: conversation.id,
            },
          });
        }
      });
    } catch (providerError) {
      console.error('Provider invocation error:', providerError);
      return NextResponse.json(
        {
          error: 'Agent invocation failed',
          details: providerError instanceof Error ? providerError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Store agent response
    const agentMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        agentId: agent.id,
        role: 'agent',
        content: response,
        type: 'message',
      },
    });

    // Send final response via WebSocket
    if (global.wsBroadcast) {
      global.wsBroadcast({
        type: 'neural-event',
        kind: 'agent-response-complete',
        data: {
          agentId: agent.id,
          agentName: agent.name,
          response: response,
          conversationId: conversation.id,
          messageId: agentMessage.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      response: response,
      conversationId: conversation.id,
      messageId: agentMessage.id,
    });
  } catch (error) {
    console.error('Error in invoke endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
