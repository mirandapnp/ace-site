export type LabelBadgeVariant = "new" | "top" | "kid";

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
 */
export function LabelBadge({
  variant = "kid",
  className = "",
}: {
  variant?: LabelBadgeVariant;
  className?: string;
}) {
  const style = styles[variant];

  return (
    <span
      className={`inline-flex items-center rounded-[8px] border border-solid ${style.shell}${className ? ` ${className}` : ""}`}
    >
      <span className="flex items-center justify-center gap-2 p-2.5">
        <span aria-hidden className={`size-[4.5px] shrink-0 ${style.dot}`} />
        <span
          className={`font-mono text-[14px] leading-none font-semibold tracking-[0.7px] uppercase whitespace-nowrap ${style.text}`}
        >
          {style.label}
        </span>
      </span>
    </span>
  );
}
