// hooks/useGet.ts
import { useState, useEffect, useCallback, useRef } from "react";

type ApiFunction<T, Args extends unknown[]> = (...args: Args) => Promise<{ data: T }>;

interface UseGetState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
}

interface UseGetOptions {
  enabled?: boolean;        // set false to skip auto-fetch
  deps?: unknown[];         // re-fetch when these change
}

export function useGet<T, Args extends unknown[]>(
  apiFn: ApiFunction<T, Args>,
  args: Args,
  options: UseGetOptions = {}
) {
  const { enabled = true, deps = [] } = options;

  const [state, setState] = useState<UseGetState<T>>({
    data: undefined,
    loading: enabled,
    error: null,
  });

  // Keep a stable ref to the fn so it doesn't trigger re-fetches
  const apiFnRef = useRef(apiFn);
  apiFnRef.current = apiFn;

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data } = await apiFnRef.current(...args);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: undefined, loading: false, error: err as Error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  useEffect(() => {
    if (!enabled) return;
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fetch, ...deps]);

  return { ...state, refetch: fetch };
}