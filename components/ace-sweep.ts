const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Apple WebKit (desktop Safari + all iOS browsers). Desktop Chromium excluded. */
export function isAceSafari(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const webkit = /AppleWebKit/i.test(ua);
  const chromium = /Chrome|Chromium|CriOS|Edg\//i.test(ua);
  return webkit && (!chromium || ios);
}

export function applyAceSafariFlag() {
  if (typeof document === "undefined") return;
  if (isAceSafari()) document.documentElement.setAttribute("data-safari", "");
  else document.documentElement.removeAttribute("data-safari");
}

/**
 * Early boot: mark Safari/WebKit before paint when inlined in <head>.
 * Hydration may strip this — SafariFlag re-applies in useLayoutEffect.
 */
export const aceSafariDetectScript = `(()=>{try{var ua=navigator.userAgent;var ios=/iPhone|iPad|iPod/i.test(ua);var webkit=/AppleWebKit/i.test(ua);var chromium=/Chrome|Chromium|CriOS|Edg\\//i.test(ua);if(webkit&&(!chromium||ios))document.documentElement.setAttribute("data-safari","");}catch(e){}})();`;

/**
 * Safari/iOS perf + hover: short opacity dissolve (no mask wipe), opaque frost
 * fills instead of backdrop-filter, no section glow blur.
 * !important beats late per-component <style> mask/transition copies.
 */
export const aceSafariFadeStyles = `
:root[data-safari] .ace-sweep-in,
:root[data-safari] .ace-sweep-out,
:root[data-safari] .ace-card-sweep,
:root[data-safari] .ace-card-fade,
:root[data-safari] .ace-field-sweep,
:root[data-safari] .ace-arrow-hover {
  -webkit-mask-image: none !important;
  mask-image: none !important;
  -webkit-mask: none !important;
  mask: none !important;
  /* Keep a hair above 0 — Safari often skips opacity transitions from 0. */
  transition: opacity 200ms ease-out !important;
  /* No translateZ — Safari reorders composited layers over label text after scroll. */
}
:root[data-safari] .ace-sweep-in,
:root[data-safari] .ace-card-sweep:not(.ace-card-fade),
:root[data-safari] .ace-field-sweep,
:root[data-safari] .ace-arrow-hover {
  opacity: 0.001;
}
:root[data-safari] .ace-sweep-out,
:root[data-safari] .ace-card-fade {
  opacity: 1;
}
:root[data-safari] .group:hover > .ace-sweep-in,
:root[data-safari] .group\\/play:hover > .ace-sweep-in,
:root[data-safari] .group:hover .group\\/play > .ace-sweep-in,
:root[data-safari] .group:hover > .ace-card-sweep:not(.ace-card-fade),
:root[data-safari] .group:hover .ace-card-sweep:not(.ace-card-fade),
:root[data-safari] .group:hover > .ace-field-sweep,
:root[data-safari] .ace-arrow:hover:not(:disabled) > .ace-arrow-hover {
  opacity: 1;
}
:root[data-safari] .group:hover > .ace-sweep-out,
:root[data-safari] .group:hover > .ace-card-fade,
:root[data-safari] .group:hover .ace-card-fade {
  opacity: 0.001;
}
@media (prefers-reduced-motion: reduce) {
  :root[data-safari] .ace-sweep-in,
  :root[data-safari] .ace-sweep-out,
  :root[data-safari] .ace-card-sweep,
  :root[data-safari] .ace-card-fade,
  :root[data-safari] .ace-field-sweep,
  :root[data-safari] .ace-arrow-hover {
    transition: none !important;
  }
}
/* Opaque stand-in for frosted gray chrome (nav + gray primary). */
:root[data-safari] .ace-frost {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
  background-color: rgb(78, 78, 78) !important;
}
/* Products / section pointer-glow plate — skip backdrop-filter. */
:root[data-safari] .ace-section-blur {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
/* Skip animated film grain over pointer gradients. */
:root[data-safari] .ace-gradient-noise {
  display: none !important;
}
/* Below-fold sections — cheaper scroll compositing. */
:root[data-safari] .ace-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: auto 720px;
}
`;

/** Shared mask-sweep used by SecondaryButton, nav pills, and icon buttons. */
export const aceSweepStyles = `
.ace-sweep-in,
.ace-sweep-out {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  transition: mask-position 700ms ${EASE}, -webkit-mask-position 700ms ${EASE};
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
/* Nav chrome (links / search / language) — 20% faster than the shared 700ms. */
.ace-sweep-fast.ace-sweep-in,
.ace-sweep-fast.ace-sweep-out {
  transition: mask-position 560ms ${EASE}, -webkit-mask-position 560ms ${EASE};
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-in,
  .ace-sweep-out {
    transition: none;
  }
}
`;
