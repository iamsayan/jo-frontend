'use client';

import { ReactNode, createContext, useContext } from 'react';

import type { GlobalSite } from '@/types';

// Create the context for siteData
export const SiteDataContext = createContext<GlobalSite | null>(null);

// Provider component
export function SiteDataProvider({
  children,
  siteData,
}: {
  children: ReactNode;
  siteData: GlobalSite;
}) {
  return <SiteDataContext value={siteData}>{children}</SiteDataContext>;
}

// Custom hook to use the siteData context
export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
