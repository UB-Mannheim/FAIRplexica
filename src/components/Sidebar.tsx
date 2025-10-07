'use client';

import { cn } from '@/lib/utils';
import { Info, SquarePen, Sun } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { type ReactNode, useEffect, useState } from 'react';
import Layout from './Layout';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

type ThemeOption = 'light' | 'dark';

const themeOrder: ThemeOption[] = ['light', 'dark'];

const themeConfig: Record<ThemeOption, { label: string }> = {
  light: { label: 'Light' },
  dark: { label: 'Dark' }
};

const ThemeCycleButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme: ThemeOption = themeConfig[theme as ThemeOption]
    ? (theme as ThemeOption)
    : 'light';

  const handleClick = () => {
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    setTheme(nextTheme);
  };

  const { label } = themeConfig[currentTheme];

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative flex w-full cursor-pointer items-center justify-center rounded-lg py-2 text-white/70 transition duration-150 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:hover:bg-white/10"
      aria-label={`Switch theme (current: ${label})`}
    >
      <Sun />
    </button>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  const isHomeActive = segments.length === 0 || segments.includes('c');
  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = '/';
  };

  const navLinks = [
    {
      icon: Info,
      href: '/about',
      active: segments.includes('about'),
      label: 'About',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex h-full flex-col items-center gap-y-5 overflow-y-auto bg-light-accent dark:bg-dark-secondary px-2 py-8">
          <Link
            href="/"
            className={cn(
              'relative flex w-full shrink-0 items-center justify-center rounded-lg py-2 transition duration-150 hover:bg-white/10 dark:hover:bg-white/10',
              isHomeActive
                ? 'text-white'
                : 'text-white/70',
            )}
            onClick={handleHomeClick}
          >
            <SquarePen className="cursor-pointer" />
            {isHomeActive && (
              <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-white" />
            )}
          </Link>
          <div className="flex w-full flex-1 flex-col items-center">
            <VerticalIconContainer>
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className={cn(
                    'relative flex flex-row items-center justify-center cursor-pointer hover:bg-white/10 dark:hover:bg-white/10 duration-150 transition w-full py-2 rounded-lg',
                    link.active ? 'text-white' : 'text-white/70',
                  )}
                >
                  <link.icon />
                  {link.active && (
                    <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-white" />
                  )}
                </Link>
              ))}
            </VerticalIconContainer>
          </div>
          <div className="mt-auto w-full px-1">
            <ThemeCycleButton />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-accent dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
        <Link
          href="/"
          className={cn(
            'relative flex flex-col items-center space-y-1 text-center w-full hover:bg-white/10 dark:hover:bg-white/10 rounded-lg py-2 transition duration-150',
            segments.length === 0 || segments.includes('c')
              ? 'text-white'
              : 'text-white/70',
          )}
          onClick={handleHomeClick}
        >
          {(segments.length === 0 || segments.includes('c')) && (
            <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-white" />
          )}
          <SquarePen />
          <p className="text-xs">Home</p>
        </Link>
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full hover:bg-white/10 dark:hover:bg-white/10 rounded-lg py-2 transition duration-150',
              link.active ? 'text-white' : 'text-white/70',
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
