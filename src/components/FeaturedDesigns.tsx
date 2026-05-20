import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";
import tshirt4 from "@/assets/tshirt-4.jpg";

const designs = [
  { id: 1, name: "Essential Oversized Tee", price: "$85", image: tshirt1, tag: "Core" },
  { id: 2, name: "Heavyweight Crew", price: "$95", image: tshirt2, tag: "New" },
  { id: 3, name: "Vintage Wash Tee", price: "$90", image: tshirt3, tag: "Limited" },
  { id: 4, name: "Relaxed Boxy Tee", price: "$88", image: tshirt4, tag: "FW26" },
];

const FeaturedDesigns = () => {
  return (
    <section id="shop" className="bg-background py-20 lg:py-32">
      <div className="px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-3">Latest Drop</p>
            <h2 className="text-display text-5xl md:text-7xl">FW26 Essentials.</h2>
          </div>
          <a href="#" className="hidden md:inline-flex text-eyebrow border-b border-foreground pb-1 hover:opacity-60 transition-opacity">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
          {designs.map((design, index) => (
            <a
              href="#"
              key={design.id}
              className="group block animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
                <img
                  src={design.image}
                  alt={design.name}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 left-3 text-eyebrow bg-background/90 px-2 py-1">
                  {design.tag}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                  {design.name}
                </h3>
                <span className="text-sm font-medium shrink-0">{design.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 colorways</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
