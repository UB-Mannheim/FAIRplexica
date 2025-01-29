import fs from 'fs';
import path from 'path';
import toml from '@iarna/toml';

const configFileName = 'config.toml';

interface Config {
  GENERAL: {
    PORT: number;
    SIMILARITY_MEASURE: string;
    KEEP_ALIVE: string;
    GLOBAL_CONTEXT: string;
  };
  API_KEYS: {
    OPENAI: string;
    GROQ: string;
    ANTHROPIC: string;
    GEMINI: string;
    CUSTOM_OPENAI_API_KEY?: string;
  };
  API_ENDPOINTS: {
    SEARXNG: string;
    OLLAMA: string;
    CUSTOM_OPENAI_BASE_URL?: string;
  };
  MODEL_SELECTION?: {
    SELECTED_CHAT_MODEL_PROVIDER?: string;
    SELECTED_CHAT_MODEL?: string;
    SELECTED_EMBEDDING_MODEL_PROVIDER?: string;
    SELECTED_EMBEDDING_MODEL?: string;
  };
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const loadConfig = () =>
  toml.parse(
    fs.readFileSync(path.join(__dirname, `../${configFileName}`), 'utf-8'),
  ) as any as Config;

export const getPort = () => loadConfig().GENERAL.PORT;

export const getSimilarityMeasure = () =>
  loadConfig().GENERAL.SIMILARITY_MEASURE;

export const getKeepAlive = () => loadConfig().GENERAL.KEEP_ALIVE;

// Global Search Context for SearXNG
export const getGlobalContext = () => loadConfig().GENERAL.GLOBAL_CONTEXT;

export const getOpenaiApiKey = () => loadConfig().API_KEYS.OPENAI;

export const getGroqApiKey = () => loadConfig().API_KEYS.GROQ;

export const getAnthropicApiKey = () => loadConfig().API_KEYS.ANTHROPIC;

export const getGeminiApiKey = () => loadConfig().API_KEYS.GEMINI;

export const getCustomOpenAIApiKey = () => 
  loadConfig().API_KEYS.CUSTOM_OPENAI_API_KEY;

export const getSearxngApiEndpoint = () =>
  process.env.SEARXNG_API_URL || loadConfig().API_ENDPOINTS.SEARXNG;

export const getOllamaApiEndpoint = () => loadConfig().API_ENDPOINTS.OLLAMA;

export const getCustomOpenAIBaseURL = () =>
  loadConfig().API_ENDPOINTS.CUSTOM_OPENAI_BASE_URL;

export const getSelectedChatModelProvider = () =>
  loadConfig().MODEL_SELECTION?.SELECTED_CHAT_MODEL_PROVIDER;

export const getSelectedChatModel = () =>
  loadConfig().MODEL_SELECTION?.SELECTED_CHAT_MODEL;

export const getSelectedEmbeddingModelProvider = () =>
  loadConfig().MODEL_SELECTION?.SELECTED_EMBEDDING_MODEL_PROVIDER;

export const getSelectedEmbeddingModel = () =>
  loadConfig().MODEL_SELECTION?.SELECTED_EMBEDDING_MODEL;

export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();

  for (const key in currentConfig) {
    if (!config[key]) config[key] = {};

    if (typeof currentConfig[key] === 'object' && currentConfig[key] !== null) {
      for (const nestedKey in currentConfig[key]) {
        if (
          !config[key][nestedKey] &&
          currentConfig[key][nestedKey] &&
          config[key][nestedKey] !== ''
        ) {
          config[key][nestedKey] = currentConfig[key][nestedKey];
        }
      }
    } else if (currentConfig[key] && config[key] !== '') {
      config[key] = currentConfig[key];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, `../${configFileName}`),
    toml.stringify(config),
  );
};
