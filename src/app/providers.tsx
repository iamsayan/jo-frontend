'use client';

import CommandBar from '@/components/command-bar';
import { SiteDataProvider } from '@/contexts/site-data-provider';
import type { GlobalSite } from '@/types';
import { ProgressProvider } from '@bprogress/next/app';

interface ProvidersProps {
  children: React.ReactNode;
  siteData: GlobalSite;
}

const Providers = ({ children, siteData }: ProvidersProps) => {
  return (
    <SiteDataProvider siteData={siteData}>
      <ProgressProvider options={{ showSpinner: false }} disableStyle>
        <CommandBar>{children}</CommandBar>
      </ProgressProvider>
    </SiteDataProvider>
  );
};

export default Providers;
