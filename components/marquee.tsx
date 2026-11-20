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
    <div className="h-[35px] w-[1440px] overflow-hidden" aria-label={label}>
      <div className="ace-ticker flex w-max items-end">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-start gap-7 py-[10px] pr-7 font-mono text-[12px] leading-[1.25] font-[470] tracking-[0.78px] whitespace-nowrap text-white uppercase"
          >
            {items.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex gap-7">
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
