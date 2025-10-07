import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useChat } from '@/lib/hooks/useChat';

const MessageInput = () => {
  const { loading, sendMessage } = useChat();

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
        'bg-white dark:bg-dark-secondary p-4 flex items-center overflow-hidden border border-light-100 dark:border-dark-200 shadow-xl focus-within:border-light-accent dark:focus-within:border-dark-300',
        mode === 'multi' ? 'flex-col rounded-lg' : 'flex-row rounded-full',
      )}
    >
      <TextareaAutosize
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onHeightChange={(height, props) => {
          setTextareaRows(Math.ceil(height / props.rowHeight));
        }}
        className="transition bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-md dark:text-white resize-none focus:outline-none w-full px-2 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
        placeholder="Ask a follow-up ..."
      />
      <div
        className={cn(
          'flex items-center justify-end space-x-4 flex-shrink-0',
          mode === 'multi' && 'w-full pt-2',
        )}
      >
        <button
          disabled={message.trim().length === 0 || loading}
          className="bg-light-accent text-white disabled:text-black/40 dark:disabled:text-white/50 hover:bg-light-accent/90 transition duration-100 disabled:bg-light-secondary dark:disabled:bg-dark-200 rounded-full p-3"
        >
          <ArrowUp className="bg-background" size={17} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
