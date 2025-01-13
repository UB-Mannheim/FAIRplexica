'use client';

import { Info } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* Page Header (mirroring the Library page’s structure) */}
      <div className="flex flex-col pt-4">
        <div className="flex items-center">
          <Info />
          <h1 className="text-3xl font-medium p-2">About</h1>
        </div>
        <hr className="border-t border-[#2B2C2C] my-4 w-full" />
      </div>

      {/* Main Content */}
      <main className="px-4 lg:px-8 py-4 lg:py-8">
        <p className="text-black/70 dark:text-white/70 text-lg md:text-lg">
          FAIRplexica is an academic search engine designed to answer questions about{' '}
          <b>research data management (RDM)</b>.<br /><br />
          It is provided and maintained by{' '}
          <a
            href="https://www.bib.uni-mannheim.de/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#24A0ED] dark:hover:text-[#24A0ED] cursor-pointer"
          >
            University Library Mannheim
          </a>{' '}
          and is based on{' '}
          <a
            href="https://github.com/ItzCrazyKns/Perplexica"
            target='_blank'
            rel="noopener noreferrer"
            className="text-black dark:text-white lg:text-lg font-medium truncate transition duration-200 hover:text-[#24A0ED] dark:hover:text-[#24A0ED] cursor-pointer"
          >
            Perplexica
          </a>.
        </p>
      </main>
    </div>
  );
};

export default AboutPage;
