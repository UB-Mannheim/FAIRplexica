'use client';

import { Info } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      <div className="flex flex-col pt-4">
        <div className="flex items-center">
          <Info />
          <h1 className="text-3xl font-medium p-2">About FAIRplexica</h1>
        </div>
        <hr className="border-t border-[#2B2C2C] my-4 w-full" />
      </div>

      {/* Main Content */}
      <main className="px-4 lg:px-8 py-4 lg:py-8">

        <div className="flex justify-center gap-12 mb-10 h-24">
          <img
            src="/UB_logo.svg"
            alt="University Library Mannheim Logo"
          />
          <img
            src="/FDZ_logo.png"
            alt="Research Data Center Mannheim Logo"
          />
        </div>

        <p className="text-black/70 dark:text-white/70 text-lg md:text-lg">
          FAIRplexica is an open source academic search engine designed to answer questions about{' '}
          <b>research data management (RDM)</b>.
          It performs guided web searches over relevant RDM resources using the metasearch engine{' '}
          <a
            href="https://github.com/searxng/searxng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer"
          >
            SearXNG
          </a>. The collected search results are then processed by a local LLM using{' '}
          <a
            href="https://github.com/ollama/ollama"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer"
          >
            Ollama
          </a>.<br /><br />
          FAIRplexica is provided and maintained by{' '}
          <a
            href="https://www.bib.uni-mannheim.de/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer"
          >
            University Library Mannheim
          </a>{' '}
          and based on{' '}
          <a
            href="https://github.com/ItzCrazyKns/Perplexica"
            target='_blank'
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer"
          >
            Perplexica
          </a>.
        </p>
      </main>
    </div>
  );
};

export default AboutPage;
