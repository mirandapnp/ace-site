"use client";

import { aceSweepStyles } from "@/components/ace-sweep";

const labelClass =
  "font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] uppercase whitespace-nowrap";

const faceClass =
  "absolute inset-0 flex items-center justify-center rounded-[8px] border border-solid";

export function PageNumber({
  children,
  active = false,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <>
      <style>{aceSweepStyles}</style>
      <button
        type="button"
        role="tab"
        aria-label={ariaLabel}
        aria-selected={active}
        onClick={onClick}
        className={
          active
            ? "relative h-[32px] w-[32px] shrink-0 overflow-hidden"
            : "group relative h-[32px] w-[32px] shrink-0 overflow-hidden"
        }
      >
        <span
          className={
            active
              ? `${faceClass} border-[#FFF645] bg-[#4e4e4e]`
              : `${faceClass} border-[#d7d7d7] bg-[#4e4e4e]`
          }
        >
          <span className={`${labelClass} ${active ? "text-[#FFF645]" : "text-white"}`}>
            {children}
          </span>
        </span>
        {active ? null : (
          <span
            aria-hidden
            className={`ace-sweep-in ${faceClass} border-[#FFF645] bg-[#fff645]`}
          >
            <span className={`${labelClass} text-black`}>{children}</span>
          </span>
        )}
      </button>
    </>
  );
}
