import React from 'react';
import { cn } from '@/utils/functions';

export interface InfoItem {
    title: string;
    description: string | number;
    icon: React.ReactNode;
    className?: string;
    variant: string;
}

export interface InfoProps {
    items: InfoItem[];
    className?: string;
}

const Info: React.FC<InfoProps> = ({ items, className }) => {
    return (
        <div
            className={cn(
                'fl-gap-3/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
                className,
            )}
        >
            {items.map((item: InfoItem, index: number) => (
                <div
                    key={index}
                    className={cn(
                        'rounded-box hover-scale border-base-300 border bg-white p-4 text-left',
                        item.className,
                    )}
                >
                    <div className="flex items-center">
                        <div
                            className={cn(
                                'fl-text-lg/xl mr-4 rounded-full bg-gradient-to-br p-3 text-white',
                                item.variant,
                            )}
                        >
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">
                                {item.title}
                            </h3>
                            <p
                                className={cn(
                                    'gradient-text bg-gradient-to-r text-2xl font-bold',
                                    item.variant,
                                )}
                            >
                                {item.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Info;
