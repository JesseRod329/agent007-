import OpenAI from 'openai';
import { AgentProvider } from '../types';

export class OpenAIProvider implements AgentProvider {
  private client: OpenAI;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.model = model;
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async invoke(prompt: string, config?: any): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        ...config,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI provider error:', error);
      throw new Error(`Failed to invoke OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamInvoke(prompt: string, onChunk: (chunk: string) => void, config?: any): Promise<void> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
        ...config,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error('OpenAI stream error:', error);
      throw new Error(`Failed to stream from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
