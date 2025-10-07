'use client';

import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PROVIDER_METADATA } from '@/lib/providers';
import { cn } from '@/lib/utils';

interface SettingsType {
  chatModelProviders: {
    [key: string]: [Record<string, any>];
  };
  embeddingModelProviders: {
    [key: string]: [Record<string, any>];
  };
  openaiApiKey: string;
  groqApiKey: string;
  anthropicApiKey: string;
  geminiApiKey: string;
  ollamaApiUrl: string;
  ollamaApiKey: string;
  lmStudioApiUrl: string;
  lemonadeApiUrl: string;
  lemonadeApiKey: string;
  deepseekApiKey: string;
  aimlApiKey: string;
  customOpenaiApiKey: string;
  customOpenaiApiUrl: string;
  customOpenaiModelName: string;
  globalContext: string;
  systemPrompt: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSaving?: boolean;
  onSave?: (value: string) => void;
}

const Input = ({ className, isSaving, onSave, ...restProps }: InputProps) => {
  return (
    <div className="relative">
      <input
        {...restProps}
        className={cn(
          'bg-light dark:bg-dark-secondary w-full px-3 py-2 flex items-center overflow-hidden border border-light-100 dark:border-dark-200 dark:text-white rounded-lg text-sm placeholder:text-light-200',
          isSaving && 'pr-10',
          className,
        )}
        onBlur={(e) => onSave?.(e.target.value)}
      />
      {isSaving && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2
            size={16}
            className="animate-spin text-black/70 dark:text-white/70"
          />
        </div>
      )}
    </div>
  );
};

