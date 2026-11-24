import { media } from "@/lib/media";

const sweepStyles = `
.ace-sweep-in,
.ace-sweep-out {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ace-sweep-in {
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
}
.ace-sweep-out {
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 33.333%, #000 66.666%, #000 100%);
  mask-image: linear-gradient(90deg, transparent 0%, transparent 33.333%, #000 66.666%, #000 100%);
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
}
.group:hover > .ace-sweep-in {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
.group:hover > .ace-sweep-out {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-in,
  .ace-sweep-out {
    transition: none;
  }
}
`;

/** Integer 15px line box — Safari floors fractional leading under zoom. */
const labelClass =
  "px-2 font-mono text-[12px] leading-[15px] font-[525] tracking-[0.78px] uppercase whitespace-nowrap";

/** p-2 + size-9 → 52px; fixed height so Safari zoom can’t shrink vertical padding. */
const shellClass =
  "group relative box-border flex h-[52px] items-center overflow-hidden rounded-[12px]";

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

  return (
    <>
      <style>{sweepStyles}</style>
      <a
        href={href}
        className={
          yellow
            ? `${shellClass} border border-[#fff645] bg-[rgba(255,246,69,0.75)] backdrop-blur-[50px] ${wide ? "w-full" : "w-fit"}${className ? ` ${className}` : ""}`
            : `${shellClass} bg-[rgba(78,78,78,0.5)] backdrop-blur-[20px] ${wide ? "w-full" : "w-fit"}${className ? ` ${className}` : ""}`
        }
      >
        <span className={rowClass}>
          <span className={yellow ? `${labelClass} text-black` : `${labelClass} text-white`}>
            {children}
          </span>
          <span
            className={
              yellow
                ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-black"
                : "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff645]"
            }
          >
            <img
              alt=""
              src={yellow ? media("/ace/view-arrow.svg") : media("/ace/enquire-arrow.svg")}
              width={7.49553}
              height={7.5}
            />
          </span>
        </span>
        {yellow ? (
          <span
            aria-hidden
            className={`ace-sweep-out absolute inset-0 flex items-center bg-[#fff645] px-2 backdrop-blur-[20px] ${wide ? "justify-between" : "gap-3"}`}
          >
            <span className={`${labelClass} text-black`}>{children}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(78,78,78,0.75)]">
              <img alt="" src={media("/ace/view-arrow.svg")} width={7.49553} height={7.5} />
            </span>
          </span>
        ) : (
          <span
            aria-hidden
            className={`ace-sweep-in absolute inset-0 flex items-center bg-[#fff645] px-2 ${wide ? "justify-between" : "gap-3"}`}
          >
            <span className={`${labelClass} text-black`}>{children}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#4e4e4e]">
              <img alt="" src={media("/ace/view-arrow.svg")} width={7.49553} height={7.5} />
            </span>
          </span>
        )}
      </a>
    </>
  );
}
