const items = [
  "FREE SHIPPING OVER $150",
  "NEW TEE DROP — FW26",
  "100% HEAVYWEIGHT COTTON",
  "PRINTED ON DEMAND",
  "DELIVERY ACROSS INDIA",
  "ONE PRODUCT. DONE RIGHT.",
];

const Marquee = () => {
  const loop = [...items, ...items];
  return (
    <div className="bg-highlight text-highlight-foreground py-3 overflow-hidden">
      <div className="flex marquee whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="text-eyebrow mx-8 flex items-center gap-8">
            {item}
            <span className="opacity-60">●</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
