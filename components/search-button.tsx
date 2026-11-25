import { aceSweepStyles } from "@/components/ace-sweep";

function SearchIcon({ stroke }: { stroke: string }) {
  return (
    <svg aria-hidden viewBox="0 0 35 35" width={35} height={35} fill="none" className="absolute inset-0">
      <g stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24.25 24.25L20.995 20.995" />
        <path d="M22.75 16.75C22.75 20.0637 20.0637 22.75 16.75 22.75C13.4363 22.75 10.75 20.0637 10.75 16.75C10.75 13.4363 13.4363 10.75 16.75 10.75C20.0637 10.75 22.75 13.4363 22.75 16.75Z" />
      </g>
    </svg>
  );
}

/**
 * Figma `search` default + hover — gray circle / yellow sweep (expanded states ignored).
 */
export function SearchButton({ className }: { className?: string }) {
  return (
    <>
      <style>{aceSweepStyles}</style>
      <button
        type="button"
        aria-label="Search"
        className={[
          "group relative size-[35px] shrink-0 overflow-hidden rounded-full",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="absolute inset-0 rounded-full bg-[rgba(78,78,78,0.5)] backdrop-blur-[10px]">
          <SearchIcon stroke="white" />
        </span>
        <span
          aria-hidden
          className="ace-sweep-in ace-sweep-fast pointer-events-none absolute inset-0 rounded-full bg-[#fff645]"
        >
          <SearchIcon stroke="black" />
        </span>
      </button>
    </>
  );
}
