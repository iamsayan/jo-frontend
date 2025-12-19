'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
// @ts-ignore
import { FacebookProvider, Comments as FBComments } from 'react-facebook';

const Comments: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="mt-6">
            <FacebookProvider
                appId={process.env.NEXT_PUBLIC_FB_APP_ID as string}
                version="v19.0"
                autoLogAppEvents={true}
                xfbml={true}
                language="en_GB"
            >
                <FBComments
                    href={`${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`}
                    width="100%"
                    orderBy="reverse_time"
                />
            </FacebookProvider>
        </div>
    );
};

export default Comments;
