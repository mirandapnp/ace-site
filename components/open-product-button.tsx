import { media } from "@/lib/media";

/**
 * Figma `Open product` — circular plus that links into a product listing.
 */
export function OpenProductButton({
  href,
  label,
  size = "big",
  className = "",
}: {
  href: string;
  label: string;
  size?: "big" | "small";
  className?: string;
}) {
  const dim = size === "big" ? "size-[30px]" : "size-6";

  return (
    <a
      href={href}
      aria-label={label}
      className={`relative inline-flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(78,78,78,0.25)]${className ? ` ${className}` : ""}`}
    >
      <img alt="" src={media("/ace/plus.svg")} width={12} height={12} className="relative" />
    </a>
  );
}
