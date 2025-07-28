"use client";

import { useState, FormEvent, useId } from "react";
import { cn } from "@/utils/functions";
import Script from 'next/script';
import {
    LuCheck,
    LuPlus
} from "react-icons/lu";
import { BiLoaderAlt } from "react-icons/bi";
import { createRazorpayOrder } from "@/app/actions/razorpay";
import { submitModel } from "@/app/actions/model";
import Select from 'react-select';
import { loadRazorpayScript } from "@/utils/load-razorpay";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface FormData {
    pujaName: string;
    name: string;
    email: string;
    phone: string;
    amount: string;
    year: string;
}

type PlanId = "basic" | "premium";

type Plan = {
    id: PlanId;
    name: string;
    price: number;
    basicPrice?: number;
    description: string;
};

type Addon = {
    id: number;
    title: string;
    price: number;
    basicPrice?: number;
    applicableTo: PlanId | "both";
};

const plans: Plan[] = [
    {
        id: "premium",
        name: "Premium",
        price: 11999,
        basicPrice: 20999,
        description: "1 cinematic video, 3 reels (pre-puja, puja days, post-puja), Nabami + Dashami full day, pre-puja, drone + normal camera shoots."
    },
    {
        id: "basic",
        name: "Basic",
        price: 999,
        description: "1 cinematic reel covering Puja celebration & procession."
    },
];

const addons: Addon[] = [
    { id: 1, title: "Extra Reel Video", price: 1000, applicableTo: "basic" },
    { id: 2, title: "Pandal Drone Shoot", price: 1000, applicableTo: "basic" },
    { id: 3, title: "Nabami or Dashami Full-Day Shoot", price: 4000, applicableTo: "basic", basicPrice: 6000 },
    { id: 4, title: "Nabami or Dashami Half-Day Shoot", price: 2000, applicableTo: "basic", basicPrice: 3000 },
    { id: 5, title: "Idol Lifting + Immersion (Drone)", price: 4000, applicableTo: "basic" },
    { id: 6, title: "Idol Lifting + Procession + Immersion (Drone Combo)", price: 6000, applicableTo: "basic" },
    { id: 7, title: "Procession Drone Shoot", price: 1000, applicableTo: "basic" },
    { id: 8, title: "Pre-Puja Event Coverage", price: 1000, applicableTo: "basic" },
    { id: 9, title: "Idol Lifting (Drone Only)", price: 3000, applicableTo: "both" },
    { id: 10, title: "Voice-over Narration", price: 2000, applicableTo: "both" }
];

