import { aceSweepStyles } from "@/components/ace-sweep";

function GlobeIcon({ stroke }: { stroke: string }) {
  return (
    <svg aria-hidden viewBox="0 0 35 35" width={35} height={35} fill="none" className="absolute inset-0">
      <g stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 17.5C25 21.6421 21.6421 25 17.5 25C13.3579 25 10 21.6421 10 17.5C10 13.3579 13.3579 10 17.5 10C21.6421 10 25 13.3579 25 17.5Z" />
        <path d="M17.5 10C15.5742 12.0221 14.5 14.7076 14.5 17.5C14.5 20.2924 15.5742 22.9779 17.5 25C19.4258 22.9779 20.5 20.2924 20.5 17.5C20.5 14.7076 19.4258 12.0221 17.5 10Z" />
        <path d="M10 17.5H25" />
      </g>
    </svg>
  );
}

/**
 * Figma `language select` — gray + white globe; yellow + black sweeps in on hover.
 */
export function LanguageSelect({ className }: { className?: string }) {
  return (
    <>
      <style>{aceSweepStyles}</style>
      <button
        type="button"
        aria-label="Language"
        className={[
          "group relative size-[35px] shrink-0 overflow-hidden rounded-full",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="absolute inset-0 rounded-full bg-[rgba(78,78,78,0.5)] backdrop-blur-[10px]">
          <GlobeIcon stroke="white" />
        </span>
        <span
          aria-hidden
          className="ace-sweep-in ace-sweep-fast pointer-events-none absolute inset-0 rounded-full bg-[#fff645]"
        >
          <GlobeIcon stroke="black" />
        </span>
      </button>
    </>
  );
}
