"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdUnitClientProps {
  children: ReactNode;
}

const GoogleAdUnitClient: React.FC<GoogleAdUnitClientProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [pathname, searchParams]);

  return <div className="google-ad">{children}</div>;
};

export default GoogleAdUnitClient;
