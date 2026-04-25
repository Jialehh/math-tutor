export type ProviderFormat = 'openai' | 'anthropic' | 'gemini';

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyPrefix?: string;
  defaultModel: string;
  format: ProviderFormat;
  requiresMaxTokens?: boolean;
  authHeader: string;
  authPrefix?: string;
}

export const providers: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyPrefix: 'sk-',
    defaultModel: 'gpt-5.2',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyPrefix: 'sk-ant-',
    defaultModel: 'claude-3-5-sonnet-20241022',
    format: 'anthropic',
    requiresMaxTokens: true,
    authHeader: 'x-api-key',
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.0-flash',
    format: 'gemini',
    authHeader: 'x-goog-api-key',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyPrefix: 'sk-',
    defaultModel: 'deepseek-chat',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'xai',
    name: 'X.AI (Grok)',
    baseUrl: 'https://api.x.ai/v1',
    apiKeyPrefix: 'xai-',
    defaultModel: 'grok-3-fast',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    apiKeyPrefix: 'sk-',
    defaultModel: 'Qwen/Qwen2.5-72B-Instruct',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    apiKeyPrefix: 'eyJhbG',
    defaultModel: 'MiniMax-01',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'stepfun',
    name: '阶跃星辰',
    baseUrl: 'https://api.stepfun.com/v1',
    apiKeyPrefix: 'sk-',
    defaultModel: 'step-2-5-128k',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'newapi',
    name: 'New API',
    baseUrl: 'https://api.newapi.com/v1',
    apiKeyPrefix: 'sk-',
    defaultModel: 'gpt-5.2',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
  {
    id: 'custom',
    name: '自定义',
    baseUrl: '',
    defaultModel: 'gpt-5.2',
    format: 'openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
  },
];

export function getProvider(id: string): Provider | undefined {
  return providers.find(p => p.id === id);
}
