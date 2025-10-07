import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useChat } from '@/lib/hooks/useChat';

const EmptyChatMessageInput = () => {
  const { sendMessage } = useChat();

  /* const [copilotEnabled, setCopilotEnabled] = useState(false); */
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
      <div className="flex flex-row items-center gap-4 bg-light-50 dark:bg-dark-secondary px-5 py-3 rounded-full w-full border border-light-100 dark:border-dark-200 shadow-md focus-within:border-light-accent dark:focus-within:border-dark-300">
        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minRows={1}
          className="bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-md text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48"
          placeholder="Ask anything ..."
        />
        <button
          disabled={message.trim().length === 0}
          className="bg-light-accent text-white disabled:text-black/40 dark:disabled:text-white/50 disabled:bg-light-secondary dark:disabled:bg-dark-200 hover:bg-light-accent/90 transition duration-100 rounded-full p-3"
        >
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
};

export default EmptyChatMessageInput;
