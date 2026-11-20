import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { media } from "@/lib/media";

export function Network() {
  return (
    <section
      className="w-[412px] px-2.5 py-2.5 min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:pt-5 min-[1024px]:pb-0"
      aria-labelledby="network-heading"
    >
      <div className="relative flex h-[600px] w-full flex-col overflow-hidden rounded-[16px] p-2.5 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] min-[1024px]:h-[540px] min-[1024px]:items-center min-[1024px]:justify-center min-[1024px]:gap-10 min-[1024px]:p-0 min-[1024px]:py-[120px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden opacity-60">
            <LazyImage
              alt=""
              src={media("/ace/network.webp")}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div
            className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 50% 279.72% at 50% 50%, rgba(179, 179, 179, 0) 0%, rgba(90, 90, 90, 0.25) 50%, rgba(45, 45, 45, 0.375) 75%, rgba(22, 22, 22, 0.4375) 87.5%, rgba(0, 0, 0, 0.5) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[rgba(38,38,38,0.5)]" />
        </div>

        <div className="relative flex flex-1 items-center justify-center min-[1024px]:flex-none">
          <div className="flex w-full flex-col items-center gap-5 text-center text-white min-[1024px]:w-auto">
            <h2
              id="network-heading"
              className="font-display text-[40px] leading-none font-medium tracking-[-1px] text-pretty capitalize [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)] min-[1024px]:text-[54px] min-[1024px]:leading-[1.1] min-[1024px]:tracking-[-1.755px] min-[1024px]:whitespace-nowrap"
            >
              A Global Network of Fun.
            </h2>
            <p className="w-full font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty min-[1024px]:w-[879.314px]">
              Our commitment to excellence has earned ACE Amusement a loyal global
              following.
              <br className="hidden min-[1024px]:inline" />{" "}
              We are proud to partner with top-tier distributors and operators
              worldwide to bring our games to life.
            </p>
          </div>
        </div>

        <PrimaryButton href="#about" className="relative z-10 w-full min-[1024px]:hidden">
          About Ace Amusement
        </PrimaryButton>
        <div className="relative z-10 hidden min-[1024px]:block">
          <PrimaryButton href="#about">About Ace Amusement</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
