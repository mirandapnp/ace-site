import { LazyImage } from "@/components/lazy-visual";
import { media } from "@/lib/media";
import { SubscribeForm } from "./subscribe-form";

export function Exhibitions() {
  return (
    <section
      className="w-[412px] px-2.5 py-2.5 min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:pt-5 min-[1024px]:pb-0"
      aria-labelledby="exhibitions-heading"
    >
      <div className="relative flex h-[600px] w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-[16px] px-2.5 py-[60px] min-[1024px]:h-[540px] min-[1024px]:px-0 min-[1024px]:py-[120px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <LazyImage
              alt=""
              src={media("/ace/exhibitions.webp")}
              className="absolute inset-0 size-full object-cover opacity-80"
            />
          </div>
          <div className="absolute inset-0 bg-[rgba(18,18,18,0.4)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(35, 35, 35, 0) 0%, rgba(52, 52, 52, 1) 100%)",
            }}
          />
        </div>
        <div className="relative flex w-full flex-col items-center gap-5 text-center text-white min-[1024px]:w-auto min-[1024px]:gap-4">
          <h2
            id="exhibitions-heading"
            className="w-full font-display text-[40px] leading-none font-medium tracking-[-1px] text-pretty capitalize [text-shadow:0px_4px_12px_rgba(0,0,0,0.8)] min-[1024px]:w-auto min-[1024px]:text-[54px] min-[1024px]:leading-[1.1] min-[1024px]:tracking-[-1.755px] min-[1024px]:whitespace-nowrap"
          >
            Meet Us at Exhibitions!
          </h2>
          <p className="w-full font-sans text-[14px] leading-[1.5] font-[475] tracking-[0.175px] text-pretty min-[1024px]:hidden">
            Keep up with Ace news and meet us at our exhibitions. Subscribe and
            stay posted.
          </p>
          <p className="hidden font-sans text-[14px] leading-[1.5] font-[475] tracking-[0.175px] whitespace-nowrap min-[1024px]:block">
            Try our latest machines live, in person at the next exhibition. We
            look forward to meeting you!
          </p>
        </div>
        <SubscribeForm className="relative z-10 w-full min-[1024px]:w-[400px]" />
      </div>
    </section>
  );
}
