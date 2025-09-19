'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuArrowRight, LuCalendar, LuCrown, LuHistory, LuMedal, LuStar } from 'react-icons/lu';
import TransformedImage from '@/components/transformed-image';
import { useDebounce } from 'use-debounce';
import { PujaExtended } from '@/types';

import placeholder from '@/public/logo.png'

type Filter = 'all' | 'popular' | 'jubilee' | 'preJubilee' | 'adi';

export default function PujaList({ data }: { data: PujaExtended[] }) {
    const [hydrated, setHydrated] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Filter>('all');
    const [value] = useDebounce(search, 400);
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data.filter((item: PujaExtended) =>
            [item.name, item.year, item.theme].some((val: any) => String(val).toLowerCase().includes(value.toLowerCase()))
        ));
    }, [value]);

    useEffect(() => {
        setFilteredData(filter === 'all' ? data : data.filter((item: PujaExtended) => item[filter]));
    }, [filter]);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex w-full flex-col gap-4">
                        <div className="skeleton h-32 w-full"></div>
                        <div className="skeleton h-4 w-28"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <input type="text" placeholder="Search by name, year, theme..." className="input w-full !outline-none border-gray-200 !shadow-none" onChange={(e) => {
                    setSearch(e.target.value);
                }} />
                <select defaultValue="all" className="select !outline-none border-gray-200 !shadow-none" onChange={(e) => {
                    setFilter(e.target.value as Filter);
                }}>
                    <option value="all">All</option>
                    <option value="popular">Popular</option>
                    <option value="jubilee">Jubilees</option>
                    <option value="preJubilee">Pre Jubilees</option>
                    <option value="adi">Adi Puja</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 gap-2">
                {filteredData.map((item: PujaExtended, index: number) => {
                    const image = item.images?.[0];
                    return (
                        <Fragment key={item.referenceId}>
                            <Link
                                href={`/puja/${item.slug}/${item.referenceId}`}
                                className="group bg-white/90 backdrop-blur-sm pgg-6 rounded-2xl shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/60 transition-all duration-300 border border-blue-100/30 hover:border-blue-200/50"
                            >
                                <div className="relative aspect-[3/2] col-span-2 sm:col-span-1 overflow-hidden bg-gray-200 rounded-t-xl">
                                    {/* <span className="absolute uppercase bg-yellow-500 text-white font-bold text-[9px] sm:text-xs top-2 left-2 sm:py-1 sm:px-2 py-1/4 px-1 z-10 rounded-full">{item.year}</span> */}
                                    {image ? (
                                        <div className="relative w-full h-full">
                                            <TransformedImage
                                                src={`${image.year}/${item.referenceId}/${image.name}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                                priority={index < 4}
                                                quality={80}
                                                alt={item.name}
                                            // grayscale={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-t-xl">
                                            <Image
                                                src={placeholder}
                                                alt={`${item.name} placeholder`}
                                                className="w-30"
                                                priority={false}
                                            />
                                            <div className="mt-4 text-center">
                                                <p className="text-gray-400 text-sm font-medium">No Image Available</p>
                                                <p className="text-gray-300 text-xs mt-1">Coming Soon</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col gap-4 justify-between">
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 overflow-hidden">
                                                <h3 className="text-left text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1 truncate">
                                                    {item.address}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {item.popular && (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                                                        <LuStar className="w-3 h-3" />
                                                        Popular
                                                    </span>
                                                )}
                                                {item.adi && (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                                        <LuCrown className="w-3 h-3" />
                                                        Adi
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm h-6">
                                                <LuHistory className="text-blue-600" />
                                                <span className="text-gray-700">
                                                    {item.year ? `${item.year} years` : 'Not Known'}
                                                    {item.jubilee && (
                                                        <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full">
                                                            <LuMedal className="w-3 h-3" />
                                                            {item.celebrating}
                                                        </span>
                                                    )}
                                                    {item.preJubilee && (
                                                        <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-orange-100 text-blue-700 rounded-full">
                                                            <LuMedal className="w-3 h-3" />
                                                            {item.celebrating}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <LuCalendar className="text-blue-600" />
                                                <span className="text-gray-700">
                                                    ESTD {item.estd}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-blue-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">View Details</span>
                                            <LuArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Fragment>
                    );
                })}
            </div>
        </>
    );
}