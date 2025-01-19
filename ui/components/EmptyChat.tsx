import { Settings, Info } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import SettingsDialog from './SettingsDialog';
import { useState, useEffect } from 'react';
import { File } from './ChatWindow';

// Check for admin mode to show/hide  UI elements
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === 'true';

const predefinedQuestions = [
  "What is RDM?",
  "Where do I find the DFG DMP template?",
  "What are the FAIR principles?",
  "List some data availability statements",
  "How do I include RDM in a research project proposal?",
  "How do I cite a dataset?",
  "What is Open Science?",
  "What are best practices for choosing a file format?",
  "What is the difference between open data and restricted data?",
  "How do I write a data management plan (DMP)?",
  "What tools can I use to document metadata effectively?",
  "How do I handle personal data in compliance with GDPR?",
  "What are some examples of data repositories?",
  "How can I ensure the long-term preservation of my data?",
  "What is the role of persistent identifiers (e.g., DOI) in RDM?",
  "How do I decide which datasets to archive after a project?",
  "What are the common challenges in data sharing?",
  "How do I assess the quality of secondary datasets?",
  "How can qualitative data (i.e. interview transcripts) be managed?",
  "What are best practices for anonymizing survey data?",
  "Which repositories are suitable for psychology experiments?",
  "How can I ensure reproducibility in economics research?",
  "What are ethical considerations for sharing sensitive data?",
  "What is the difference between FAIR and CARE?",
  "What tools help to organize textual data in the humanities?",
  "How do I comply with copyright laws when sharing historical datasets?",
  "What metadata standards are appropriate for mixed-methods research?",
  "What are the most important interdisciplinary repositories?",
  "Which license should I choose for my data?",
  "How do I use Git for version control in data management?",
  "How much anonymization for my data is enough?",
  "How much documentation is needed for my data set?",
  "What are the advantages of sharing data through a data infrastructure?",
  "How can I handle data breaches?",
  "What is data versioning?",
  "How should I backup my research data?",
  "What is data anonymization?",
  "What are data licensing options?",
  "How should I secure sensitive research data?"
];

type EmptyChatProps = {
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
}: EmptyChatProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // State to hold the 4 randomly selected questions
  const [randomPredefinedQuestions, setRandomPredefinedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...predefinedQuestions].sort(() => 0.5 - Math.random());
    setRandomPredefinedQuestions(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="relative">

      {/* Settings */}
      {isAdminMode && (
        <>
          <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
          <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
            <Settings
              className="cursor-pointer lg:hidden"
              onClick={() => setIsSettingsOpen(true)}
            />
          </div>
        </>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-8">
        <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium -mt-8">
          🌱 FAIRplexica: Search for RDM topics
        </h2>

        {/* User chat input */}
        <EmptyChatMessageInput
          sendMessage={sendMessage}
          fileIds={fileIds}
          setFileIds={setFileIds}
          files={files}
          setFiles={setFiles}
          {...(isAdminMode && {
            focusMode,
            setFocusMode,
            optimizationMode,
            setOptimizationMode,
          })}
        />

        {/* Predefined questions */}
        <div className="space-y-2 items-center justify-center">
          {randomPredefinedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => sendMessage(question)}
              className="text-left text-black/70 dark:text-white/70 text-base font-normal p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2 shadow-sm"
            >
              {question}
            </button>
          ))}
        </div>

      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 flex items-center space-x-2">
        <Info className="w-4 h-4" />
        <span>LLMs make mistakes. Check information and cited sources carefully.</span>
      </div>

    </div>
  );
};

export default EmptyChat;
