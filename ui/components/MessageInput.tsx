import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Attach from './MessageInputActions/Attach';
import CopilotToggle from './MessageInputActions/Copilot';
import { File } from './ChatWindow';
import AttachSmall from './MessageInputActions/AttachSmall';

// Check for admin mode to show/hide  UI elements
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === 'true';

const MessageInput = ({
  sendMessage,
  loading,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  loading: boolean;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [mode, setMode] = useState<'multi' | 'single'>('single');

  useEffect(() => {
    if (textareaRows >= 2 && message && mode === 'single') {
      setMode('multi');
    } else if (!message && mode === 'multi') {
      setMode('single');
    }
  }, [textareaRows, mode, message]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        if (loading) return;
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }
      }}
      className={cn(
        'bg-light-primary dark:bg-dark-secondary p-4 flex items-center overflow-hidden border border-light-100 dark:border-dark-200 shadow-lg',
        mode === 'multi' ? 'flex-col rounded-lg' : 'flex-row rounded-full',
      )}
    >
      {mode === 'single' && isAdminMode && (
        <AttachSmall
          fileIds={fileIds}
          setFileIds={setFileIds}
          files={files}
          setFiles={setFiles}
        />
      )}
      <TextareaAutosize
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onHeightChange={(height, props) => {
          setTextareaRows(Math.ceil(height / props.rowHeight));
        }}
        className="transition bg-transparent dark:placeholder:text-white/50 placeholder:text-black text-sm dark:text-white resize-none focus:outline-none w-full px-2 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
        placeholder="Ask a follow-up ..."
      />

      {mode === 'single' && (
        <div className="flex flex-row items-center space-x-4">
          {isAdminMode && (
            <CopilotToggle
              copilotEnabled={copilotEnabled}
              setCopilotEnabled={setCopilotEnabled}
            />
          )}

          <button
            disabled={message.trim().length === 0 || loading}
            className="bg-light-200 text-white disabled:text-black/50 dark:disabled:text-white/50 disabled:bg-light-100 dark:disabled:bg-[#ececec21] hover:bg-opacity-85 transition duration-100 rounded-full p-2"
          >
            <Search className="bg-background" size={17} />
          </button>
        </div>
      )}

      {mode === 'multi' && (
        <div className="flex flex-row items-center justify-between w-full pt-2">
          {isAdminMode && (
            <>
              <AttachSmall
                fileIds={fileIds}
                setFileIds={setFileIds}
                files={files}
                setFiles={setFiles}
              />
              <div className="flex flex-row items-center space-x-4">
                <CopilotToggle
                  copilotEnabled={copilotEnabled}
                  setCopilotEnabled={setCopilotEnabled}
                />
              </div>
            </>
          )}

          <button
            disabled={message.trim().length === 0 || loading}
            className="bg-light-200 text-white disabled:text-black/50 dark:disabled:text-white/50 disabled:bg-light-100 dark:disabled:bg-[#ececec21] hover:bg-opacity-85 transition duration-100 rounded-full p-2"
          >
            <Search className="bg-background" size={17} />
          </button>
        </div>
      )}

    </form>
  );
};

export default MessageInput;
