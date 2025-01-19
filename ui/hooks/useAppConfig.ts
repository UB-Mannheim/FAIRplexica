'use client';

import { useEffect } from 'react';

const useAppConfig = () => {
  useEffect(() => {
    syncAppConfig();
  }, []);

  return getAppConfig();
};

const fetchAppConfig = async () => {
  const res = await fetch('/api/config');
  const data = await res.json();
  return data;
};

const syncAppConfig = async () => {
  const config = getAppConfig();
  if (Object.keys(config).length === 0 && typeof window !== 'undefined') {
    const config = await fetchAppConfig();
    localStorage.setItem('appConfig', JSON.stringify(config));
  }
};

export const getAppConfig = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  const storedConfig = localStorage.getItem('appConfig');
  return JSON.parse(storedConfig ?? '{}');
};

export default useAppConfig;
