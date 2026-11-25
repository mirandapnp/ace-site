export type LabelBadgeVariant = "new" | "top" | "kid";
export type LabelBadgeSize = "desktop" | "mobile";

const styles: Record<
  LabelBadgeVariant,
  { shell: string; dot: string; text: string; label: string }
> = {
  kid: {
    shell: "border-black bg-[rgba(54,245,146,0.75)]",
    dot: "bg-black",
    text: "text-black",
    label: "Kid",
  },
  new: {
    shell: "border-[#fff645] bg-[#ec268e]",
    dot: "bg-[#fff645]",
    text: "text-[#fff645]",
    label: "NEW",
  },
  top: {
    shell: "border-[#ec268e] bg-[#fff645]",
    dot: "bg-[#ec268e]",
    text: "text-[#ec268e]",
    label: "top",
  },
};

/**
 * Figma `Label Badge` — New / Top / Kid product labels.
 * Mobile is smaller (10px type); desktop matches the 14px control.
 */
export function LabelBadge({
  variant = "kid",
  size,
  className = "",
}: {
  variant?: LabelBadgeVariant;
  /** Omit to follow the site breakpoint (mobile under 1024, desktop at 1024+). */
  size?: LabelBadgeSize;
  className?: string;
}) {
  const style = styles[variant];
  const pad =
    size === "mobile"
      ? "gap-[4.5px] px-2.5 py-1.5"
      : size === "desktop"
        ? "gap-2 p-2.5"
        : "gap-[4.5px] px-2.5 py-1.5 min-[1024px]:gap-2 min-[1024px]:p-2.5";
  const dot =
    size === "mobile"
      ? "size-[3.5px]"
      : size === "desktop"
        ? "size-[4.5px]"
        : "size-[3.5px] min-[1024px]:size-[4.5px]";
  const type =
    size === "mobile"
      ? "text-[10px] leading-[1.25] tracking-[0.45px]"
      : size === "desktop"
        ? "text-[14px] leading-none tracking-[0.7px]"
        : "text-[10px] leading-[1.25] tracking-[0.45px] min-[1024px]:text-[14px] min-[1024px]:leading-none min-[1024px]:tracking-[0.7px]";

  return (
    <span
      className={`inline-flex items-center rounded-[8px] border border-solid ${style.shell}${className ? ` ${className}` : ""}`}
    >
      <span className={`flex items-center justify-center ${pad}`}>
        <span aria-hidden className={`shrink-0 ${dot} ${style.dot}`} />
        <span
          className={`font-mono font-semibold uppercase whitespace-nowrap ${type} ${style.text}`}
        >
          {style.label}
        </span>
      </span>
    </span>
  );
}
