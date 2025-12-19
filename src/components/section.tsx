import React, { ReactNode } from 'react';
import { paytoneOne } from '@/fonts';
import { cn } from '@/utils/functions';

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
    const classes = cn('w-full flex justify-center', className!);

    return (
        <div className={classes} {...props}>
            <div className="container px-5 py-16 lg:px-0">
                {title && (
                    <div
                        className={`flex flex-col items-center justify-around text-center ${paytoneOne.className}`}
                    >
                        <div className="fl-text-xs/base text-slate-600 uppercase">
                            {title}
                        </div>
                        <h2 className="title fl-text-3xl/4xl max-w-[600px] overflow-hidden text-center !leading-snug text-ellipsis whitespace-nowrap">
                            <span className="bg-gradient-to-r from-pink-800 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                                {description}
                            </span>
                        </h2>
                        <div className="divider divider-warning m-0 w-10 self-center"></div>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
