import { Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { useState } from 'react';
import { File } from './ChatWindow';
import Link from 'next/link';

const predefinedQuestions = [
  "What is RDM?",
  "Where do I find the DFG DMP template?",
  "What are the FAIR principles?",
  "List some data availability statements",
  "How do I include RDM in a research project proposal?",
  "How do I cite a dataset?",
  "What are best practices for choosing a file format?"
];

const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        <Link href="/settings">
          <Settings className="cursor-pointer lg:hidden" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-8">
        <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium -mt-8">
          FAIR-Perplexica: Search for RDM topics
        </h2>

        {/* The input for user’s custom questions */}
        <EmptyChatMessageInput
          sendMessage={sendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          optimizationMode={optimizationMode}
          setOptimizationMode={setOptimizationMode}
          fileIds={fileIds}
          setFileIds={setFileIds}
          files={files}
          setFiles={setFiles}
        />

        {/* Predefined questions */}
        <div className="space-y-2">
          {predefinedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => sendMessage(question)}
              className="text-center text-black/70 dark:text-white/70 text-base font-normal p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
