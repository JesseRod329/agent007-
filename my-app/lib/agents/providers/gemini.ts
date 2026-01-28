import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentProvider } from '../types';

export class GeminiProvider implements AgentProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.model = model;
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async invoke(prompt: string, config?: any): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...config,
      });

      const response = result.response;
      return response.text() || '';
    } catch (error) {
      console.error('Gemini provider error:', error);
      throw new Error(`Failed to invoke Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamInvoke(prompt: string, onChunk: (chunk: string) => void, config?: any): Promise<void> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...config,
      });

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          onChunk(text);
        }
      }
    } catch (error) {
      console.error('Gemini stream error:', error);
      throw new Error(`Failed to stream from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
