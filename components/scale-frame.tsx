const frameWidth = 1440;

export function ScaleFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-black" style={{ containerType: "inline-size" }}>
      <div
        className="w-[1440px] bg-black"
        style={{ zoom: `calc(100cqw / ${frameWidth}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
