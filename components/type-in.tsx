"use client";

import { useEffect, useRef, useState } from "react";

export function TypeIn({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    let index = 0;
    setShown("");
    const tick = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(tick);
    }, 48);

    return () => window.clearInterval(tick);
  }, [started, text]);

  const typing = shown.length > 0 && shown.length < text.length;

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
      {typing ? (
        <span
          aria-hidden
          className="ace-blink ml-[0.1em] inline-block h-[1em] w-[0.55em] bg-current align-[-0.1em]"
        />
      ) : null}
    </p>
  );
}
