'use client';

const AboutPage = () => {
  return (
      <main className="flex flex-col items-center justify-center min-h-screen max-w-screen-lg mx-auto p-2">

        <p className="text-black/70 dark:text-white/70 text-lg md:text-lg text-center">
          <b>FAIRplexica</b> is an open source academic search engine designed to answer questions about research data management (RDM).
          It performs guided web searches over relevant RDM resources using the metasearch engine{' '}
          <a
            href="https://github.com/searxng/searxng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer"
          >
            SearXNG
          </a>. The collected search result are then processed by a local LLM using{' '}
          <a
            href="https://github.com/ollama/ollama"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#ADB8C8] dark:hover:text-[#ADB8C8] cursor-pointer"
          >
            Ollama
          </a>.<br/><br/>
          FAIRplexica is maintained by{' '}
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

        <div className="flex items-center gap-8 mt-8">
          <a
            href="https://www.bib.uni-mannheim.de/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
           >
            <img
              src="/UB_logo.png"
              alt="University Library Mannheim Logo"
              className="h-20 group-hover:filter hover:grayscale transition duration-300 ease-in-out cursor-pointer"
            />
          </a>
          <a
            href="https://www.bib.uni-mannheim.de/lehren-und-forschen/forschungsdatenzentrum/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
           >
            <img
              src="/FDZ_logo.png"
              alt="Research Data Center Mannheim Logo"
              className="h-20 group-hover:filter hover:grayscale transition duration-300 ease-in-out cursor-pointer"
            />
          </a>
        </div>
      </main>
  );
};

export default AboutPage;
