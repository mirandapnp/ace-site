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
  "font-mono text-[12px] leading-[15px] font-[525] tracking-[0.78px] uppercase";

/**
 * py-3 (12) + 15px type + 1px border ×2 → 41px border-box.
 * Fixed height keeps vertical padding stable under Safari zoom.
 */
const faceClass =
  "relative box-border flex h-[41px] items-center gap-[10px] px-5";

const blackArrow = media("/ace/enquire-arrow.svg");
const whiteArrow = media("/ace/white-arrow.svg");
const yellowArrow = media("/ace/view-arrow.svg");

function Arrow({ src }: { src: string }) {
  return <img alt="" src={src} width={7.49553} height={7.5} />;
}

function Label({
  children,
  textClass,
  arrowSrc,
  arrow,
}: {
  children: React.ReactNode;
  textClass: string;
  arrowSrc: string;
  arrow: boolean;
}) {
  return (
    <>
      <span className={`${labelClass} ${textClass}`}>{children}</span>
      {arrow ? <Arrow src={arrowSrc} /> : null}
    </>
  );
}

export function SecondaryButton({
  href,
  children,
  color = "outline",
  arrow = true,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  color?: "outline" | "white-outline" | "black" | "yellow" | "text-only";
  arrow?: boolean;
  external?: boolean;
  className?: string;
}) {
  const layout = className ?? "";
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (color === "outline" || color === "white-outline") {
    const onLight = color === "outline";

    return (
      <>
        <style>{sweepStyles}</style>
        <a
          href={href} {...linkProps}
          className={`group relative inline-flex overflow-hidden rounded-[8px] border ${onLight ? "border-black" : "border-white"} ${layout}`}
        >
          <span
            aria-hidden
            className="ace-sweep-in pointer-events-none absolute inset-0 bg-[rgba(78,78,78,0.1)]"
          />
          <span className={faceClass}>
            <Label
              textClass={onLight ? "text-black" : "text-white"}
              arrowSrc={onLight ? blackArrow : whiteArrow}
              arrow={arrow}
            >
              {children}
            </Label>
          </span>
        </a>
      </>
    );
  }

  if (color === "yellow") {
    return (
      <>
        <style>{sweepStyles}</style>
        <a
          href={href} {...linkProps}
          className={`group relative inline-flex overflow-hidden rounded-[8px] border border-[#fff645] bg-[rgba(255,246,69,0.75)] ${layout}`}
        >
          <span aria-hidden className="ace-sweep-out pointer-events-none absolute inset-0 bg-[#fff645]" />
          <span className={faceClass}>
            <Label textClass="text-black" arrowSrc={blackArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
        </a>
      </>
    );
  }

  if (color === "black") {
    const face =
      "box-border flex h-[41px] items-center gap-[10px] rounded-[8px] px-5";

    return (
      <>
        <style>{sweepStyles}</style>
        <a href={href} {...linkProps} className={`group relative inline-flex overflow-hidden rounded-[8px] ${layout}`}>
          <span className={`${face} border border-[rgba(78,78,78,0.75)] bg-[rgba(78,78,78,0.75)]`}>
            <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
          <span
            aria-hidden
            className={`ace-sweep-out pointer-events-none absolute inset-0 ${face} border border-black bg-black`}
          >
            <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
        </a>
      </>
    );
  }

  const textFace = "flex items-center gap-[10px]";

  return (
    <>
      <style>{sweepStyles}</style>
      <a href={href} {...linkProps} className={`group relative inline-flex ${layout}`}>
        <span className={textFace}>
          <Label textClass="text-[#fff645]" arrowSrc={yellowArrow} arrow={arrow}>
            {children}
          </Label>
        </span>
        <span aria-hidden className={`ace-sweep-out pointer-events-none absolute inset-0 ${textFace}`}>
          <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
            {children}
          </Label>
        </span>
      </a>
    </>
  );
}
