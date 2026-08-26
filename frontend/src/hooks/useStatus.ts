import { useEffect } from 'react';
import { useKeyStore } from '../store/useKeyStore';
import { Provider } from '../types';

export const useStatus = (provider: Provider) => {
  const { statuses, checkStatus, keys } = useKeyStore();

  useEffect(() => {
    if (keys[provider] && keys[provider].length > 0) {
      checkStatus(provider);
    }
  }, [keys[provider]?.length]);

  return statuses[provider] || 'unknown';
};
