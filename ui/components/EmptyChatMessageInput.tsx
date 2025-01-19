import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import CopilotToggle from './MessageInputActions/Copilot';
import Focus from './MessageInputActions/Focus';
import Optimization from './MessageInputActions/Optimization';
import Attach from './MessageInputActions/Attach';
import { File } from './ChatWindow';

// Check for admin mode to show/hide  UI elements
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === 'true';

type EmptyChatMessageProps = {
  sendMessage: (message: string) => void;
  focusMode?: string;
  setFocusMode?: (mode: string) => void;
  optimizationMode?: string;
  setOptimizationMode?: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
};

const EmptyChatMessageInput = ({
    sendMessage,
    focusMode = 'webSearch',
    setFocusMode = () => {},
    optimizationMode = 'balanced',
    setOptimizationMode = () => {},
    fileIds,
    setFileIds,
    files,
    setFiles,
  }: EmptyChatMessageProps) => {
    const [copilotEnabled, setCopilotEnabled] = useState(false);
    const [message, setMessage] = useState('');

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

    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }
      }}
      className="w-full"
    >
      <div className="flex flex-col bg-light-50 dark:bg-dark-secondary px-5 pt-5 pb-2 rounded-lg w-full border border-light-100 dark:border-dark-200 shadow-md">
        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={2}
          className="bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-md text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48"
          placeholder="Ask a question ..."
        />

        {/* Admin Tools: Focus, Attach Files */}
        <div className="flex flex-row items-center justify-between mt-4">
          {isAdminMode && (
              <div className="flex flex-row items-center space-x-2 lg:space-x-4">
                <Focus
                  focusMode={focusMode || 'default'}
                  setFocusMode={setFocusMode}
                />
                <Attach
                  fileIds={fileIds}
                  setFileIds={setFileIds}
                  files={files}
                  setFiles={setFiles}
                  showText
                />
              </div>
            )}

          {/* Admin Tools: Optimization Mode */}
          <div className={`flex flex-row items-center space-x-1 sm:space-x-4 ${!isAdminMode ? 'ml-auto' : ''}`}>
            {isAdminMode && (
                <Optimization
                  optimizationMode={optimizationMode}
                  setOptimizationMode={setOptimizationMode}
                />
            )}
            <button
              disabled={message.trim().length === 0}
              className="bg-light-200 text-white disabled:text-black/50 dark:disabled:text-white/50 disabled:bg-light-100 dark:disabled:bg-[#ececec21] hover:bg-opacity-85 transition duration-100 rounded-full p-4 mb-2"
              >
              <Search className="bg-background" size={17} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmptyChatMessageInput;
