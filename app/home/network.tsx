import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { media } from "@/lib/media";

export function Network() {
  return (
    <section className="w-[1440px] px-5 pt-5" aria-labelledby="network-heading">
      <div className="relative flex h-[540px] w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-[16px] py-[120px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden opacity-60">
            <LazyImage
              alt=""
              src={media("/ace/network.webp")}
              className="absolute top-[-27.79%] left-0 h-[186.69%] w-full max-w-none"
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
        <div className="relative flex flex-col items-center gap-5 text-center text-white">
          <h2
            id="network-heading"
            className="font-display text-[54px] leading-[1.1] font-medium tracking-[-1.755px] whitespace-nowrap [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)]"
          >
            A Global Network of Fun.
          </h2>
          <p className="w-[879.314px] font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty">
            Our commitment to excellence has earned ACE Amusement a loyal global
            following.
            <br />
            We are proud to partner with top-tier distributors and operators
            worldwide to bring our games to life.
          </p>
        </div>
        <PrimaryButton href="#about">About Ace Amusement</PrimaryButton>
      </div>
    </section>
  );
}
