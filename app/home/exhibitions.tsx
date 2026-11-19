import { LazyImage } from "@/components/lazy-visual";
import { media } from "@/lib/media";
import { SubscribeForm } from "./subscribe-form";

export function Exhibitions() {
  return (
    <section className="w-[1440px] px-5 pt-5" aria-labelledby="exhibitions-heading">
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-[16px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <LazyImage
              alt=""
              src={media("/ace/exhibitions.webp")}
              className="absolute top-[-55.06%] left-0 h-[186.82%] w-full max-w-none"
            />
          </div>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 48% 405% at 50% 50%, rgba(179,179,179,0) 0%, rgba(113,113,113,0.25) 50%, rgba(80,80,80,0.375) 75%, rgba(47,47,47,0.5) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[rgba(24,24,24,0.6)]" />
        </div>
        <div className="relative flex flex-col items-center gap-4 text-center text-white">
          <h2
            id="exhibitions-heading"
            className="font-display text-[60px] leading-[1.1] font-medium tracking-[-1.95px] whitespace-nowrap [text-shadow:0px_4px_12px_rgba(0,0,0,0.8)]"
          >
            Meet Us at Exhibitions!
          </h2>
          <p className="font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] whitespace-nowrap">
            Try our latest machines live, in person at the next exhibition. We look forward to meeting you!
          </p>
        </div>
        <SubscribeForm />
      </div>
    </section>
  );
}
