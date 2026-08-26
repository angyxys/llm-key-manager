import { ProviderInfo } from '../types';

export const providers: ProviderInfo[] = [
  {
    name: 'OpenAI',
    displayName: 'OpenAI',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'Anthropic',
    displayName: 'Anthropic',
    docsUrl: 'https://console.anthropic.com/account/keys',
  },
  {
    name: 'Google',
    displayName: 'Google Gemini',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/api-key',
  },
  {
    name: 'DeepSeek',
    displayName: 'DeepSeek',
    docsUrl: 'https://platform.deepseek.com/api_keys',
  },
];

export const useProviders = () => {
  return { providers };
};
