'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import type { CountdownRendererFn } from 'react-countdown';

const Countdown = dynamic(
  () => import('react-countdown').then((mod) => mod.default),
  { ssr: false }
);

interface PujaCountdownProps {
  targetDate: Date;
  eventName?: string;
}

export default function PujaCountdown({
  targetDate,
  eventName,
}: PujaCountdownProps) {
  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return (
        <p className="text-sm font-semibold text-purple-600">
          ✨ Celebrations have begun!
        </p>
      );
    }

    const units = [
      { label: 'Days', value: days },
      { label: 'Hours', value: hours },
      { label: 'Min', value: minutes },
      { label: 'Sec', value: seconds },
    ];

    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {units.map((item, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50/80 ring-1 ring-purple-100 sm:h-20 sm:w-20">
                <span className="bg-gradient-to-b from-indigo-600 to-violet-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                {item.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <div className="mb-5 flex flex-col gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-300" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="text-center">
      {eventName && (
        <p className="mb-4 text-[10px] font-bold tracking-widest text-purple-400 uppercase">
          Countdown to {eventName}
        </p>
      )}
      <Countdown date={targetDate} renderer={renderer} />
    </div>
  );
}
