"use client";

import React from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { paytoneOne } from "@/fonts";
import { cn } from "@/utils/functions";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  className?: string;
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  className,
  targetDate,
}) => {
  const classes = cn("countdown-area", className);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    const timer = [
      {
        label: "Days",
        value: days,
      },
      {
        label: "Hours",
        value: hours,
      },
      {
        label: "Minutes",
        value: minutes,
      },
      {
        label: "Seconds",
        value: seconds,
      },
    ];

    if (completed) {
      return <span>Countdown has ended!</span>;
    } else {
      return (
        <div
          className={`grid grid-flow-col gap-3 justify-center text-center auto-cols-max ${classes}`}
        >
          {timer.map((item, index) => (
            <div
              className="flex flex-col items-center gap-2 border-slate-800 border-2 fl-p-3/5 rounded-sm bg-gray-100"
              key={index}
            >
              <span
                className={`countdown fl-text-2xl/5xl text-yellow-500 font-bold`}
              >
                <span
                  style={
                    {
                      "--value": item.value,
                      "--digits": 2,
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
