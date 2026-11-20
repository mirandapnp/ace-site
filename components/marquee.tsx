const defaultItems = [
  "Global Arcade Logistics",
  "Rapid ROI",
  "Global Arcade Logistics",
  "Zero-Downtime Engineering",
  "Rapid ROI",
  "Global Arcade Logistics",
  "Zero-Downtime Engineering",
] as const;

export function Marquee({
  items = defaultItems,
}: {
  items?: readonly string[];
}) {
  const label = items.filter((item, index) => items.indexOf(item) === index).join(", ");

  return (
    <div
      className="flex w-[412px] items-center overflow-hidden py-5 min-[1024px]:h-[35px] min-[1024px]:w-[1440px] min-[1024px]:py-0"
      aria-label={label}
    >
      <div className="ace-ticker flex w-max items-center py-2.5 min-[1024px]:py-0">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-5 pr-5 font-mono text-[12px] leading-[1.25] font-[470] tracking-[0.78px] whitespace-nowrap text-white uppercase min-[1024px]:gap-7 min-[1024px]:pr-7"
          >
            {items.map((item, index) => (
              <span
                key={`${copy}-${index}`}
                className="flex gap-5 min-[1024px]:gap-7"
              >
                <span>{item}</span>
                <span aria-hidden>/</span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
