'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { GlobalSite } from '@/types';

// Create the context for siteData
export const SiteDataContext = createContext<GlobalSite | null>(null);

// Provider component
export const SiteDataProvider = ({ 
  children, 
  siteData 
}: { 
  children: ReactNode, 
  siteData: GlobalSite 
}) => {
  return (
    <SiteDataContext.Provider value={siteData}>
      {children}
    </SiteDataContext.Provider>
  );
};

// Custom hook to use the siteData context
export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};