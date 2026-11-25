import { aceSweepStyles } from "@/components/ace-sweep";
import { media } from "@/lib/media";

/** Integer 15px line box — Safari floors fractional leading under zoom. */
const labelClass =
  "px-2 font-mono text-[12px] leading-[15px] font-[525] tracking-[0.78px] uppercase whitespace-nowrap";

/** p-2 + size-9 → 52px; fixed height so Safari zoom can’t shrink vertical padding. */
const shellClass =
  "group relative box-border flex h-[52px] items-center overflow-hidden rounded-[12px]";

const blackArrow = media("/ace/enquire-arrow.svg");
const yellowArrow = media("/ace/view-arrow.svg");

export function PrimaryButton({
  href,
  children,
  color = "yellow",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  color?: "yellow" | "gray";
  className?: string;
}) {
  const yellow = color === "yellow";
  const wide = /\bw-full\b/.test(className);
  const rowClass = wide
    ? "relative flex h-full w-full items-center justify-between px-2"
    : "relative flex h-full w-full items-center gap-3 px-2";
  const hoverRow = wide
    ? "ace-sweep-in pointer-events-none absolute inset-0 flex items-center justify-between rounded-[12px] px-2"
    : "ace-sweep-in pointer-events-none absolute inset-0 flex items-center gap-3 rounded-[12px] px-2";
  /* Cover resting yellow border so the muted hover fill doesn’t leave a ring. */
  const yellowHoverRow = wide
    ? "ace-sweep-in pointer-events-none absolute -inset-px flex items-center justify-between rounded-[12px] border border-[#f0e62d] bg-[#f0e62d] px-2"
    : "ace-sweep-in pointer-events-none absolute -inset-px flex items-center gap-3 rounded-[12px] border border-[#f0e62d] bg-[#f0e62d] px-2";

  return (
    <>
      <style>{aceSweepStyles}</style>
      <a
        href={href}
        className={
          yellow
            ? `${shellClass} border border-[#fff645] bg-[#fff645] ${wide ? "w-full" : "w-fit"}${className ? ` ${className}` : ""}`
            : `${shellClass} ace-frost bg-[rgba(78,78,78,0.5)] backdrop-blur-[20px] ${wide ? "w-full" : "w-fit"}${className ? ` ${className}` : ""}`
        }
      >
        <span className={rowClass}>
          <span className={yellow ? `${labelClass} text-black` : `${labelClass} text-white`}>
            {children}
          </span>
          <span
            className={
              yellow
                ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(78,78,78,0.75)]"
                : "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff645]"
            }
          >
            <img
              alt=""
              src={yellow ? yellowArrow : blackArrow}
              width={7.49553}
              height={7.5}
            />
          </span>
        </span>
        {yellow ? (
          /* Hover: muted yellow shell, black label, black disc + yellow arrow */
          <span aria-hidden className={yellowHoverRow}>
            <span className={`${labelClass} text-black`}>{children}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black">
              <img alt="" src={yellowArrow} width={7.49553} height={7.5} />
            </span>
          </span>
        ) : (
          /* Hover: yellow shell, black label, gray disc + yellow arrow */
          <span aria-hidden className={`${hoverRow} bg-[#fff645]`}>
            <span className={`${labelClass} text-black`}>{children}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#4e4e4e]">
              <img alt="" src={yellowArrow} width={7.49553} height={7.5} />
            </span>
          </span>
        )}
      </a>
    </>
  );
}
