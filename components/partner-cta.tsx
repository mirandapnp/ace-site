import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { media } from "@/lib/media";

const metaType =
  "font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] uppercase";

export function PartnerCta({
  eyebrow = "Ready to level up?",
  signal = "Let’s Partner Up",
  title = (
    <>
      Upgrade Your
      <br />
      Arcade Floor Today
    </>
  ),
  body = "Contact us for pricing, shipping details, and availability on our top-earning machines.",
  action = "Start a conversation",
  href = "#contact",
  image = "/ace/partner-cta.webp",
}: {
  eyebrow?: string;
  signal?: string;
  title?: React.ReactNode;
  body?: string;
  action?: string;
  href?: string;
  image?: string;
}) {
  return (
    <section className="w-[1440px] px-5 pt-5" aria-labelledby="partner-cta-heading">
      <div className="relative flex h-[600px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-5 py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <LazyImage
            alt=""
            src={media(image)}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(178.14deg, rgba(0, 0, 0, 0.71) 0%, rgba(0, 0, 0, 0.28) 45.55%, rgba(54, 245, 146, 0.23) 89.19%), linear-gradient(90deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
            }}
          />
        </div>

        <div className="relative flex items-center justify-between">
          <p className={`${metaType} text-[#FFF645]`}>{eyebrow}</p>
          <p className={`flex items-center gap-2.5 ${metaType} text-[#36F592]`}>
            <span aria-hidden className="ace-blink size-1.5 shrink-0 bg-[#36F592]" />
            <span>{signal}</span>
          </p>
        </div>

        <div className="relative flex flex-col items-start gap-10">
          <div className="flex flex-col gap-4 text-white">
            <h2
              id="partner-cta-heading"
              className="font-display text-[54px] leading-[1.1] font-medium tracking-[-1.755px]"
            >
              {title}
            </h2>
            <p className="w-[500px] font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty">
              {body}
            </p>
          </div>
          <PrimaryButton href={href}>{action}</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
