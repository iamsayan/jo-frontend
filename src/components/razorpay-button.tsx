'use client';

import React, { useRef, useEffect } from 'react';

interface RazorPayButtonProps {
    buttonId: string;
}

const RazorPayButton: React.FC<RazorPayButtonProps> = ({ buttonId }) => {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
        script.async = true;
        script.setAttribute('data-payment_button_id', buttonId);

        if (formRef.current) {
            formRef.current.appendChild(script);
        }
    }, [buttonId]);

    return <form ref={formRef} data-prevent-progress={true}></form>;
};

export default RazorPayButton;