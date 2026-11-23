"use client";

import { useEffect, useRef, useState } from "react";
import { LazyImage } from "@/components/lazy-visual";
import { SecondaryButton } from "@/components/secondary-button";
import { newsStories, type NewsStory } from "@/content/news";
import { media } from "@/lib/media";

const DESKTOP_PAGE_SIZE = 3;
const MOBILE_PAGE_SIZE = 1;

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
.ace-news-viewport {
  cursor: grab;
  touch-action: pan-y;
}
.ace-news-viewport.is-dragging {
  cursor: grabbing;
}
.ace-news-viewport img {
  -webkit-user-drag: none;
}
.ace-news-track {
  display: flex;
  align-items: stretch;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ace-news-track.is-dragging {
  transition: none;
}
@media (prefers-reduced-motion: reduce) {
  .ace-sweep-out,
  .ace-sweep-out.ace-arrow-sweep,
  .ace-news-track {
    transition: none;
  }
}
`;

const chevron =
  "M5.00092 0.000611636L0 5.00153L4.99794 10L7.05041 9.99939L2.05255 5.00084L7.05339 0L5.00092 0.000611636Z";

function useNewsPageSize() {
  const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const sync = () =>
      setPageSize(mediaQuery.matches ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return pageSize;
}

function storiesOn(index: number, pageSize: number) {
  return newsStories.slice(index * pageSize, index * pageSize + pageSize);
}

export function News() {
  const pageSize = useNewsPageSize();
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pageCount = Math.ceil(newsStories.length / pageSize);
  const atStart = page === 0;
  const atEnd = page >= pageCount - 1;
  const viewportRef = useRef<HTMLDivElement>(null);
  const suppressClick = useRef(false);
  const settleFrame = useRef(0);
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    dx: 0,
    velocity: 0,
    active: false,
  });

  useEffect(() => () => cancelAnimationFrame(settleFrame.current), []);

  useEffect(() => {
    setPage(0);
    setOffset(0);
    setDragging(false);
  }, [pageSize]);

  function showPage(next: number) {
    if (next < 0 || next >= pageCount) return;
    setPage(next);
  }

  function layoutDelta(clientDx: number) {
    const viewport = viewportRef.current;
    if (!viewport || viewport.clientWidth === 0) return clientDx;
    const scale = viewport.getBoundingClientRect().width / viewport.clientWidth;
    return scale === 0 ? clientDx : clientDx / scale;
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    cancelAnimationFrame(settleFrame.current);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      dx: 0,
      velocity: 0,
      active: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture.pointerId !== event.pointerId) return;
    const visualDx = event.clientX - gesture.startX;
    const visualDy = event.clientY - gesture.startY;
    if (!gesture.active) {
      if (Math.abs(visualDx) < 8 && Math.abs(visualDy) < 8) return;
      if (Math.abs(visualDy) > Math.abs(visualDx)) {
        gesture.pointerId = -1;
        return;
      }
      gesture.active = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const elapsed = event.timeStamp - gesture.lastTime;
    if (elapsed > 0) gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
    gesture.lastX = event.clientX;
    gesture.lastTime = event.timeStamp;
    let nextOffset = layoutDelta(visualDx);
    const pullingPastStart = page === 0 && nextOffset > 0;
    const pullingPastEnd = page >= pageCount - 1 && nextOffset < 0;
    if (pullingPastStart || pullingPastEnd) nextOffset *= 0.3;
    gesture.dx = nextOffset;
    setOffset(nextOffset);
  }

  function finishDrag(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture.pointerId !== event.pointerId) return;
    gesture.pointerId = -1;
    if (!gesture.active) return;
    const width = viewportRef.current?.clientWidth ?? 1;
    const distance = Math.abs(gesture.dx);
    const flicked = distance > width * 0.08 && Math.abs(gesture.velocity) > 0.65;
    let next = page;
    if (gesture.dx < 0 && (distance >= width * 0.16 || (flicked && gesture.velocity < 0))) {
      next = Math.min(pageCount - 1, page + 1);
    } else if (gesture.dx > 0 && (distance >= width * 0.16 || (flicked && gesture.velocity > 0))) {
      next = Math.max(0, page - 1);
    }
    suppressClick.current = true;
    settleFrame.current = requestAnimationFrame(() => {
      setDragging(false);
      settleFrame.current = requestAnimationFrame(() => {
        setOffset(0);
        setPage(next);
      });
    });
  }

  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  return (
    <section
      className="flex w-[412px] flex-col gap-5 px-2.5 pt-5 pb-2.5 min-[1024px]:block min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:pt-[60px] min-[1024px]:pb-5"
      aria-labelledby="news-heading"
    >
      <style>{sweepStyles}</style>
      <div className="flex items-center justify-center min-[1024px]:justify-between">
        <h2
          id="news-heading"
          className="type-h4 text-white capitalize min-[1024px]:w-[620px]"
        >
          ACE News
        </h2>
        <div className="hidden items-center gap-4 min-[1024px]:flex">
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

      <div
        ref={viewportRef}
        className={`ace-news-viewport overflow-hidden min-[1024px]:mt-5${dragging ? " is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={onClickCapture}
      >
        <div
          className={`ace-news-track${dragging ? " is-dragging" : ""}`}
          style={{
            width: `${pageCount * 100}%`,
            transform: `translateX(calc(-${(page * 100) / pageCount}% + ${offset}px))`,
          }}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <div
              key={`${pageSize}-${index}`}
              className="flex min-w-0 shrink-0 flex-col self-stretch"
              style={{ width: `${100 / pageCount}%` }}
              inert={index === page ? undefined : true}
            >
              <StoryRow
                stories={storiesOn(index, pageSize)}
                concealed={index !== page}
                className="h-full min-h-0 flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 min-[1024px]:hidden">
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
    </section>
  );
}

