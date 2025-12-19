'use client';

import { useState, FormEvent, useId } from 'react';
import { cn } from '@/utils/functions';
import { LuCheck, LuPlus } from 'react-icons/lu';
import Select from 'react-select';
import { BiLoaderAlt } from 'react-icons/bi';
import { createRazorpayOrder } from '@/app/actions/razorpay';
import { submitModel } from '@/app/actions/model';
import { loadRazorpayScript } from '@/utils/load-razorpay';
import type { Partnership, PujaExtended } from '@/types';

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

type PlanId = 'basic' | 'premium';

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
    applicableTo: PlanId | 'both';
};

const plans: Plan[] = [
    {
        id: 'premium',
        name: 'Premium',
        price: 11999,
        basicPrice: 20999,
        description:
            '1 cinematic video, 3 reels (pre-puja, puja days, post-puja), Nabami + Dashami full day, pre-puja, drone + normal camera shoots.',
    },
    {
        id: 'basic',
        name: 'Basic',
        price: 999,
        description: '1 cinematic reel covering Puja celebration & procession.',
    },
];

const addons: Addon[] = [
    { id: 1, title: 'Extra Reel Video', price: 1000, applicableTo: 'basic' },
    { id: 2, title: 'Pandal Drone Shoot', price: 1000, applicableTo: 'basic' },
    {
        id: 3,
        title: 'Nabami or Dashami Full-Day Shoot',
        price: 4000,
        applicableTo: 'basic',
        basicPrice: 6000,
    },
    {
        id: 4,
        title: 'Nabami or Dashami Half-Day Shoot',
        price: 2000,
        applicableTo: 'basic',
        basicPrice: 3000,
    },
    {
        id: 5,
        title: 'Idol Lifting + Immersion (Drone)',
        price: 4000,
        applicableTo: 'basic',
    },
    {
        id: 6,
        title: 'Immersion Drone Shoot',
        price: 1000,
        applicableTo: 'basic',
    },
    {
        id: 7,
        title: 'Procession Drone Shoot',
        price: 1000,
        applicableTo: 'basic',
    },
    {
        id: 8,
        title: 'Pre-Puja Event Coverage',
        price: 1000,
        applicableTo: 'basic',
    },
    {
        id: 9,
        title: 'Idol Lifting (Drone Only)',
        price: 3000,
        applicableTo: 'both',
    },
    {
        id: 10,
        title: 'Voice-over Narration',
        price: 2000,
        applicableTo: 'both',
    },
];

