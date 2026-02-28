'use client';

import { useState, useEffect } from 'react';

/**
 * Client-only search params hook that never suspends.
 * Use instead of next/navigation useSearchParams for static export compatibility.
 */
export function useSearchParamsClient(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    const update = () => setParams(new URLSearchParams(window.location.search));
    update();

    window.addEventListener('popstate', update);

    // Detect client-side navigation (pushState/replaceState)
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      origPush.apply(this, args);
      update();
    };
    history.replaceState = function (...args) {
      origReplace.apply(this, args);
      update();
    };

    return () => {
      window.removeEventListener('popstate', update);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  return params;
}
