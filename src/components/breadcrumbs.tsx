'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuFolder, LuHouse } from 'react-icons/lu';
import { cn } from '@/utils/functions';

interface BreadcrumbsProps {
    breadcrumbTitle?: string | null;
    end?: number | null;
    className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    breadcrumbTitle = null,
    end = null,
    className,
}) => {
    const pathname = usePathname();
    const pathItems = pathname
        .split('/')
        .filter(Boolean)
        .slice(0, end ?? undefined);

    return (
        <div
            id="breadcrumb"
            className={cn(
                'breadcrumbs flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 capitalize backdrop-blur-md',
                className,
            )}
        >
            <ul className="breadcrumb-wrapper">
                <li className="breadcrumb-item">
                    <Link href="/" className="flex items-center gap-2">
                        <LuHouse /> Home
                    </Link>
                </li>
                {pathItems?.map((item, index) => {
                    const title =
                        breadcrumbTitle && index === pathItems?.length - 1
                            ? breadcrumbTitle
                            : item.replaceAll('-', ' ');
                    return (
                        <li key={index} className="breadcrumb-item">
                            <div className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
                                {index === pathItems.length - 1 ? (
                                    <span className="max-w-[100px] truncate md:max-w-none">
                                        {title}
                                    </span>
                                ) : (
                                    <Link
                                        href={`/${pathItems.slice(0, index + 1).join('/')}`}
                                        className="flex items-center gap-2"
                                    >
                                        <LuFolder /> {title}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Breadcrumbs;