export default function CinematicsPlans({ pujaData, planId }: { pujaData: any, planId?: string }) {
    const [selectedPuja, setSelectedPuja] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(planId as PlanId ?? null);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [success, setSuccess] = useState<{ paymentId: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        pujaName: '',
        name: '',
        email: '',
        phone: '',
        amount: '',
        year: '',
    });
    const closeError = () => setError(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleAddon = (id: number) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };

    const selectedPujaData = pujaData.find((data: any) => data?.documentId === selectedPuja) ?? null;
    const existingData = selectedPujaData?.partnerships.find((partnership: any) => parseInt(partnership.year) === parseInt(formData.year) && partnership.fullPaid === false) ?? null;

    const planPrice = selectedPlan
        ? plans.find((p) => p.id === selectedPlan)?.price ?? 0
        : 0;

    const addonsPrice = selectedAddons.reduce((sum, id) => {
        const addon = addons.find((a) => a.id === id);
        return sum + (addon?.price ?? 0);
    }, 0);

    const total = existingData ? planPrice + addonsPrice - existingData.amount : planPrice + addonsPrice;

    const filteredAddons = addons.filter(
        (a) => selectedPlan && (a.applicableTo === selectedPlan || a.applicableTo === "both")
    );

    const pujaName = selectedPujaData?.name;
    const pujaDataOptions = pujaData.map((data: any) => ({ value: data.documentId, label: data.name }));

    const handlePayment = async (e: FormEvent) => {
        e.preventDefault();

        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
            setError('Failed to load Razorpay SDK');
            return;
        }

        if (!selectedPuja || !formData.name || !formData.email || !formData.phone) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setProcessing(true);
            const amountInPaise = Math.round(total * 100);

            const orderResponse = await createRazorpayOrder({
                ...formData,
                amount: amountInPaise,
            });

            if (!orderResponse.success) {
                throw new Error(orderResponse.error ?? 'Error creating order');
            }

            const options = {
                key: process.env.RAZORPAY_KEY_ID!,
                amount: amountInPaise.toString(),
                currency: "INR",
                name: "Jagadhatri Online",
                description: "Payment of ₹" + total + " for " + pujaName,
                order_id: orderResponse.orderId,
                notes: {
                    email: formData.email,
                    name: formData.name,
                    phone: formData.phone,
                    pujaName: pujaName,
                    year: formData.year,
                },
                handler: async function (response: any) {
                    setSuccess({ paymentId: response.razorpay_payment_id });
                    setProcessing(false);

                    const selectedPlanData = plans.find((p) => p.id === selectedPlan);
                    const addonDetails = selectedAddons
                        .map((id) => {
                            const addon = addons.find((a) => a.id === id);
                            return addon ? {
                                title: addon.title,
                                amount: addon.price,
                            } : null;
                        })
                        .filter(Boolean);

                    const formResult = await submitModel('partnerships', {
                        ...(!existingData ? {
                            puja: {
                                set: [selectedPuja],
                            },
                        } : {}),
                        year: formData.year,
                        amount: parseInt(total.toString()) + (existingData ? parseInt(existingData.amount.toString()) : 0),
                        email: formData.email,
                        name: formData.name,
                        orderId: existingData ? existingData.orderId.split(',').concat(response.razorpay_order_id).join(',') : response.razorpay_order_id,
                        paymentId: existingData ? existingData.paymentId.split(',').concat(response.razorpay_payment_id).join(',') : response.razorpay_payment_id,
                        phone: formData.phone,
                        planName: selectedPlanData?.name,
                        planValue: selectedPlanData?.price,
                        addons: addonDetails,
                        fullPaid: true,
                    }, existingData?.documentId);
                  
                    if (!formResult.success) {
                        console.error('Form submission failed:', formResult.error);
                    } else {
                        console.log('Form submission succeeded:', formResult.response);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                readonly: {
                    email: true,
                    contact: true
                },
                send_sms_hash: true,
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setProcessing(false);
            console.error('Payment failed!', err);

            // Extract message
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(message);
        }
    };

    return (
        <>
            {success && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                            <p className="text-gray-600 mb-4">Thank you for your payment.</p>
                            <p className="text-sm text-gray-500 mb-4">Payment ID: {success.paymentId}</p>
                            {/* <button
                                onClick={() => setSuccess(null)}
                                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Make Another Order
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-red-600 mb-4">Payment Failed</h3>
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 mb-4">
                            {error}
                        </pre>
                        <button
                            onClick={closeError}
                            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">JO Cinematics</h1>
                <section>
                    <h2 className="font-semibold mb-2">Select a Plan</h2>
                    <div className="flex flex-col gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "border rounded-lg p-4 w-full cursor-pointer",
                                    selectedPlan === plan.id
                                        ? "border-yellow-500 bg-gradient-to-br from-white to-yellow-50"
                                        : "border-neutral-200"
                                )}
                                onClick={() => {
                                    setSelectedPlan(plan.id);
                                    setSelectedAddons([]);
                                }}
                            >
                                <h3 className="text-lg font-bold">{plan.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                                <div className="flex items-center gap-2">
                                    <div className="text-yellow-600 font-bold">₹{plan.price}</div>
                                    {plan.basicPrice && <div className="text-sm text-gray-500 line-through">₹{plan.basicPrice}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {selectedPlan && (
                    <section>
                        <h2 className="font-semibold mb-2">Available Add-ons</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredAddons.map((addon) => (
                                <div
                                    key={addon.id}
                                    className={cn(
                                        "relative group border rounded-lg p-4 transition-all duration-200",
                                        selectedAddons.includes(addon.id)
                                            ? "border-yellow-500 bg-gradient-to-br from-white to-yellow-50"
                                            : "border-neutral-200"
                                    )}
                                >
                                    <div className="flex flex-col justify-center gap-3 text-left">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-md">{addon.title}</h3>
                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <div className="flex items-center gap-2">
                                                <div className="text-yellow-600 font-bold">₹{addon.price}</div>
                                                {addon.basicPrice && <div className="text-sm text-gray-500 line-through">₹{addon.basicPrice}</div>}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => toggleAddon(addon.id)}
                                                className={cn(
                                                    "flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer text-sm",
                                                    selectedAddons.includes(addon.id)
                                                        ? "bg-yellow-500 border-yellow-500 text-white shadow"
                                                        : "bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                                )}
                                                aria-pressed={selectedAddons.includes(addon.id)}
                                            >
                                                {selectedAddons.includes(addon.id) ? <LuCheck className="text-white size-4" /> : <LuPlus className="text-yellow-500 size-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label htmlFor="pujaName" className="block text-sm font-medium text-gray-700 mb-1">
                            Puja Committee Name <span className="text-red-500">*</span>
                        </label>
                        <Select
                            instanceId={useId()}
                            options={pujaDataOptions}
                            placeholder="Select a Puja"
                            onChange={(value: any) => setSelectedPuja(value?.value ?? null)}
                            className='w-full'
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    backgroundColor: 'white',
                                    borderColor: state.isFocused ? '#f59e42' : '#d1d5db', // yellow-500 or gray-300
                                    boxShadow: state.isFocused ? '0 0 0 1px #f59e42' : undefined,
                                    '&:hover': { borderColor: '#f59e42' },
                                    minHeight: '2.5rem',
                                    borderRadius: '0.375rem', // rounded-md
                                }),
                                valueContainer: (base) => ({
                                    ...base,
                                    color: '#374151', // text-gray-700
                                    fontSize: '0.95rem',
                                    paddingLeft: '0.75rem',
                                    paddingRight: '0.75rem',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: '#9ca3af', // text-gray-400
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 50,
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected
                                        ? '#f59e42' // bg-yellow-500
                                        : state.isFocused
                                        ? '#fef3c7' // bg-yellow-50
                                        : 'white',
                                    color: state.isSelected
                                        ? 'white'
                                        : '#374151', // text-gray-700
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                            Year <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="year"
                            name="year"
                            pattern="^\d{4}$"
                            inputMode="numeric" 
                            placeholder="YYYY"
                            value={formData.year}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            minLength={10}
                            maxLength={10}
                            value={formData.phone}
                            pattern="[0-9]{10}"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <section className="flex justify-between items-center pt-4">
                        <div className="text-lg font-bold">Total: ₹{total}</div>
                        <button
                            type="submit"
                            disabled={processing || !selectedPlan || total <= 0}
                            className={cn(
                                "px-4 py-2 rounded bg-yellow-500 text-white font-semibold cursor-pointer flex items-center justify-center gap-2",
                                !selectedPlan || total <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
                            )}
                        >
                            {processing ? (
                                <>
                                    <BiLoaderAlt className="animate-spin h-5 w-5" />
                                    Processing...
                                </>
                            ) : (
                                'Pay with Razorpay'
                            )}
                        </button>
                    </section>
                </form>
            </div>
        </>
    );
}
