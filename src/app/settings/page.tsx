'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-4">
      <ShieldCheck className="mx-auto h-10 w-10 text-black/70 dark:text-white/70" />
      <h1 className="text-3xl font-semibold text-black dark:text-white">
        Settings Have Moved
      </h1>
      <p className="text-sm text-black/70 dark:text-white/70">
        Application and model configuration now lives inside the protected admin
        area.
      </p>
      <p className="text-sm text-black/70 dark:text-white/70">
        Please visit the{' '}
        <Link
          href="/admin"
          className="underline underline-offset-2 text-black dark:text-white"
        >
          admin dashboard
        </Link>{' '}
        and authenticate with your administrator credentials.
      </p>
    </div>
  );
};

export default SettingsPage;
