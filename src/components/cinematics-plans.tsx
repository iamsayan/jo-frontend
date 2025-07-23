"use client";

import { useState, FormEvent } from "react";
import { cn } from "@/utils/functions";
import Script from 'next/script';
import {
    LuCheck,
    LuPlus
} from "react-icons/lu";
import { BiLoaderAlt } from "react-icons/bi";
import { createRazorpayOrder } from "@/app/actions/razorpay";
import { submitForm } from "@/app/actions/form";

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

    const planPrice = selectedPlan
        ? plans.find((p) => p.id === selectedPlan)?.price ?? 0
        : 0;

    const addonsPrice = selectedAddons.reduce((sum, id) => {
        const addon = addons.find((a) => a.id === id);
        return sum + (addon?.price ?? 0);
    }, 0);

    const total = planPrice + addonsPrice;

    const filteredAddons = addons.filter(
        (a) => selectedPlan && (a.applicableTo === selectedPlan || a.applicableTo === "both")
    );

    const handlePayment = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
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
                description: "Payment of ₹" + total + " for " + formData.pujaName,
                order_id: orderResponse.orderId,
                notes: {
                    email: formData.email,
                    name: formData.name,
                    phone: formData.phone,
                    pujaName: formData.pujaName,
                    year: formData.year,
                },
                handler: async function (response: any) {
                    console.log(response);
                    setSuccess({ paymentId: response.razorpay_payment_id });
                    setProcessing(false);

                    const selectedPlanData = plans.find((p) => p.id === selectedPlan);
                    const planDetails = selectedPlanData ? `${selectedPlanData.name} - ₹${selectedPlanData.price}` : '';
                    
                    const addonDetails = selectedAddons
                        .map((id) => {
                            const addon = addons.find((a) => a.id === id);
                            return addon ? `${addon.title} - ₹${addon.price}` : '';
                        })
                        .filter(Boolean);

                    const formResult = await submitForm({
                        pujaName: formData.pujaName,
                        year: formData.year,
                        plan: planDetails,
                        addons: addonDetails,
                        amount: total,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                    }, 'bd6e259d592acb2fbec4c44fbfbaad8b7cadaca1');
                  
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
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="beforeInteractive"
            />
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
                            <p className="text-gray-600 mb-4">Thank you for your order.</p>
                            <p className="text-sm text-gray-500 mb-4">Payment ID: {success.paymentId}</p>
                            {/* <button
                                onClick={() => window.location.reload()}
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
                        <input
                            type="text"
                            list="pujaNameList"
                            id="pujaName"
                            name="pujaName"
                            value={formData.pujaName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            required
                        />
                        <datalist id="pujaNameList">
                            {pujaData.map((data: any) => (
                                <option key={data.referenceId} value={data.name} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                            Serving Year <span className="text-red-500">*</span>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <section className="flex justify-between items-center pt-4">
                        <div className="text-lg font-bold">Total: ₹{total}</div>
                        <button
                            type="submit"
                            disabled={processing || !selectedPlan}
                            className={cn(
                                "px-4 py-2 rounded bg-yellow-500 text-white font-semibold cursor-pointer flex items-center justify-center gap-2",
                                !selectedPlan ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
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
