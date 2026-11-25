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
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
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
  transition: mask-position 560ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 560ms cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-in,
  .ace-sweep-out {
    transition: none;
  }
}
`;
