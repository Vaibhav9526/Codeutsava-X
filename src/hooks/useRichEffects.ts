'use client';

import { useEffect, useState } from 'react';

const RICH_EFFECTS_QUERY =
  '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function useRichEffects() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(RICH_EFFECTS_QUERY);
    const update = () => setEnabled(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return enabled;
}
