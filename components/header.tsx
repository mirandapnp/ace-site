import { LazyImage } from "@/components/lazy-visual";
import { SecondaryButton } from "@/components/secondary-button";
import { media } from "@/lib/media";

const links = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#products", label: "Products" },
] as const;

export function Header() {
  return (
    <>
      <header className="absolute top-0 left-0 z-20 hidden w-[1440px] items-center justify-between p-5 min-[960px]:flex">
        <a href="/" className="flex items-center gap-3">
          <span className="relative h-9 w-[50.594px] shrink-0 overflow-hidden">
            <LazyImage
              priority
              alt=""
              src={media("/ace/logo.webp")}
              className="absolute top-0 left-0 h-full w-[294.09%] max-w-none"
            />
          </span>
          <span className="font-display text-[16px] leading-[0.9] font-medium tracking-[-0.48px] text-white uppercase">
            Ace Amusement
          </span>
        </a>

        <div className="flex items-center gap-5 rounded-[20px]">
          <nav aria-label="Primary" className="flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 font-mono text-[12px] leading-[1.25] font-[470] tracking-[0.78px] text-white uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[10px]">
            <button type="button" aria-label="Search" className="shrink-0">
              <img alt="" src={media("/ace/search.svg")} width={35} height={35} />
            </button>
            <button type="button" aria-label="Language" className="shrink-0">
              <img alt="" src={media("/ace/language.svg")} width={35} height={35} />
            </button>
            <SecondaryButton href="#enquire" color="yellow">
              Enquire
            </SecondaryButton>
          </div>
        </div>
      </header>

      <header className="absolute top-0 left-0 z-20 flex w-[412px] items-center justify-between rounded-b-[12px] px-2 py-3 backdrop-blur-[20px] min-[960px]:hidden">
        <button type="button" aria-label="Language" className="size-[35px] shrink-0">
          <img alt="" src={media("/ace/language.svg")} width={35} height={35} />
        </button>

        <a href="/" aria-label="Ace Amusement home" className="relative h-[34px] w-[47.783px] shrink-0 overflow-hidden">
          <LazyImage
            priority
            alt=""
            src={media("/ace/logo.webp")}
            className="absolute top-0 left-0 h-full w-[294.09%] max-w-none"
          />
        </a>

        <button type="button" aria-label="Open menu" className="size-[35px] shrink-0">
          <img alt="" src={media("/ace/menu.svg")} width={35} height={35} />
        </button>
      </header>
    </>
  );
}
