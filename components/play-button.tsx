"use client";

import { media } from "@/lib/media";

const sweepStyles = `
.ace-sweep-in {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.group\\/play:hover > .ace-sweep-in,
.group:hover .group\\/play > .ace-sweep-in {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-in {
    transition: none;
  }
}
`;

const faceClass =
  "absolute inset-0 flex items-center justify-center rounded-full border border-solid border-[rgba(215,215,215,0.25)]";

export function PlayButtonFace({ className = "" }: { className?: string }) {
  return (
    <>
      <style>{sweepStyles}</style>
      <span
        className={`group/play relative block size-[72px] shrink-0${className ? ` ${className}` : ""}`}
      >
        <span className={`${faceClass} bg-[rgba(78,78,78,0.25)]`}>
          <img
            alt=""
            src={media("/ace/play.svg")}
            width={29.572}
            height={26}
            className="ml-0.5 -scale-x-100"
          />
        </span>
        <span aria-hidden className={`ace-sweep-in ${faceClass} bg-[rgba(215,215,215,0.5)]`}>
          <img
            alt=""
            src={media("/ace/play-hover.svg")}
            width={29.572}
            height={26}
            className="ml-0.5 -scale-x-100"
          />
        </span>
      </span>
    </>
  );
}

export function PlayButton({
  onClick,
  "aria-label": ariaLabel = "Play video",
}: {
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="group relative">
      <PlayButtonFace />
    </button>
  );
}
