import React, { Suspense } from "react";
import GoogleAdUnitClient from "@/components/adunitclient";

interface GoogleAdUnitProps extends React.HTMLAttributes<HTMLElement> {
    "data-ad-client"?: string;
}

const GoogleAdUnit: React.FC<GoogleAdUnitProps> = (props) => {
    return (
        <Suspense fallback={<div className="skeleton w-full h-16"></div>}>
            <GoogleAdUnitClient>
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
                    {...props}
                ></ins>
            </GoogleAdUnitClient>
        </Suspense>
    );
};

export default GoogleAdUnit;
