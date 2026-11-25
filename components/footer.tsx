import { media } from "@/lib/media";

const headingClass =
  "font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-[rgba(215,215,215,0.75)] uppercase";

const linkClass =
  "font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] text-white uppercase";

const fineClass =
  "font-mono text-[10px] leading-[1.25] font-medium tracking-[0.45px] text-[rgba(215,215,215,0.75)] uppercase";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "#products", label: "Products" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact Us" },
] as const;

const productLinks = [
  { href: "#products", label: "New & Hot" },
  { href: "#products", label: "Drive Racing Games" },
  { href: "#products", label: "Shooting Games" },
  { href: "#products", label: "Redemtion Games" },
] as const;

const contactRows = [
  { label: "Call", value: "+86 760-8848 8920", href: "tel:+8676088488920" },
  { label: "Whatsapp", value: "8613702518464", href: "https://wa.me/8613702518464" },
  {
    label: "Email",
    value: "Sales@ACE-Amusement.com",
    href: "mailto:Sales@ACE-Amusement.com",
  },
] as const;

const socials = [
  { href: "https://www.instagram.com/", label: "Instagram", icon: "/ace/instagram.svg" },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: "/ace/linkedin.svg" },
  { href: "https://www.facebook.com/", label: "Facebook", icon: "/ace/facebook.svg" },
] as const;

export function Footer() {
  return (
    <footer className="w-[412px] px-2.5 py-2.5 min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:py-5">
      <div className="flex w-full flex-col items-center gap-20 rounded-[16px] bg-[rgba(78,78,78,0.5)] px-2.5 pt-10 pb-5 min-[1024px]:gap-[120px] min-[1024px]:px-5 min-[1024px]:pt-[60px]">
        <div className="flex w-full flex-col gap-10 min-[1024px]:flex-row min-[1024px]:items-start min-[1024px]:justify-between min-[1024px]:gap-0">
          <div className="flex w-full gap-20 min-[1024px]:contents">
            <div className="flex flex-col gap-5">
              <p className={headingClass}>Quick Links</p>
              <nav aria-label="Footer" className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <a key={link.label} href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-5">
              <p className={headingClass}>Product Center</p>
              <nav aria-label="Product center" className="flex flex-col gap-2">
                {productLinks.map((link) => (
                  <a key={link.label} href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className={headingClass}>Contact</p>
            <div className="flex flex-col gap-2">
              {contactRows.map((row) => (
                <a key={row.label} href={row.href} className={`flex gap-3 ${linkClass}`}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <p className={headingClass}>Address</p>
            <p className={`${linkClass} text-pretty min-[1024px]:whitespace-pre-line`}>
              {`No. 22, Shagang East Road, Gankou Town,\nZhongshan City, Guangdong Province, China\n528447`}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <p className={headingClass}>Social</p>
            <div className="flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-8 items-center justify-center rounded-full bg-[rgba(215,215,215,0.25)]"
                >
                  <img alt="" src={media(social.icon)} width={14} height={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-10">
          <a href="/" aria-label="Ace Amusement home" className="block h-[100px] w-[106px] shrink-0">
            <img
              alt=""
              src={media("/ace/footer-logo.webp")}
              width={106}
              height={100}
              className="size-full object-contain"
            />
          </a>

          <div
            className={`flex w-full flex-col items-center gap-5 text-center min-[1024px]:flex-row min-[1024px]:justify-between min-[1024px]:gap-0 min-[1024px]:text-left ${fineClass}`}
          >
            <div className="flex items-center gap-5 min-[1024px]:gap-10">
              <a href="#terms">Terms and Conditions</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
            <p className="whitespace-nowrap">
              Copyright © 2026 by ACE Amusement International Co., Ltd.
            </p>
            <a
              href="https://pillandpillow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="min-[1024px]:text-right"
            >
              Site by Pill and Pillow
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
