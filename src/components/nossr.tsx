import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

// Define the type for the props of the NoSsr component
interface NoSsrProps {
  children: ReactNode;
}

// Define the NoSsr functional component
const NoSsr: React.FC<NoSsrProps> = ({ children }) => <>{children}</>;

// Export the NoSsr component with dynamic import, disabling server-side rendering
export default dynamic(() => Promise.resolve(NoSsr), { ssr: false });
