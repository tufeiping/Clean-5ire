import { merge } from 'lodash';
import { ProviderType, IChatModel, IServiceProvider } from './types';
import Azure from './Azure';
import Baidu from './Baidu';
import OpenAI from './OpenAI';
import Google from './Google';
import Moonshot from './Moonshot';
import ChatBro from './ChatBro';
import Anthropic from './Anthropic';
import Fire from './Fire';
import Ollama from './Ollama';
import LMStudio from './LMStudio';
import Doubao from './Doubao';
import Grok from './Grok';
import DeepSeek from './DeepSeek';
import Mistral from './Mistral';

export const providers: { [key: string]: IServiceProvider } = {
  OpenAI,
  Anthropic,
  Azure,
  Google,
  Grok,
  Baidu,
  Mistral,
  Moonshot,
  ChatBro,
  Ollama,
  Doubao,
  DeepSeek,
  LMStudio,
  '5ire': Fire,
};

export function getProvider(providerName: ProviderType): IServiceProvider {
  return providers[providerName];
}

export function getChatModel(
  providerName: ProviderType,
  modelName: string,
): IChatModel {
  const provider = getProvider(providerName);
  if (Object.keys(provider.chat.models).length === 0) {
    return {} as IChatModel;
  }
  const model = provider.chat.models[modelName];
  return model || ({} as IChatModel);
}

export function getGroupedChatModelNames(): { [key: string]: string[] } {
  const group = (models: { [key: string]: IChatModel }) => {
    const result: { [key: string]: string[] } = {};
    Object.keys(models).forEach((key) => {
      const model = models[key];
      if (model.group) {
        if (result[model.group]) {
          result[model.group].push(model.label || (model.name as string));
        } else {
          result[model.group] = [model.label || (model.name as string)];
        }
      }
    });
    return result;
  };
  const models = Object.values(providers).map((provider: IServiceProvider) =>
    group(provider.chat.models),
  );
  const result = {};
  merge(result, ...models);
  return result;
}
