'use client';

import { useEffect } from 'react';
import { ProgressProvider } from '@bprogress/next/app';
import runOneSignal from '@/lib/onesignal';
import CommandBar from '@/components/command-bar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    runOneSignal();
  }, []);

  return (
    <>
      <ProgressProvider
        options={{ showSpinner: false }}
        disableStyle
      >
        <CommandBar>
          {children}
        </CommandBar>
      </ProgressProvider>
    </>
  );
};

export default Providers;