const Select = ({
  className,
  options,
  ...restProps
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string; disabled?: boolean }[];
}) => {
  return (
    <select
      {...restProps}
      className={cn(
        'bg-light dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-100 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    >
      {options.map(({ label, value, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
  );
};

const Textarea = ({
  className,
  isSaving,
  ...restProps
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isSaving?: boolean;
}) => (
  <div className="relative">
    <textarea
      {...restProps}
      className={cn(
        'bg-light dark:bg-dark-secondary px-3 py-2 w-full border border-light-100 dark:border-dark-200 dark:text-white rounded-lg text-sm resize-none focus:outline-none placeholder:text-light-200',
        isSaving && 'pr-10',
        className,
      )}
    />
    {isSaving && (
      <Loader2
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-black dark:text-white/70"
      />
    )}
  </div>
);

const SettingsSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col space-y-4 p-4 bg-light-200 dark:bg-dark-secondary/50 rounded-xl border border-light-200 dark:border-dark-200">
    <div>
      <h2 className="text-black/90 dark:text-white/90 font-medium">{title}</h2>
      {description && (
        <p className="text-xs text-black/60 dark:text-white/60 mt-1">
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

const AdminPage = () => {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [config, setConfig] = useState<SettingsType | null>(null);
  const [chatModels, setChatModels] = useState<Record<string, any>>({});
  const [embeddingModels, setEmbeddingModels] = useState<Record<string, any>>(
    {},
  );
  const [selectedChatModelProvider, setSelectedChatModelProvider] = useState<
    string | null
  >(null);
  const [selectedChatModel, setSelectedChatModel] = useState<string | null>(
    null,
  );
  const [selectedEmbeddingModelProvider, setSelectedEmbeddingModelProvider] =
    useState<string | null>(null);
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<
    string | null
  >(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const resetSelectionsFromConfig = useCallback((data: SettingsType) => {
    const chatModelProvidersKeys = Object.keys(data.chatModelProviders || {});
    const embeddingModelProvidersKeys = Object.keys(
      data.embeddingModelProviders || {},
    );

    const defaultChatModelProvider =
      chatModelProvidersKeys.length > 0 ? chatModelProvidersKeys[0] : '';
    const defaultEmbeddingModelProvider =
      embeddingModelProvidersKeys.length > 0 ? embeddingModelProvidersKeys[0] : '';

    const storedChatModelProvider =
      typeof window !== 'undefined'
        ? localStorage.getItem('chatModelProvider')
        : null;
    const storedChatModel =
      typeof window !== 'undefined' ? localStorage.getItem('chatModel') : null;
    const storedEmbeddingModelProvider =
      typeof window !== 'undefined'
        ? localStorage.getItem('embeddingModelProvider')
        : null;
    const storedEmbeddingModel =
      typeof window !== 'undefined' ? localStorage.getItem('embeddingModel') : null;

    const chatModelProvider =
      storedChatModelProvider || defaultChatModelProvider || '';
    const chatModel =
      storedChatModel ||
      (data.chatModelProviders &&
      data.chatModelProviders[chatModelProvider]?.length > 0
        ? data.chatModelProviders[chatModelProvider][0].name
        : undefined) ||
      '';

    const embeddingModelProvider =
      storedEmbeddingModelProvider || defaultEmbeddingModelProvider || '';
    const embeddingModel =
      storedEmbeddingModel ||
      (data.embeddingModelProviders &&
        data.embeddingModelProviders[embeddingModelProvider]?.[0].name) ||
      '';

    setSelectedChatModelProvider(chatModelProvider);
    setSelectedChatModel(chatModel);
    setSelectedEmbeddingModelProvider(embeddingModelProvider);
    setSelectedEmbeddingModel(embeddingModel);
  }, []);

  const fetchConfig = useCallback(async () => {
    setIsLoadingConfig(true);
    try {
      const res = await fetch(`/api/config`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (res.status === 401) {
        setAuthState('unauthenticated');
        setConfig(null);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch config');
      }

      const data = (await res.json()) as SettingsType;
      setConfig(data);
      setChatModels(data.chatModelProviders || {});
      setEmbeddingModels(data.embeddingModelProviders || {});
      resetSelectionsFromConfig(data);
      setAuthState('authenticated');
    } catch (error) {
      console.error('Failed to fetch admin config:', error);
    } finally {
      setIsLoadingConfig(false);
    }
  }, [resetSelectionsFromConfig]);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      if (res.ok) {
        setAuthState('authenticated');
        await fetchConfig();
      } else {
        setAuthState('unauthenticated');
      }
    } catch (error) {
      console.error('Failed to check admin session:', error);
      setAuthState('unauthenticated');
    }
  }, [fetchConfig]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const saveConfig = async (key: string, value: any) => {
    setSavingStates((prev) => ({ ...prev, [key]: true }));

    try {
      const updatedConfig = {
        ...config,
        [key]: value,
      } as SettingsType;

      const response = await fetch(`/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to update config');
      }

      setConfig(updatedConfig);

      if (
        key.toLowerCase().includes('api') ||
        key.toLowerCase().includes('url')
      ) {
        await fetchConfig();
      }

      if (typeof window !== 'undefined') {
        if (key === 'chatModelProvider') {
          localStorage.setItem('chatModelProvider', value);
        } else if (key === 'chatModel') {
          localStorage.setItem('chatModel', value);
        } else if (key === 'embeddingModelProvider') {
          localStorage.setItem('embeddingModelProvider', value);
        } else if (key === 'embeddingModel') {
          localStorage.setItem('embeddingModel', value);
        }
      }
    } catch (err) {
      console.error('Failed to save admin config:', err);
      await fetchConfig();
    } finally {
      setTimeout(() => {
        setSavingStates((prev) => ({ ...prev, [key]: false }));
      }, 300);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginSubmitting(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setLoginError('Invalid username or password.');
          return;
        }

        throw new Error('Failed to login');
      }

      setUsername('');
      setPassword('');
      setAuthState('authenticated');
      await fetchConfig();
    } catch (error) {
      console.error('Failed to login admin:', error);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout admin:', error);
    } finally {
      setAuthState('unauthenticated');
      setConfig(null);
    }
  };

  const chatModelProviderOptions = useMemo(() => {
    return Object.keys(chatModels).map((provider) => ({
      value: provider,
      label:
        (PROVIDER_METADATA as any)[provider]?.displayName ||
        provider.charAt(0).toUpperCase() + provider.slice(1),
    }));
  }, [chatModels]);

  const embeddingModelProviderOptions = useMemo(() => {
    return Object.keys(embeddingModels).map((provider) => ({
      value: provider,
      label:
        (PROVIDER_METADATA as any)[provider]?.displayName ||
        provider.charAt(0).toUpperCase() + provider.slice(1),
    }));
  }, [embeddingModels]);

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <div className="flex flex-col pt-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="lg:hidden">
            <ShieldCheck className="text-black/70 dark:text-white/70" />
          </Link>
          <div className="flex flex-row space-x-2 items-center">
            <ShieldCheck size={24} />
            <h1 className="text-3xl font-medium p-2">Admin</h1>
          </div>
        </div>
        <hr className="border-t border-[#2B2C2C] my-4 w-full" />
      </div>

      {authState === 'checking' && (
        <div className="flex flex-row items-center justify-center min-h-[50vh]">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {authState === 'unauthenticated' && (
        <div className="max-w-md mx-auto mt-12 p-6 bg-light-200 dark:bg-dark-secondary/40 border border-light-200 dark:border-dark-200 rounded-xl shadow-xl">
          <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-light-100 dark:border-dark-200 bg-light dark:bg-dark-secondary text-sm"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-light-100 dark:border-dark-200 bg-light dark:bg-dark-secondary text-sm"
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-500">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-black text-white bg-light-accent hover:bg-light-100 dark:bg-white dark:text-black text-sm"
              disabled={loginSubmitting}
            >
              {loginSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {loginSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>
        </div>
      )}

      {authState === 'authenticated' && (
        <div className="flex flex-col space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-md rounded-lg border border-light-200 dark:border-dark-200 text-black/80 dark:text-white/80 hover:bg-light-secondary/80 dark:hover:bg-dark-secondary/80"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {isLoadingConfig ? (
            <div className="flex flex-row items-center justify-center min-h-[40vh]">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            config && (
              <div className="flex flex-col space-y-6">
                <SettingsSection
                  title="Search Context"
                  description="Global keywords appended to every web search."
                >
                  <Input
                    type="text"
                    placeholder="e.g. site:example.com"
                    value={config.globalContext || ''}
                    isSaving={savingStates['globalContext']}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setConfig((prev) => ({
                        ...prev!,
                        globalContext: e.target.value,
                      }));
                    }}
                    onSave={(value) => saveConfig('globalContext', value)}
                  />
                </SettingsSection>

                <SettingsSection
                  title="System Prompt"
                  description="Optional instructions prepended to every LLM call. Useful for enforcing tone, formatting, or institution-specific guidance."
                >
                  <Textarea
                    placeholder="e.g. Your indiviudal system prompt instruction"
                    value={config.systemPrompt || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setConfig((prev) => ({
                        ...prev!,
                        systemPrompt: e.target.value,
                      }))
                    }
                    isSaving={savingStates['systemPrompt']}
                    onBlur={(e) =>
                      saveConfig('systemPrompt', e.target.value.trim())
                    }
                    className="min-h-[140px]"
                  />
                </SettingsSection>

                <SettingsSection
                  title="Chat Models"
                  description="Select the default providers available to the application."
                >
                  {chatModelProviderOptions.length > 0 ? (
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Chat Model Provider
                        </p>
                        <Select
                          value={selectedChatModelProvider ?? undefined}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedChatModelProvider(value);
                            saveConfig('chatModelProvider', value);
                            const firstModel =
                              config.chatModelProviders[value]?.[0]?.name;
                            if (firstModel) {
                              setSelectedChatModel(firstModel);
                              saveConfig('chatModel', firstModel);
                            }
                          }}
                          options={chatModelProviderOptions}
                        />
                      </div>

                      {selectedChatModelProvider && (
                        <div className="flex flex-col space-y-1">
                          <p className="text-black/70 dark:text-white/70 text-sm">
                            Chat Model
                          </p>
                          <Select
                            value={selectedChatModel ?? undefined}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedChatModel(value);
                              saveConfig('chatModel', value);
                            }}
                            options={(() => {
                              const providerModels =
                                config.chatModelProviders[
                                  selectedChatModelProvider
                                ];
                              return providerModels && providerModels.length > 0
                                ? providerModels.map((model) => ({
                                    value: model.name,
                                    label: model.displayName,
                                  }))
                                : [
                                    {
                                      value: '',
                                      label: 'No models available',
                                      disabled: true,
                                    },
                                  ];
                            })()}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-black/60 dark:text-white/60">
                      No chat model providers available.
                    </p>
                  )}

                  {embeddingModelProviderOptions.length > 0 && (
                    <div className="flex flex-col space-y-3 pt-4 border-t border-light-200 dark:border-dark-200">
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Embedding Model Provider
                        </p>
                        <Select
                          value={selectedEmbeddingModelProvider ?? undefined}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedEmbeddingModelProvider(value);
                            saveConfig('embeddingModelProvider', value);
                            const firstModel =
                              config.embeddingModelProviders[value]?.[0]?.name;
                            if (firstModel) {
                              setSelectedEmbeddingModel(firstModel);
                              saveConfig('embeddingModel', firstModel);
                            }
                          }}
                          options={embeddingModelProviderOptions}
                        />
                      </div>

                      {selectedEmbeddingModelProvider && (
                        <div className="flex flex-col space-y-1">
                          <p className="text-black/70 dark:text-white/70 text-sm">
                            Embedding Model
                          </p>
                          <Select
                            value={selectedEmbeddingModel ?? undefined}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedEmbeddingModel(value);
                              saveConfig('embeddingModel', value);
                            }}
                            options={(() => {
                              const providerModels =
                                config.embeddingModelProviders[
                                  selectedEmbeddingModelProvider
                                ];
                              return providerModels && providerModels.length > 0
                                ? providerModels.map((model) => ({
                                    value: model.name,
                                    label: model.displayName,
                                  }))
                                : [
                                    {
                                      value: '',
                                      label: 'No models available',
                                      disabled: true,
                                    },
                                  ];
                            })()}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </SettingsSection>

                <SettingsSection
                  title="API Keys"
                  description="Stored in config.toml; credentials are written on save."
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        OpenAI API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="OpenAI API Key"
                        value={config.openaiApiKey || ''}
                        isSaving={savingStates['openaiApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            openaiApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('openaiApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Groq API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="Groq API Key"
                        value={config.groqApiKey || ''}
                        isSaving={savingStates['groqApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            groqApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('groqApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Anthropic API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="Anthropic API Key"
                        value={config.anthropicApiKey || ''}
                        isSaving={savingStates['anthropicApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            anthropicApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('anthropicApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Gemini API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="Gemini API Key"
                        value={config.geminiApiKey || ''}
                        isSaving={savingStates['geminiApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            geminiApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('geminiApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        DeepSeek API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="DeepSeek API Key"
                        value={config.deepseekApiKey || ''}
                        isSaving={savingStates['deepseekApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            deepseekApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('deepseekApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        AIML API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="AI/ML API Key"
                        value={config.aimlApiKey || ''}
                        isSaving={savingStates['aimlApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            aimlApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('aimlApiKey', value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-4 border-t border-light-200 dark:border-dark-200">
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Ollama API URL
                      </p>
                      <Input
                        type="text"
                        placeholder="http://127.0.0.1:11434"
                        value={config.ollamaApiUrl || ''}
                        isSaving={savingStates['ollamaApiUrl']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            ollamaApiUrl: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('ollamaApiUrl', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Ollama API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="Optional"
                        value={config.ollamaApiKey || ''}
                        isSaving={savingStates['ollamaApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            ollamaApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('ollamaApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        LM Studio API URL
                      </p>
                      <Input
                        type="text"
                        placeholder="http://localhost:1234"
                        value={config.lmStudioApiUrl || ''}
                        isSaving={savingStates['lmStudioApiUrl']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            lmStudioApiUrl: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('lmStudioApiUrl', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Lemonade API URL
                      </p>
                      <Input
                        type="text"
                        placeholder="Lemonade API URL"
                        value={config.lemonadeApiUrl || ''}
                        isSaving={savingStates['lemonadeApiUrl']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            lemonadeApiUrl: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('lemonadeApiUrl', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Lemonade API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="Optional"
                        value={config.lemonadeApiKey || ''}
                        isSaving={savingStates['lemonadeApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            lemonadeApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('lemonadeApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Custom OpenAI Base URL
                      </p>
                      <Input
                        type="text"
                        placeholder="Custom OpenAI Base URL"
                        value={config.customOpenaiApiUrl || ''}
                        isSaving={savingStates['customOpenaiApiUrl']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            customOpenaiApiUrl: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('customOpenaiApiUrl', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Custom OpenAI API Key
                      </p>
                      <Input
                        type="password"
                        placeholder="Custom OpenAI API Key"
                        value={config.customOpenaiApiKey || ''}
                        isSaving={savingStates['customOpenaiApiKey']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            customOpenaiApiKey: e.target.value,
                          }));
                        }}
                        onSave={(value) => saveConfig('customOpenaiApiKey', value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1 md:col-span-2">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Custom OpenAI Model Name
                      </p>
                      <Input
                        type="text"
                        placeholder="Model name"
                        value={config.customOpenaiModelName || ''}
                        isSaving={savingStates['customOpenaiModelName']}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setConfig((prev) => ({
                            ...prev!,
                            customOpenaiModelName: e.target.value,
                          }));
                        }}
                        onSave={(value) =>
                          saveConfig('customOpenaiModelName', value)
                        }
                      />
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
