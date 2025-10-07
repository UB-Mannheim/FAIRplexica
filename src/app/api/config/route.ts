import {
  getAnthropicApiKey,
  getCustomOpenaiApiKey,
  getCustomOpenaiApiUrl,
  getCustomOpenaiModelName,
  getGeminiApiKey,
  getGlobalContext,
  getGroqApiKey,
  getSystemPrompt,
  getOllamaApiEndpoint,
  getOpenaiApiKey,
  getDeepseekApiKey,
  getAimlApiKey,
  getLMStudioApiEndpoint,
  getLemonadeApiEndpoint,
  getLemonadeApiKey,
  updateConfig,
  getOllamaApiKey,
} from '@/lib/config';
import {
  getAvailableChatModelProviders,
  getAvailableEmbeddingModelProviders,
} from '@/lib/providers';
import { authenticateAdminRequest } from '@/lib/auth';

export const GET = async (req: Request) => {
  try {
    const admin = authenticateAdminRequest(req);

    if (!admin) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const config: Record<string, any> = {};

    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ]);

    config['chatModelProviders'] = {};
    config['embeddingModelProviders'] = {};

    for (const provider in chatModelProviders) {
      config['chatModelProviders'][provider] = Object.keys(
        chatModelProviders[provider],
      ).map((model) => {
        return {
          name: model,
          displayName: chatModelProviders[provider][model].displayName,
        };
      });
    }

    for (const provider in embeddingModelProviders) {
      config['embeddingModelProviders'][provider] = Object.keys(
        embeddingModelProviders[provider],
      ).map((model) => {
        return {
          name: model,
          displayName: embeddingModelProviders[provider][model].displayName,
        };
      });
    }

    config['openaiApiKey'] = getOpenaiApiKey();
    config['ollamaApiUrl'] = getOllamaApiEndpoint();
    config['ollamaApiKey'] = getOllamaApiKey();
    config['lmStudioApiUrl'] = getLMStudioApiEndpoint();
    config['lemonadeApiUrl'] = getLemonadeApiEndpoint();
    config['lemonadeApiKey'] = getLemonadeApiKey();
    config['anthropicApiKey'] = getAnthropicApiKey();
    config['groqApiKey'] = getGroqApiKey();
    config['geminiApiKey'] = getGeminiApiKey();
    config['deepseekApiKey'] = getDeepseekApiKey();
    config['aimlApiKey'] = getAimlApiKey();
    config['customOpenaiApiUrl'] = getCustomOpenaiApiUrl();
    config['customOpenaiApiKey'] = getCustomOpenaiApiKey();
    config['customOpenaiModelName'] = getCustomOpenaiModelName();
    config['globalContext'] = getGlobalContext();
    config['systemPrompt'] = getSystemPrompt();

    return Response.json({ ...config }, { status: 200 });
  } catch (err) {
    console.error('An error occurred while getting config:', err);
    return Response.json(
      { message: 'An error occurred while getting config' },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const admin = authenticateAdminRequest(req);

    if (!admin) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const config = await req.json();

    const updatedConfig = {
      GENERAL: {
        GLOBAL_CONTEXT: config.globalContext ?? '',
        SYSTEM_PROMPT: config.systemPrompt ?? '',
      },
      MODELS: {
        OPENAI: {
          API_KEY: config.openaiApiKey,
        },
        GROQ: {
          API_KEY: config.groqApiKey,
        },
        ANTHROPIC: {
          API_KEY: config.anthropicApiKey,
        },
        GEMINI: {
          API_KEY: config.geminiApiKey,
        },
        OLLAMA: {
          API_URL: config.ollamaApiUrl,
          API_KEY: config.ollamaApiKey,
        },
        DEEPSEEK: {
          API_KEY: config.deepseekApiKey,
        },
        AIMLAPI: {
          API_KEY: config.aimlApiKey,
        },
        LM_STUDIO: {
          API_URL: config.lmStudioApiUrl,
        },
        LEMONADE: {
          API_URL: config.lemonadeApiUrl,
          API_KEY: config.lemonadeApiKey,
        },
        CUSTOM_OPENAI: {
          API_URL: config.customOpenaiApiUrl,
          API_KEY: config.customOpenaiApiKey,
          MODEL_NAME: config.customOpenaiModelName,
        },
      },
    };

    updateConfig(updatedConfig);

    return Response.json({ message: 'Config updated' }, { status: 200 });
  } catch (err) {
    console.error('An error occurred while updating config:', err);
    return Response.json(
      { message: 'An error occurred while updating config' },
      { status: 500 },
    );
  }
};
