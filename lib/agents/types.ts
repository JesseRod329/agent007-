export interface AgentProvider {
  invoke(prompt: string, config?: any): Promise<string>;
  streamInvoke(prompt: string, onChunk: (chunk: string) => void, config?: any): Promise<void>;
}

export interface AgentConfig {
  id: string;
  name: string;
  provider: "ollama" | "openai" | "gemini";
  model: string;
  baseUrl?: string;
  apiKey?: string;
}

export interface AgentResponse {
  content: string;
  model: string;
  provider: string;
}
