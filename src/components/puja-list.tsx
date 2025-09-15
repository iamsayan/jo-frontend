'use client';

import React, { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBolt, FaLocationDot, FaRegClock } from "react-icons/fa6";
import { MdOutline360 } from "react-icons/md";
import { getYear, getCelebrating, capitalizeFirst } from "@/utils/functions";
import TransformedImage from './transformed-image';
import { useDebounce } from 'use-debounce';
import { Puja } from '@/types';
import { LuAward, LuClockArrowUp, LuCone, LuMapPin, LuMedal, LuTrendingUp } from 'react-icons/lu';
import { Tooltip } from 'react-tooltip'
import placeholder from '@/public/logo.png'

export default function PujaList({ data }: { data: Puja[] }) {
    const [hydrated, setHydrated] = useState(false);
    const [search, setSearch] = useState('');
    const [value] = useDebounce(search, 400);
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data.filter((item: Puja) => item.name.toLowerCase().includes(value.toLowerCase())));
    }, [value]);

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
            <input
                type="text"
                className="bg-transparent mb-4 w-full py-2 px-3 border-b-2 border-slate-300 focus:border-blue-500 outline-none"
                placeholder="Search Puja"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 md:gap-4 gap-2">
                {filteredData.map((item: Puja, index: number) => {
                    //const isPlaceForPromotion = (index + 1) % 6 === 0;
                    const isPlaceForPromotion = false;
                    const y = getYear(item.estd);
                    const cel = getCelebrating(y);
                    const adi = item.tags.includes('adi') ?? false;
                    const popular = item.tags.includes('popular') ?? false;
                    const image = item.images?.[0];

                    const html = <Link href={`/puja/${item.slug}/${item.referenceId}`} key={index} className="bg-base-100 border border-base-content/10 grid grid-cols-5 sm:grid-cols-1">
                        <div className="relative aspect-[5/6] sm:aspect-[3/2] col-span-2 sm:col-span-1 overflow-hidden bg-gray-200">
                            {/* <span className="absolute uppercase bg-yellow-500 text-white font-bold text-[9px] sm:text-xs top-2 left-2 sm:py-1 sm:px-2 py-1/4 px-1 z-10">{y}</span> */}
                            {image ? <TransformedImage
                                src={`${image.year}/${item.referenceId}/${image.name}`}
                                width={500}
                                height={300}
                                className="w-full h-full object-cover"
                                priority={true}
                                quality={70}
                                alt={item.name}
                            /> : <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
                                <Image src={placeholder} alt="Placeholder" className="w-full h-full object-cover" />
                            </div>}
                        </div>
                        <div className="flex flex-col p-4 sm:p-6 gap-0 sm:gap-2 text-center col-span-3 justify-center relative">
                            <div className="block font-bold text-base sm:text-xl pb-1 sm:pb-2 truncate text-blue-900">{item.name}</div>
                            {/* <Link data-tooltip-id={`name-${item.referenceId}`} className="block font-bold text-base sm:text-xl pb-1 sm:pb-2 truncate text-blue-900" href={`/watch/`}>{item.name}</Link> */}
                            {/* <Tooltip id={`name-${item.referenceId}`} content={item.name} /> */}
                            <div className="text-[10px] sm:text-xs flex gap-1 items-center justify-center">
                                <span className="-mt-0.5"><LuMapPin className="inline text-green-600" /></span>
                                <span className="truncate">{item.location.address ? item.location.address : capitalizeFirst(item.zone) + ', Hooghly'}</span>
                            </div>
                            <div className="text-[10px] sm:text-xs flex gap-1 items-center justify-center">
                                <span className="-mt-0.5"><LuClockArrowUp className="inline text-red-600" /></span>
                                <span className="truncate">{item.estd == 0 ? 'Not Known' : y + ' Years'}</span>
                            </div>
                            <div className="text-xs flex gap-1 items-center justify-center">
                                <span className="-mt-0.5"><LuCone className="inline text-purple-600"/></span>
                                <span className="truncate">Theme: {item.theme ? item.theme : 'Not Known'}</span>
                            </div>
                            <div className="text-xs flex gap-2 items-center justify-center mt-2 hidden sm:block">
                                {popular && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded-md whitespace-nowrap">
                                        <LuMedal className="text-amber-500" />
                                        Popular
                                    </span>
                                )}
                                {adi && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-purple-700 bg-purple-100 rounded-md whitespace-nowrap">
                                        <LuAward className="text-purple-500" />
                                        Adi Puja
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-slate-700 bg-slate-100 rounded-md whitespace-nowrap">
                                    <LuTrendingUp className="text-slate-500" />
                                    Featured
                                </span>
                            </div>
                            {/* <button className="btn btn-soft btn-primary mt-2">Primary</button> */}
{/* <button className="btn btn-soft btn-secondary mt-2">Secondary</button> */}
                            {/* <div className="text-xs flex gap-2 items-center justify-center">
                                {item.info}
                            </div> */}
                            {/* <Link href={`/watch/${item.referenceId}`} className="inline-flex items-center justify-center mt-3 bg-green-600 hover:bg-green-700 text-white text-[10px] sm:text-sm shadow w-24 sm:w-32 self-center uppercase py-1 sm:py-2"><MdOutline360 className="size-3 sm:size-5 mr-2" />360° View</Link> */}
                        </div>
                    </Link>;

                    return isPlaceForPromotion ?
                        <Fragment key={index}>
                            <div className="bg-base-100 shadow-md hidden sm:block overflow-hidden">
                                {/* <Image src={slider2} alt="Jagadhatri Online" className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110" /> */}
                            </div>
                            {html}
                        </Fragment> :
                        html;
                })}
            </div>
        </>
    );
}