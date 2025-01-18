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
  const config = await fetchAppConfig();
  localStorage.setItem('appConfig', JSON.stringify(config));
};

export const getAppConfig = () => {
  const storedConfig = localStorage.getItem('appConfig');
  return JSON.parse(storedConfig ?? '{}');
};

export default useAppConfig;