export default function CinematicsPlans({
    pujaData,
    planId,
}: {
    pujaData: PujaExtended[];
    planId?: string;
}) {
    const [selectedPuja, setSelectedPuja] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(
        (planId as PlanId) ?? null,
    );
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [success, setSuccess] = useState<{ paymentId: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleAddon = (id: number) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
        );
    };

    const selectedPujaData =
        pujaData.find(
            (data: PujaExtended) => data.documentId === selectedPuja,
        ) ?? null;
    const existingData =
        selectedPujaData?.partnerships?.find(
            (partnership: Partnership) =>
                parseInt(String(partnership.year)) ===
                    parseInt(formData.year) && partnership.fullPaid === false,
        ) ?? null;

    const planPrice = selectedPlan
        ? (plans.find((p: Plan) => p.id === selectedPlan)?.price ?? 0)
        : 0;

    const addonsPrice = selectedAddons.reduce((sum, id) => {
        const addon = addons.find((a) => a.id === id);
        return sum + (addon?.price ?? 0);
    }, 0);

    const total = existingData
        ? planPrice + addonsPrice - existingData.amount
        : planPrice + addonsPrice;

    const filteredAddons = addons.filter(
        (a) =>
            selectedPlan &&
            (a.applicableTo === selectedPlan || a.applicableTo === 'both'),
    );

    const pujaName = selectedPujaData?.name ?? '';
    const pujaDataOptions = pujaData.map((data: PujaExtended) => ({
        value: data.documentId,
        label: data.name,
    }));

    const handlePayment = async (e: FormEvent) => {
        e.preventDefault();

        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
            setError('Failed to load Razorpay SDK');
            return;
        }

        if (
            !selectedPuja ||
            !formData.name ||
            !formData.email ||
            !formData.phone
        ) {
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
                currency: 'INR',
                name: 'Jagadhatri Online',
                description: 'Payment of ₹' + total + ' for ' + pujaName,
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

                    const selectedPlanData = plans.find(
                        (p) => p.id === selectedPlan,
                    );
                    const addonDetails = selectedAddons
                        .map((id) => {
                            const addon = addons.find((a) => a.id === id);
                            return addon
                                ? {
                                      title: addon.title,
                                      amount: addon.price,
                                  }
                                : null;
                        })
                        .filter(Boolean);

                    const formResult = await submitModel(
                        'partnerships',
                        {
                            ...(!existingData
                                ? {
                                      puja: {
                                          set: [selectedPuja],
                                      },
                                  }
                                : {}),
                            year: formData.year,
                            amount:
                                parseInt(total.toString()) +
                                (existingData
                                    ? parseInt(existingData.amount.toString())
                                    : 0),
                            email: formData.email,
                            name: formData.name,
                            orderId: existingData?.orderId
                                ? existingData.orderId
                                      .split(',')
                                      .concat(response.razorpay_order_id)
                                      .join(',')
                                : response.razorpay_order_id,
                            paymentId: existingData?.paymentId
                                ? existingData.paymentId
                                      .split(',')
                                      .concat(response.razorpay_payment_id)
                                      .join(',')
                                : response.razorpay_payment_id,
                            phone: formData.phone,
                            planName: selectedPlanData?.name,
                            planValue: selectedPlanData?.price,
                            addons: addonDetails,
                            fullPaid: true,
                        },
                        existingData?.documentId,
                    );

                    if (!formResult.success) {
                        console.error(
                            'Form submission failed:',
                            formResult.error,
                        );
                    } else {
                        console.log(
                            'Form submission succeeded:',
                            formResult.response,
                        );
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    },
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                readonly: {
                    email: true,
                    contact: true,
                },
                send_sms_hash: true,
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setProcessing(false);
            console.error('Payment failed!', err);

            // Extract message
            const message =
                err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred';
            setError(message);
        }
    };

    return (
        <>
            {success && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    className="h-8 w-8 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-green-600">
                                Payment Successful!
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Thank you for your payment.
                            </p>
                            <p className="mb-4 text-sm text-gray-500">
                                Payment ID: {success.paymentId}
                            </p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-xl font-bold text-red-600">
                            Payment Failed
                        </h3>
                        <pre className="mb-4 text-sm whitespace-pre-wrap text-gray-700">
                            {error}
                        </pre>
                        <button
                            onClick={closeError}
                            className="w-full rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="mx-auto space-y-8">
                <h1 className="text-center text-3xl font-bold">
                    JO Cinematics
                </h1>
                <section>
                    <h2 className="mb-2 font-semibold">Select a Plan</h2>
                    <div className="flex flex-col gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    'w-full cursor-pointer rounded-lg border p-4',
                                    selectedPlan === plan.id
                                        ? 'border-yellow-500 bg-gradient-to-br from-white to-yellow-50'
                                        : 'border-neutral-200',
                                )}
                                onClick={() => {
                                    setSelectedPlan(plan.id);
                                    setSelectedAddons([]);
                                }}
                            >
                                <h3 className="text-lg font-bold">
                                    {plan.name}
                                </h3>
                                <p className="mb-2 text-sm text-gray-600">
                                    {plan.description}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="font-bold text-yellow-600">
                                        ₹{plan.price}
                                    </div>
                                    {plan.basicPrice && (
                                        <div className="text-sm text-gray-500 line-through">
                                            ₹{plan.basicPrice}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {selectedPlan && (
                    <section>
                        <h2 className="mb-2 font-semibold">
                            Available Add-ons
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {filteredAddons.map((addon) => (
                                <div
                                    key={addon.id}
                                    className={cn(
                                        'group relative rounded-lg border p-4 transition-all duration-200',
                                        selectedAddons.includes(addon.id)
                                            ? 'border-yellow-500 bg-gradient-to-br from-white to-yellow-50'
                                            : 'border-neutral-200',
                                    )}
                                >
                                    <div className="flex flex-col justify-center gap-3 text-left">
                                        <h3 className="sm:text-md text-sm font-semibold text-gray-800">
                                            {addon.title}
                                        </h3>
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-yellow-600">
                                                    ₹{addon.price}
                                                </div>
                                                {addon.basicPrice && (
                                                    <div className="text-sm text-gray-500 line-through">
                                                        ₹{addon.basicPrice}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleAddon(addon.id)
                                                }
                                                className={cn(
                                                    'flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-sm transition-all duration-200',
                                                    selectedAddons.includes(
                                                        addon.id,
                                                    )
                                                        ? 'border-yellow-500 bg-yellow-500 text-white shadow'
                                                        : 'border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50',
                                                )}
                                                aria-pressed={selectedAddons.includes(
                                                    addon.id,
                                                )}
                                            >
                                                {selectedAddons.includes(
                                                    addon.id,
                                                ) ? (
                                                    <LuCheck className="size-4 text-white" />
                                                ) : (
                                                    <LuPlus className="size-4 text-yellow-500" />
                                                )}
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
                        <label
                            htmlFor="pujaName"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Puja Committee Name{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <Select
                            instanceId={useId()}
                            options={pujaDataOptions}
                            placeholder="Select a Puja"
                            onChange={(value: any) =>
                                setSelectedPuja(value.value ?? null)
                            }
                            className="w-full"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    backgroundColor: 'white',
                                    borderColor: state.isFocused
                                        ? '#f59e42'
                                        : '#d1d5db', // yellow-500 or gray-300
                                    boxShadow: state.isFocused
                                        ? '0 0 0 1px #f59e42'
                                        : undefined,
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
                        <label
                            htmlFor="year"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            WhatsApp Number{' '}
                            <span className="text-red-500">*</span>
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email Address{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>
                    <section className="flex items-center justify-between pt-4">
                        <div className="text-lg font-bold">Total: ₹{total}</div>
                        <button
                            type="submit"
                            disabled={processing || !selectedPlan || total <= 0}
                            className={cn(
                                'flex cursor-pointer items-center justify-center gap-2 rounded bg-yellow-500 px-4 py-2 font-semibold text-white',
                                !selectedPlan || total <= 0
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:bg-yellow-600',
                            )}
                        >
                            {processing ? (
                                <>
                                    <BiLoaderAlt className="h-5 w-5 animate-spin" />
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
