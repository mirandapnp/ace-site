import type { ReactNode } from "react";
import { aceSweepStyles } from "@/components/ace-sweep";

type NavItemProps = {
  href: string;
  children: ReactNode;
  /** After scroll — gray pill + blur. At top of page — text only. */
  scrolled?: boolean;
  className?: string;
};

const faceBase =
  "box-border flex items-center justify-center rounded-full px-4 py-2 font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] uppercase transition-[background-color] duration-[425ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/**
 * Figma `nav item` — at page top: plain white label; after scroll: gray pill.
 * Yellow + black sweeps in on hover either way.
 */
export function NavItem({
  href,
  children,
  scrolled = false,
  className,
}: NavItemProps) {
  return (
    <>
      <style>{aceSweepStyles}</style>
      <a
        href={href}
        className={[
          "group relative inline-flex overflow-hidden rounded-full",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className={[
            faceBase,
            "text-white",
            // Blur only with the gray pill — blur on a transparent face frosts
            // content behind the nav while it dismisses and reads as a morph.
            scrolled
              ? "ace-frost bg-[rgba(78,78,78,0.5)] backdrop-blur-[10px]"
              : "bg-transparent",
          ].join(" ")}
        >
          {children}
        </span>
        <span
          aria-hidden
          className={`ace-sweep-in ace-sweep-fast pointer-events-none absolute inset-0 ${faceBase} bg-[#fff645] text-black`}
        >
          {children}
        </span>
      </a>
    </>
  );
}
