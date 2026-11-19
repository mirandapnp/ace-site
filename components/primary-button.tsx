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

const labelClass =
  "p-2 font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] uppercase";

export function PrimaryButton({
  href,
  children,
  color = "yellow",
}: {
  href: string;
  children: React.ReactNode;
  color?: "yellow" | "gray";
}) {
  const yellow = color === "yellow";

  return (
    <>
    <style>{sweepStyles}</style>
    <a
      href={href}
      className={
        yellow
          ? "group relative flex w-fit items-center overflow-hidden rounded-[12px] border border-[#fff645] bg-[rgba(255,246,69,0.75)]"
          : "group relative flex w-fit items-center overflow-hidden rounded-[12px] bg-[rgba(78,78,78,0.5)]"
      }
    >
      <span className="relative flex items-center gap-3 p-2">
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
          className="ace-sweep-out absolute inset-0 flex items-center gap-3 bg-[#fff645] p-2"
        >
          <span className={`${labelClass} text-black`}>{children}</span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(78,78,78,0.75)]">
            <img alt="" src={media("/ace/view-arrow.svg")} width={7.49553} height={7.5} />
          </span>
        </span>
      ) : (
        <span
          aria-hidden
          className="ace-sweep-in absolute inset-0 flex items-center gap-3 bg-[#fff645] p-2"
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
