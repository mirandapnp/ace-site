"use client";

import { useState } from "react";
import { LazyImage } from "@/components/lazy-visual";
import { SecondaryButton } from "@/components/secondary-button";
import { newsStories } from "@/content/news";
import { media } from "@/lib/media";

const pageSize = 3;

const sweepStyles = `
.ace-sweep-out {
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 33.333%, #000 66.666%, #000 100%);
  mask-image: linear-gradient(90deg, transparent 0%, transparent 33.333%, #000 66.666%, #000 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.group:hover > .ace-sweep-out {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
.ace-sweep-out.ace-arrow-sweep {
  transition: mask-position 490ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 490ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ace-news-track {
  display: flex;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-out,
  .ace-sweep-out.ace-arrow-sweep,
  .ace-news-track {
    transition: none;
  }
}
`;

const leftChevron =
  "M23.52 24.5L16.48 20.668L16.48 19.324L23.52 15.5L23.52 17.068L18.064 19.964L18.064 20.028L23.52 22.932L23.52 24.5Z";
const rightChevron =
  "M16.48 24.5L16.48 22.932L21.936 20.028L21.936 19.964L16.48 17.068L16.48 15.5L23.52 19.324L23.52 20.668L16.48 24.5Z";

function storiesOn(index: number) {
  return newsStories.slice(index * pageSize, index * pageSize + pageSize);
}

export function News() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(newsStories.length / pageSize);
  const atStart = page === 0;
  const atEnd = page >= pageCount - 1;

  function showPage(next: number) {
    if (next < 0 || next >= pageCount) return;
    setPage(next);
  }

  return (
    <section className="w-[1440px] px-5 pt-[60px] pb-5" aria-labelledby="news-heading">
      <div className="flex items-center justify-between">
        <h2
          id="news-heading"
          className="w-[620px] font-display text-[40px] leading-none font-medium tracking-[-1px] text-white capitalize"
        >
          ACE News
        </h2>
        <div className="flex items-center gap-4">
          <style>{sweepStyles}</style>
          <ArrowButton
            label="Previous stories"
            direction="l"
            disabled={atStart}
            onClick={() => showPage(page - 1)}
          />
          <ArrowButton
            label="Next stories"
            direction="r"
            disabled={atEnd}
            onClick={() => showPage(page + 1)}
          />
        </div>
      </div>

      <div className="mt-5 overflow-hidden">
        <div
          className="ace-news-track"
          style={{
            width: `${pageCount * 100}%`,
            transform: `translateX(-${(page * 100) / pageCount}%)`,
          }}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <div
              key={index}
              className="flex min-w-0 shrink-0 flex-col"
              style={{ width: `${100 / pageCount}%` }}
              inert={index === page ? undefined : true}
            >
              <StoryRow
                stories={storiesOn(index)}
                concealed={index !== page}
                className="h-full min-h-full grow"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryRow({
  stories,
  className,
  concealed = false,
}: {
  stories: ReturnType<typeof storiesOn>;
  className?: string;
  concealed?: boolean;
}) {
  return (
    <div aria-hidden={concealed || undefined} className={`grid grid-cols-3 items-stretch gap-5 ${className ?? ""}`}>
      {stories.map((story) => (
        <article
          key={story.id}
          className="flex h-full flex-col overflow-hidden rounded-[16px] bg-[rgba(78,78,78,0.5)]"
        >
          <div className="relative aspect-[4/3] w-full">
            <LazyImage
              alt=""
              src={media(story.image)}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-[24px] leading-[1.25] font-medium tracking-[-0.6px] text-white capitalize">
                {story.title}
              </h3>
              <p className="flex w-fit items-center gap-1 rounded-full bg-white px-[9px] py-[5px] font-display text-[10px] leading-[1.25] font-medium tracking-[-0.25px] text-[#EC268E] capitalize">
                <span>{story.place}</span>
                <span aria-hidden className="h-2 w-px bg-[#EC268E]" />
                <span>{story.date}</span>
              </p>
              <p className="line-clamp-2 font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty text-white">
                {story.body}
              </p>
            </div>
            <div className="mt-auto pt-10">
              <SecondaryButton href={story.href} color="black" external>
                Read more
              </SecondaryButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ArrowButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: "l" | "r";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className={`relative size-10 ${disabled ? "" : "group"}`}
    >
      <ArrowFace direction={direction} tone="hover" />
      <span aria-hidden className="ace-sweep-out ace-arrow-sweep pointer-events-none absolute top-0 left-0">
        <ArrowFace direction={direction} tone="rest" />
      </span>
    </button>
  );
}

function ArrowFace({ direction, tone }: { direction: "l" | "r"; tone: "rest" | "hover" }) {
  const hover = tone === "hover";

  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      {hover ? (
        <rect
          x="0.5"
          y="0.5"
          width="39"
          height="39"
          rx="7.5"
          fill="#FFF645"
          fillOpacity="0.75"
          stroke="#FFF645"
        />
      ) : (
        <>
          <rect width="40" height="40" rx="8" fill="black" />
          <rect width="40" height="40" rx="8" fill="#4E4E4E" fillOpacity="0.5" />
          <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="7.5"
            stroke="#D7D7D7"
            strokeOpacity="0.75"
          />
        </>
      )}
      <path d={direction === "l" ? leftChevron : rightChevron} fill={hover ? "black" : "white"} />
    </svg>
  );
}
