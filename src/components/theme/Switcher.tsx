'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Select from '../ui/Select';

type Theme = 'dark' | 'light' | 'system';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const handleThemeSwitch = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid Hydration Mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Select
      className={className}
      value={theme ?? 'system'}
      onChange={(e) => handleThemeSwitch(e.target.value as Theme)}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System' },
      ]}
    />
  );
};

export default ThemeSwitcher;
