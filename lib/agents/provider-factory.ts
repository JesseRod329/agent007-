import { AgentProvider, AgentConfig } from './types';
import { OllamaProvider } from './providers/ollama';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

export class ProviderFactory {
  static createProvider(config: AgentConfig): AgentProvider {
    switch (config.provider) {
      case 'ollama':
        return new OllamaProvider(
          config.model,
          config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
        );

      case 'openai':
        const openaiKey = config.apiKey || process.env.OPENAI_API_KEY;
        if (!openaiKey) {
          throw new Error('OpenAI API key is required');
        }
        return new OpenAIProvider(config.model, openaiKey);

      case 'gemini':
        const geminiKey = config.apiKey || process.env.GOOGLE_API_KEY;
        if (!geminiKey) {
          throw new Error('Google API key is required');
        }
        return new GeminiProvider(config.model, geminiKey);

      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }
}
