"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuFolder, LuHouse } from "react-icons/lu";
import { cn } from "@/utils/functions";

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
    .split("/")
    .filter(Boolean)
    .slice(0, end ?? undefined);

  return (
    <div
      id="breadcrumb"
      className={cn(
        "text-xs breadcrumbs text-white/90 capitalize flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20",
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
              : item.replaceAll("-", " ");
          return (
            <li key={index} className="breadcrumb-item">
              <div className="inline-block text-ellipsis overflow-hidden whitespace-nowrap">
                {index === pathItems.length - 1 ? (
                  <span className="truncate max-w-[100px] md:max-w-none">
                    {title}
                  </span>
                ) : (
                  <Link
                    href={`/${pathItems.slice(0, index + 1).join("/")}`}
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
