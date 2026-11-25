import { aceSweepStyles } from "@/components/ace-sweep";
import { media } from "@/lib/media";

/** Integer 15px line box — Safari floors fractional leading under zoom. */
const labelClass =
  "font-mono text-[12px] leading-[15px] font-[525] tracking-[0.78px] uppercase";

/**
 * Figma secondary: py-12 + 15px type → 39px hug. Does not stretch by default —
 * parents that pair it with PrimaryButton should set `h-full` on the link
 * (e.g. `[&>a]:h-full`). Wide (`w-full`) uses space-between like the listing
 * Actions instance.
 */
function faceClass(wide: boolean) {
  return wide
    ? "relative box-border flex h-full min-h-[39px] w-full items-center justify-between gap-2.5 px-5"
    : "relative box-border flex h-full min-h-[39px] items-center gap-2.5 px-5";
}

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
  const wide = /\bw-full\b/.test(layout);
  const face = faceClass(wide);
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const hoverFace = wide
    ? "ace-sweep-in pointer-events-none absolute inset-0 flex items-center justify-between gap-2.5 px-5"
    : "ace-sweep-in pointer-events-none absolute inset-0 flex items-center gap-2.5 px-5";

  if (color === "outline" || color === "white-outline") {
    const onLight = color === "outline";

    return (
      <>
        <style>{aceSweepStyles}</style>
        <a
          href={href}
          {...linkProps}
          className={`group relative inline-flex min-h-[39px] items-center overflow-hidden rounded-[8px] border ${onLight ? "border-black" : "border-white hover:border-[#fff645]"} ${layout}`}
        >
          <span className={face}>
            <Label
              textClass={onLight ? "text-black" : "text-white"}
              arrowSrc={onLight ? blackArrow : whiteArrow}
              arrow={arrow}
            >
              {children}
            </Label>
          </span>
          {/* Hover: black fill + white type on light outline; yellow type only on white outline. */}
          <span
            aria-hidden
            className={`${hoverFace}${onLight ? " bg-black" : ""}`}
          >
            <Label
              textClass={onLight ? "text-white" : "text-[#fff645]"}
              arrowSrc={onLight ? whiteArrow : yellowArrow}
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
          className={`group relative inline-flex min-h-[39px] items-center overflow-hidden rounded-[8px] border border-[#fff645] bg-[#fff645] ${layout}`}
        >
          <span className={face}>
            <Label textClass="text-black" arrowSrc={blackArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
          {/* Hover: muted yellow #f0e62d, black type/arrow. */}
          <span
            aria-hidden
            className={`${hoverFace} -inset-px rounded-[8px] border border-[#f0e62d] bg-[#f0e62d]`}
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
    return (
      <>
        <style>{aceSweepStyles}</style>
        <a
          href={href}
          {...linkProps}
          className={`group relative inline-flex min-h-[39px] items-center overflow-hidden rounded-[8px] ${layout}`}
        >
          <span className={`${face} border border-black bg-black`}>
            <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
          {/* Hover: dark gray, white type/arrow. */}
          <span
            aria-hidden
            className={`${hoverFace} border border-[#4e4e4e] bg-[#4e4e4e]`}
          >
            <Label textClass="text-white" arrowSrc={whiteArrow} arrow={arrow}>
              {children}
            </Label>
          </span>
        </a>
      </>
    );
  }

  const textFace = "relative flex items-center gap-2.5";

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
          className="ace-sweep-in pointer-events-none absolute inset-0 flex items-center gap-2.5"
        >
          <Label textClass="text-[#fff645]" arrowSrc={yellowArrow} arrow={arrow}>
            {children}
          </Label>
        </span>
      </a>
    </>
  );
}