function StoryRow({
  stories,
  className,
  concealed = false,
}: {
  stories: NewsStory[];
  className?: string;
  concealed?: boolean;
}) {
  return (
    <div
      aria-hidden={concealed || undefined}
      className={`grid grid-cols-1 items-stretch gap-5 min-[1024px]:grid-cols-3 ${className ?? ""}`}
    >
      {stories.map((story) => (
        <article
          key={story.id}
          className="flex h-full flex-col overflow-hidden rounded-[16px] bg-[rgba(78,78,78,0.5)]"
        >
          <div className="relative aspect-[3/2] w-full min-[1024px]:aspect-[4/3]">
            <LazyImage
              alt=""
              src={media(story.image)}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col px-2.5 pt-5 pb-2.5 min-[1024px]:p-5">
            <div className="flex flex-col gap-3">
              <h3 className="type-h5 text-white capitalize">
                {story.title}
              </h3>
              <p className="flex w-fit items-center gap-1 rounded-full bg-white px-[9px] py-[5px] font-display text-[10px] leading-[1.25] font-medium tracking-[-0.25px] text-[#EC268E] capitalize">
                <span>{story.place}</span>
                <span aria-hidden className="h-2 w-px bg-[#EC268E]" />
                <span>{story.date}</span>
              </p>
              <p className="line-clamp-2 font-sans text-[12px] leading-[1.5] font-[442] tracking-[0.15px] text-pretty text-white min-[1024px]:text-[14px] min-[1024px]:font-[485] min-[1024px]:tracking-[0.175px]">
                {story.body}
              </p>
            </div>
            <div className="mt-auto pt-10">
              <SecondaryButton
                href={story.href}
                color="black"
                external
                className="w-full [&>span]:w-full [&>span]:justify-between min-[1024px]:w-auto min-[1024px]:[&>span]:w-auto min-[1024px]:[&>span]:justify-start"
              >
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
      <span
        aria-hidden
        className="ace-sweep-out ace-arrow-sweep pointer-events-none absolute top-0 left-0"
      >
        <ArrowFace direction={direction} tone="rest" />
      </span>
    </button>
  );
}

function ArrowFace({
  direction,
  tone,
}: {
  direction: "l" | "r";
  tone: "rest" | "hover";
}) {
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
      <path
        d={chevron}
        fill={hover ? "black" : "white"}
        transform={
          direction === "l"
            ? "translate(16.473 15)"
            : "translate(23.527 25) scale(-1 -1)"
        }
      />
    </svg>
  );
}
