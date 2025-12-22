import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';

export const metadata: Metadata = {
    title: '404: This page could not be found',
    description:
        'Oops! The page you are looking for does not exist. Find your way back home.',
};

const NotFound: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="fl-p-8/12 relative">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-blue-500"></div>
                        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500"></div>
                    </div>

                    {/* Content */}
                    <div className="relative space-y-8 text-center">
                        <h1 className="fl-text-8xl/9xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text font-bold text-transparent">
                            404
                        </h1>
                        <h2 className="fl-text-2xl/3xl font-bold text-gray-800">
                            Page Not Found
                        </h2>
                        <p className="mx-auto max-w-md text-gray-600">
                            Sorry, the page you are looking for could not be
                            found. It might have been moved or deleted.
                        </p>

                        {/* Store Section */}
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                While you're here, check out our store!
                            </h3>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
                                >
                                    <LuArrowLeft className="text-sm" />
                                    <span>Return Home</span>
                                </Link>
                                <a
                                    href="https://store.jagadhatrionline.co.in"
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
                                >
                                    <span>Visit Our Store</span>
                                    <LuArrowRight className="text-sm" />
                                </a>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Discover our collection of stationery, t-shirts,
                                hoodies, and more!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
