import { aceSweepStyles } from "@/components/ace-sweep";
import { media } from "@/lib/media";

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
        <style>{aceSweepStyles}</style>
        <a
          href={href}
          {...linkProps}
          className={`group relative inline-flex overflow-hidden rounded-[8px] border ${onLight ? "border-black" : "border-white"} ${layout}`}
        >
          <span className={faceClass}>
            <Label
              textClass={onLight ? "text-black" : "text-white"}
              arrowSrc={onLight ? blackArrow : whiteArrow}
              arrow={arrow}
            >
              {children}
            </Label>
          </span>
          {/* Hover: fill opposite of outline — black on light, white on dark. */}
          <span
            aria-hidden
            className={`ace-sweep-in pointer-events-none absolute inset-0 flex h-[41px] items-center gap-[10px] px-5 ${onLight ? "bg-black" : "bg-white"}`}
          >
            <Label
              textClass={onLight ? "text-white" : "text-black"}
              arrowSrc={onLight ? whiteArrow : blackArrow}
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
        <style>{aceSweepStyles}</style>
        <a
          href={href}
          {...linkProps}
          className={`group relative inline-flex overflow-hidden rounded-[8px] border border-[#fff645] bg-[#fff645] ${layout}`}
        >
          <span className={faceClass}>
            <Label textClass="text-black" arrowSrc={blackArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
          {/* Hover: muted yellow #f0e62d, black type/arrow. */}
          <span
            aria-hidden
            className="ace-sweep-in pointer-events-none absolute -inset-px flex items-center gap-[10px] rounded-[8px] border border-[#f0e62d] bg-[#f0e62d] px-5"
          >
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
        <style>{aceSweepStyles}</style>
        <a
          href={href}
          {...linkProps}
          className={`group relative inline-flex overflow-hidden rounded-[8px] ${layout}`}
        >
          <span className={`${face} border border-black bg-black`}>
            <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
          {/* Hover: dark gray, white type/arrow. */}
          <span
            aria-hidden
            className={`ace-sweep-in pointer-events-none absolute inset-0 ${face} border border-[#4e4e4e] bg-[#4e4e4e]`}
          >
            <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
        </a>
      </>
    );
  }

  const textFace = "relative flex items-center gap-[10px]";

  return (
    <>
      <style>{aceSweepStyles}</style>
      <a href={href} {...linkProps} className={`group relative inline-flex ${layout}`}>
        <span className={textFace}>
          <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
            {children}
          </Label>
        </span>
        {/* Hover: yellow type/arrow. */}
        <span
          aria-hidden
          className="ace-sweep-in pointer-events-none absolute inset-0 flex items-center gap-[10px]"
        >
          <Label textClass="text-[#fff645]" arrowSrc={yellowArrow} arrow={arrow}>
            {children}
          </Label>
        </span>
      </a>
    </>
  );
}
