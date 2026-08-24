"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* eslint-disable react/prop-types -- TypeScript provides the component prop contract. */

type DoubleChevronProps = {
  index: number;
  dotColor: string;
};

function DoubleChevron({ index, dotColor }: DoubleChevronProps) {
  const base = index * 0.12;
  const dots = [
    { cx: 2, cy: 2, delay: 0 },
    { cx: 5, cy: 5, delay: 0.05 },
    { cx: 8, cy: 8, delay: 0.1 },
    { cx: 5, cy: 11, delay: 0.15 },
    { cx: 2, cy: 14, delay: 0.2 },
    { cx: 6, cy: 2, delay: 0.05 },
    { cx: 9, cy: 5, delay: 0.1 },
    { cx: 12, cy: 8, delay: 0.15 },
    { cx: 9, cy: 11, delay: 0.2 },
    { cx: 6, cy: 14, delay: 0.25 },
  ];

  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 overflow-visible"
    >
      <g fill={dotColor}>
        {dots.map((dot, dotIndex) => (
          <circle
            key={dotIndex}
            cx={dot.cx}
            cy={dot.cy}
            r="1"
            className="anti-metal-dot"
            style={{ animationDelay: `${base + dot.delay}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

export type AntiMetalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: React.ReactNode;
  accentFrom?: string;
  accentTo?: string;
  dotColor?: string;
};

export const AntiMetalButton = React.forwardRef<HTMLButtonElement, AntiMetalButtonProps>(
  (
    {
      className,
      children,
      label,
      accentFrom = "#ff5fcf",
      accentTo = "#9929ea",
      dotColor = "#faeb92",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const content = label ?? children ?? "Book a demo";

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "group/btn relative inline-flex h-12 w-64 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#16091f_0%,#07030b_100%)] shadow-[inset_0_1px_0_rgba(250,235,146,0.12),0_8px_20px_rgba(0,0,0,0.34)] transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5fcf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07030b] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <style>{`
          @keyframes anti-metal-dot-wave {
            0%, 70%, 100% { opacity: 0.25; transform: scale(0.85); }
            35% { opacity: 1; transform: scale(1); }
          }
          .anti-metal-dot {
            transform-box: fill-box;
            transform-origin: center;
            animation: anti-metal-dot-wave 1.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .anti-metal-dot { animation: none; opacity: 1; }
          }
        `}</style>

        <span className="absolute inset-y-0 left-12 right-2 flex items-center justify-center whitespace-nowrap text-[12px] font-black tracking-[0.075em] text-[#fff3dc]">
          {content}
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-1 left-1 top-1 z-10 flex w-10 items-center justify-start gap-2.5 overflow-hidden rounded-lg pl-3 pr-2.5 transition-[width,gap] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:w-[calc(100%-0.5rem)]"
          style={{
            background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -2px 4px rgba(38,0,57,0.32), 0 2px 8px rgba(153,41,234,0.24)",
          }}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <DoubleChevron key={index} index={index} dotColor={dotColor} />
          ))}
        </span>
      </button>
    );
  },
);

AntiMetalButton.displayName = "AntiMetalButton";

export default AntiMetalButton;
