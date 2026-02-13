'use client';

import React, { ReactNode } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

interface SkeletonProviderProps {
  children: ReactNode;
}

/**
 * SkeletonProvider provides consistent skeleton loader colors across all themes.
 * Uses neutral colors that work well with all theme variations (white, black, rose).
 * This avoids hydration mismatches by not depending on client-side theme state.
 */
export function SkeletonProvider({ children }: SkeletonProviderProps) {
  return (
    <SkeletonTheme
      baseColor="rgb(228 228 231 / 0.3)"      // zinc-200 with opacity - works on all themes
      highlightColor="rgb(244 244 245 / 0.5)" // zinc-100 with opacity - works on all themes
      borderRadius="0.5rem"
      duration={1.5}
      enableAnimation={true}
    >
      {children}
    </SkeletonTheme>
  );
}
