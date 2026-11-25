"use client";

import { useState } from "react";
import { LazyImage } from "@/components/lazy-visual";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: readonly string[];
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-[16px] bg-white p-2.5 min-[1024px]:p-5">
      <div className="relative h-[90%] w-[90%]">
        <LazyImage
          key={current}
          priority
          fill
          alt={name}
          src={current}
          className="object-contain"
          sizes="(max-width: 1023px) 90vw, 746px"
          quality={90}
        />
      </div>

      {images.length > 1 ? (
        <div
          className="absolute bottom-0 left-0 flex flex-col gap-5 p-5"
          role="tablist"
          aria-label={`${name} photos`}
        >
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Photo ${index + 1}`}
                onClick={() => setActive(index)}
                className={`relative size-[60px] overflow-hidden rounded-[8px] bg-white transition-[filter,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  selected
                    ? "opacity-100 grayscale-0"
                    : "opacity-50 grayscale hover:opacity-80"
                }`}
              >
                <LazyImage
                  fill
                  alt=""
                  src={src}
                  className="object-cover"
                  sizes="60px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
