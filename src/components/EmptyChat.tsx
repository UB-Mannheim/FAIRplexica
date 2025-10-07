'use client';

import { useMemo } from 'react';
import { Settings, Info } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import Link from 'next/link';
import { useChat } from '@/lib/hooks/useChat';

const STARTER_QUESTIONS = [
  'What is RDM?',
  'Where do I find the DFG DMP template?',
  'What are the FAIR principles?',
  'List some data availability statements',
  'How do I include RDM in a research project proposal?',
  'How do I cite a dataset?',
  'What is Open Science?',
  'What are best practices for choosing a file format?',
  'What is the difference between open data and restricted data?',
  'How do I write a data management plan (DMP)?',
  'What tools can I use to document metadata effectively?',
  'How do I handle personal data in compliance with GDPR?',
  'What are some examples of data repositories?',
  'How can I ensure the long-term preservation of my data?',
  'What is the role of persistent identifiers (e.g. DOI) in RDM?',
  'How do I decide which datasets to archive after a project?',
  'What are the common challenges in data sharing?',
  'How do I assess the quality of secondary datasets?',
  'How can qualitative data (i.e. interview transcripts) be managed?',
  'What are best practices for anonymizing survey data?',
  'Which repositories are suitable for psychology experiments?',
  'How can I ensure reproducibility in economics research?',
  'What are ethical considerations for sharing sensitive data?',
  'What is the difference between FAIR and CARE?',
  'What tools help to organize textual data in the humanities?',
  'How do I comply with copyright laws when sharing historical datasets?',
  'What metadata standards are appropriate for mixed-methods research?',
  'What are the most important interdisciplinary repositories?',
  'Which license should I choose for my data?',
  'How do I use Git for version control in data management?',
  'How much anonymization for my data is enough?',
  'How much documentation is needed for my data set?',
  'What are the advantages of sharing data through a data infrastructure?',
  'How can I handle data breaches?',
  'What is data versioning?',
  'How should I backup my research data?',
  'What is data anonymization?',
  'What are data licensing options?',
  'How should I secure sensitive research data?',
];

const EmptyChat = () => {
  const { sendMessage } = useChat();

  const starterQuestions = useMemo(() => {
    const shuffled = [...STARTER_QUESTIONS];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, []);

  return (
    <div className="relative">
      <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        <Link href="/settings">
          <Settings className="cursor-pointer lg:hidden" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-4">
        <div className="flex flex-col items-center justify-center w-full space-y-8">
          <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium -mt-8">
            🌱 FAIRplexica: Search for RDM topics
          </h2>
          <EmptyChatMessageInput />
        </div>
        <div className="flex flex-col w-full gap-3 mt-4">
          <p className="text-sm text-black/60 dark:text-white/60 text-center">
            or start with one of these questions:
          </p>
          <div className="flex w-full flex-wrap justify-center gap-3">
            {starterQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => sendMessage(question)}
                className="flex min-h-[3rem] items-center justify-start rounded-full border border-light-100 dark:border-dark-200 bg-white dark:bg-dark-secondary px-4 py-3 text-center text-md text-black/80 transition hover:bg-light-secondary/80 dark:hover:bg-dark-secondary shadow-md"
              >
                {question}
              </button>
            ))}
          </div>
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
