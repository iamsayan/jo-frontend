'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '@/public/logo.png';
import circleLogo from '@/public/circle-logo.png';
import { cn, getDateByIndex } from '@/utils/functions';
import { useKBar } from 'kbar';
import { LuAlignLeft, LuSearch, LuShoppingBag, LuGift } from 'react-icons/lu';
import { sendGTMEvent } from '@next/third-parties/google';
import { useSiteData } from '@/contexts/siteDataContext';

interface MenuItem {
    name: string;
    path: string;
    target?: '_blank' | '_self';
    subMenu?: MenuItem[];
    className?: string;
}

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const { query } = useKBar();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const siteData = useSiteData();

    useEffect(() => {
        sendGTMEvent({ event: 'page_view', value: pathname });

        const controller = new AbortController();
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 5);
        };

        handleScroll();
        setIsInitialized(true);

        window.addEventListener('scroll', handleScroll, {
            signal: controller.signal,
        });

        return () => controller.abort();
    }, [pathname]);

    const currentYear = useMemo(
        () =>
            getDateByIndex(siteData?.schedules, 0)?.getFullYear() ||
            new Date().getFullYear(),
        [siteData?.schedules],
    );

    const items: MenuItem[] = [
        { name: 'Home', path: '/' },
        { name: 'History', path: '/puja-history' },
        {
            name: 'Gallery',
            path: '/gallery',
            subMenu: [
                { name: '2024', path: '/gallery/2024' },
                { name: '2023', path: '/gallery/2023' },
            ],
        },
        {
            name: 'Jagadhatri Puja',
            path: '/jagadhatri-puja',
            subMenu: Array.from({ length: 3 }, (_, i) => {
                const year = currentYear - i;
                return {
                    name: year.toString(),
                    path: `/jagadhatri-puja/${year}`,
                };
            }),
        },
        { name: 'Puja List', path: '/puja-committee-list' },
        {
            name: 'Links',
            path: '#',
            subMenu: [
                { name: 'Achievements', path: '/achievements' },
                { name: 'Hoimontika Somman', path: '/hoimontika-somman' },
                { name: `JO Cinematics ${currentYear}`, path: '/cinematics' },
                // { name: '360° Virtual Tours', path: 'https://vr.jagadhatrionline.co.in/', target: '_blank' }
            ],
            className: 'w-52',
        },
    ];

    return (
        <header className="relative z-10 bg-transparent">
            {isInitialized && (
                <div
                    className={`navbar-container fixed top-0 left-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'animate-slide-down border-b-[1px] border-gray-300 bg-white shadow-xs' : 'border-b-[1px] border-[#ffffff14] bg-transparent'}`}
                >
                    <div className="navbar fl-px-5/0 container mx-auto">
                        <div className="navbar-start">
                            <div className="dropdown">
                                <label
                                    tabIndex={0}
                                    className={cn(
                                        'cursor-pointer p-0 lg:hidden',
                                        !isScrolled && 'text-white',
                                    )}
                                >
                                    <LuAlignLeft className="size-5" />
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-56 p-2 shadow-sm"
                                >
                                    {items.map((item, index) => (
                                        <li key={index}>
                                            {item.subMenu ? (
                                                <details>
                                                    <summary className="font-bold">
                                                        {item.path !== '#' ? (
                                                            <Link
                                                                href={item.path}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ) : (
                                                            item.name
                                                        )}
                                                    </summary>
                                                    <ul className="p-2">
                                                        {item.subMenu.map(
                                                            (
                                                                subItem,
                                                                subIndex,
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        subIndex
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={
                                                                            subItem.path
                                                                        }
                                                                        target={
                                                                            subItem.target ??
                                                                            '_self'
                                                                        }
                                                                        className="font-bold"
                                                                    >
                                                                        {
                                                                            subItem.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </details>
                                            ) : (
                                                <Link
                                                    href={item.path}
                                                    className="font-bold"
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                    {/* Store */}
                                    <li className="mt-2">
                                        <a
                                            href="https://store.jagadhatrionline.co.in"
                                            target="_blank"
                                            className="group relative flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white"
                                        >
                                            <LuShoppingBag className="text-lg" />
                                            <span>Store</span>
                                            <LuGift className="absolute top-1/2 right-2 -translate-y-1/2 animate-bounce text-yellow-300" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="hidden lg:block">
                                <Link href="/">
                                    <Image
                                        src={isScrolled ? circleLogo : logo}
                                        alt="Jagadhatri Online Logo"
                                        className={
                                            isScrolled
                                                ? 'size-10'
                                                : 'h-12 w-auto py-1'
                                        }
                                        priority={true}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="navbar-center">
                            <div className="lg:hidden">
                                <Link href="/">
                                    <Image
                                        src={isScrolled ? circleLogo : logo}
                                        alt="Jagadhatri Online Logo"
                                        className={
                                            isScrolled
                                                ? 'size-10'
                                                : 'h-12 w-auto py-1'
                                        }
                                        priority={true}
                                    />
                                </Link>
                            </div>
                            <ul className="menu menu-horizontal hidden gap-2 px-1 font-bold uppercase lg:flex">
                                {items.map((item, index) => {
                                    const isActive =
                                        pathname === item.path ||
                                        item.subMenu?.some(
                                            (subItem) =>
                                                pathname === subItem.path,
                                        );
                                    const classes = cn(
                                        isScrolled
                                            ? 'text-slate-600'
                                            : 'text-slate-300 focus:!text-white focus:!bg-transparent focus:!text-yellow-500 active:!bg-transparent',
                                        isActive && '!text-yellow-500',
                                    );
                                    return (
                                        <li key={index}>
                                            {item.subMenu ? (
                                                <details>
                                                    <summary
                                                        className={classes}
                                                    >
                                                        {item.path !== '#' ? (
                                                            <Link
                                                                href={item.path}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ) : (
                                                            item.name
                                                        )}
                                                    </summary>
                                                    <ul
                                                        className={cn(
                                                            'right-0 w-28 p-2 text-slate-600',
                                                            item.className,
                                                        )}
                                                    >
                                                        {item.subMenu.map(
                                                            (
                                                                subItem,
                                                                subIndex,
                                                            ) => {
                                                                const innerClasses =
                                                                    cn(
                                                                        !isScrolled &&
                                                                            'text-slate-600',
                                                                        pathname ===
                                                                            subItem.path &&
                                                                            '!text-yellow-500',
                                                                    );
                                                                return (
                                                                    <li
                                                                        key={
                                                                            subIndex
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.path
                                                                            }
                                                                            target={
                                                                                subItem.target ??
                                                                                '_self'
                                                                            }
                                                                            className={
                                                                                innerClasses
                                                                            }
                                                                        >
                                                                            {
                                                                                subItem.name
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            },
                                                        )}
                                                    </ul>
                                                </details>
                                            ) : (
                                                <Link
                                                    href={item.path}
                                                    target={
                                                        item.target ?? '_self'
                                                    }
                                                    className={classes}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="navbar-end flex gap-3">
                            <div
                                className="cursor-pointer"
                                onClick={query.toggle}
                                title="Search"
                            >
                                <LuSearch
                                    className={`size-5 ${isScrolled ? '' : 'text-white'}`}
                                />
                            </div>
                            {/* <div className="hidden lg:block relative group">
                                <a
                                    href="https://store.jagadhatrionline.co.in"
                                    target="_blank"
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white
                                             px-5 py-2.5 rounded-lg font-medium transition-all duration-300
                                             hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-105"
                                >
                                    <LuShoppingBag className="text-xl animate-bounce" />
                                    <span>Store</span>

                                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full
                                                 animate-pulse">
                                        New
                                    </span>
                                </a>

                                <div className="absolute hidden group-hover:block top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2
                                              bg-white rounded-lg shadow-lg border border-gray-100">
                                    <div className="text-center">
                                        <p className="text-gray-800 font-semibold mb-1">Visit Our Store!</p>
                                        <p className="text-sm text-gray-600">Stationery • T-Shirts • Hoodies</p>
                                    </div>
                                </div>
                            </div> */}
                            {/* <a className="hidden lg:flex items-center gap-2 btn bg-yellow-500 border-0 uppercase py-2.5 px-5 h-auto shadow-none rounded-md hover:bg-yellow-400" href="https://vr.jagadhatrionline.co.in/" target="_blank">
                                360° Virtual Tours
                            </a> */}
                            <a
                                className="hidden cursor-pointer lg:block"
                                href="https://store.jagadhatrionline.co.in/"
                                target="_blank"
                                title="JO Store"
                                aria-label="JO Store"
                            >
                                <LuShoppingBag
                                    className={`size-5 ${isScrolled ? '' : 'text-white'}`}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
