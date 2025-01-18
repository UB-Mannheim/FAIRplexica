import { Message } from '@/components/ChatWindow';
import { getAppConfig } from '@/hooks/useAppConfig';

export const getSuggestions = async (chatHisory: Message[]) => {
  const chatModel = localStorage.getItem('chatModel');
  const chatModelProvider = localStorage.getItem('chatModelProvider');

  const customOpenAIKey = localStorage.getItem('openAIApiKey');
  const customOpenAIBaseURL = localStorage.getItem('openAIBaseURL');

  const { NEXT_PUBLIC_API_URL } = getAppConfig() || {};

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatHistory: chatHisory,
      chatModel: {
        provider: chatModelProvider,
        model: chatModel,
        ...(chatModelProvider === 'custom_openai' && {
          customOpenAIKey,
          customOpenAIBaseURL,
        }),
      },
    }),
  });

  const data = (await res.json()) as { suggestions: string[] };

  return data.suggestions;
};
