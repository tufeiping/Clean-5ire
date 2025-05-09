import { IServiceProvider } from './types';

export default {
  name: 'Anthropic',
  apiBase: 'https://api.anthropic.com/v1',
  currency: 'USD',
  options: {
    apiBaseCustomizable: true,
    apiKeyCustomizable: true,
  },
  chat: {
    apiSchema: ['base', 'key', 'model'],
    topP: { min: 0, max: 1, default: null },
    temperature: { min: 0, max: 1, default: 1.0 },
    options: {
      modelCustomizable: true,
    },
    models: {
      'claude-3-7-sonnet-20250219': {
        label: 'claude-3.7-sonnet-latest',
        contextWindow: 200000,
        maxTokens: 8192,
        defaultMaxTokens: 8000,
        inputPrice: 0.003,
        outputPrice: 0.015,
        toolEnabled: true,
        vision: {
          enabled: true,
          allowBase64: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
          ],
        },
        description: `Highest level of intelligence and capability with toggleable extended thinking`,
        group: 'Claude-Sonnet',
      },
      'claude-3-5-sonnet-20241022': {
        label: 'claude-3.5-sonnet-latest',
        contextWindow: 200000,
        maxTokens: 8192,
        defaultMaxTokens: 8000,
        inputPrice: 0.003,
        outputPrice: 0.015,
        toolEnabled: true,
        vision: {
          enabled: true,
          allowBase64: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
          ],
        },
        description: `High level of intelligence and capability`,
      },
      'claude-3-5-haiku-20241022': {
        label: 'claude-3.5-haiku',
        contextWindow: 200000,
        maxTokens: 8192,
        defaultMaxTokens: 8000,
        inputPrice: 0.001,
        outputPrice: 0.005,
        description: `The fastest model of Anthropic, Intelligence at blazing speeds`,
        toolEnabled: true,
      },
      'claude-3-opus-20240229': {
        label: 'claude-3-opus',
        contextWindow: 200000,
        maxTokens: 4096,
        defaultMaxTokens: 4000,
        inputPrice: 0.015,
        outputPrice: 0.075,
        toolEnabled: true,
        vision: {
          enabled: true,
          allowBase64: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
          ],
        },
        description: `Powerful multilingual model for highly complex tasks, top-level performance, intelligence, fluency, and understanding`,
      },
      'claude-3-sonnet-20240229': {
        label: 'claude-3-sonnet',
        contextWindow: 200000,
        maxTokens: 4096,
        defaultMaxTokens: 4000,
        inputPrice: 0.003,
        outputPrice: 0.015,
        toolEnabled: true,
        vision: {
          enabled: true,
          allowBase64: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
          ],
        },
        description:
          'A multilingual model with balance of intelligence and speed, strong utility, balanced for scaled deployments',
      },
      'claude-3-haiku-20240307': {
        label: 'claude-3-haiku',
        contextWindow: 200000,
        maxTokens: 4096,
        defaultMaxTokens: 4000,
        inputPrice: 0.000025,
        outputPrice: 0.00125,
        toolEnabled: true,
        vision: {
          enabled: true,
          allowBase64: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
          ],
        },
        description:
          'Fastest and most compact multilingual model for near-instant responsiveness, quick and accurate targeted performance',
      },
    },
  },
} as IServiceProvider;
