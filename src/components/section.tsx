import React, { ReactNode } from "react";
import { paytoneOne } from "@/fonts";
import { cn } from "@/utils/functions";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  description?: ReactNode | string;
  className?: string;
}

export default function Section({
  children,
  title,
  description,
  className,
  ...props
}: SectionProps) {
  const classes = cn("w-full flex justify-center", className!);

  return (
    <div className={classes} {...props}>
      <div className="container py-16 px-5 lg:px-0">
        {title && (
          <div
            className={`flex flex-col text-center items-center justify-around ${paytoneOne.className}`}
          >
            <div className="uppercase fl-text-xs/base text-slate-600">
              {title}
            </div>
            <h2 className="title fl-text-3xl/4xl !leading-snug text-center text-ellipsis overflow-hidden whitespace-nowrap max-w-[600px]">
              <span className="bg-gradient-to-r from-pink-800 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                {description}
              </span>
            </h2>
            <div className="divider w-10 self-center m-0 divider-warning"></div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
