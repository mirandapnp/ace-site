"use client";

const sweepStyles = `
.ace-sweep-in {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.group:hover > .ace-sweep-in {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-in {
    transition: none;
  }
}
`;

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
      <style>{sweepStyles}</style>
      <button
        type="button"
        role="tab"
        aria-label={ariaLabel}
        aria-selected={active}
        onClick={onClick}
        className={
          active
            ? "relative h-[32px] w-[32px] shrink-0"
            : "group relative h-[32px] w-[32px] shrink-0"
        }
      >
        <span
          className={
            active
              ? `${faceClass} border-[#FFF645] bg-[rgba(78,78,78,0.75)]`
              : `${faceClass} border-[rgba(215,215,215,0.75)] bg-[rgba(78,78,78,0.5)]`
          }
        >
          <span className={`${labelClass} ${active ? "text-[#FFF645]" : "text-white"}`}>
            {children}
          </span>
        </span>
        {active ? null : (
          <span
            aria-hidden
            className={`ace-sweep-in ${faceClass} border-[#FFF645] bg-[rgba(255,246,69,0.75)]`}
          >
            <span className={`${labelClass} text-black`}>{children}</span>
          </span>
        )}
      </button>
    </>
  );
}
