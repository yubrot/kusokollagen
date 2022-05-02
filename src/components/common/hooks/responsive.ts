/**
 * Hooks to obtain Tailwind CSS compatible media query information.
 * @module
 */

import { useEffect, useState } from 'react';

export interface Responsive {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
}

function computeResponsive(): Responsive {
  if (typeof window == 'undefined') {
    return { sm: false, md: false, lg: false, xl: false, xxl: false };
  }
  return {
    sm: window.matchMedia(`(min-width: 640px)`).matches,
    md: window.matchMedia(`(min-width: 768px)`).matches,
    lg: window.matchMedia(`(min-width: 1024px)`).matches,
    xl: window.matchMedia(`(min-width: 1280px)`).matches,
    xxl: window.matchMedia(`(min-width: 1536px)`).matches,
  };
}

export function useResponsive(): Responsive {
  const [responsive, setResponsive] = useState(computeResponsive);

  useEffect(() => {
    const update = () => setResponsive(computeResponsive());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return responsive;
}
