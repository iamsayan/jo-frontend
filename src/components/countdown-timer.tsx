'use client';

import React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { cn } from '@/utils/functions';

interface CountdownTimerProps {
    className?: string;
    targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    className,
    targetDate,
}) => {
    const classes = cn('countdown-area', className);

    const renderer: CountdownRendererFn = ({
        days,
        hours,
        minutes,
        seconds,
        completed,
    }) => {
        const timer = [
            {
                label: 'Days',
                value: days,
            },
            {
                label: 'Hours',
                value: hours,
            },
            {
                label: 'Minutes',
                value: minutes,
            },
            {
                label: 'Seconds',
                value: seconds,
            },
        ];

        if (completed) {
            return <span>Countdown has ended!</span>;
        } else {
            return (
                <div
                    className={`grid auto-cols-max grid-flow-col justify-center gap-3 text-center ${classes}`}
                >
                    {timer.map((item, index) => (
                        <div
                            className="fl-p-3/5 flex flex-col items-center gap-2 rounded-sm border-2 border-slate-800 bg-gray-100"
                            key={index}
                        >
                            <span
                                className={`countdown fl-text-2xl/5xl font-bold text-yellow-500`}
                            >
                                <span
                                    style={
                                        {
                                            '--value': item.value,
                                            '--digits': 2,
                                        } as React.CSSProperties
                                    }
                                    aria-live="polite"
                                    aria-label={String(item.value)}
                                >
                                    {item.value}
                                </span>
                            </span>
                            <span className="countdown-label fl-text-sm/md">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return <Countdown date={targetDate} renderer={renderer} />;
};

export default CountdownTimer;
