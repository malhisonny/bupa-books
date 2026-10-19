import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchBookOwners } from '../api/bookOwners';
import type { BookOwner } from '../types';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export function useBookOwners() {
  const [owners, setOwners] = useState<BookOwner[] | null>(null);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // Cancel any in-flight request so a slow older response can't overwrite a newer one.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    try {
      const data = await fetchBookOwners(controller.signal);
      setOwners(data);
      setStatus('success');
    } catch {
      if (controller.signal.aborted) return;
      setStatus('error');
    }
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { owners, status, load };
}
