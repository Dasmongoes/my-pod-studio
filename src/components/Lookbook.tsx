import lookbook from "@/assets/lookbook.jpg";

const Lookbook = () => {
  return (
    <section id="lookbook" className="bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/5] lg:aspect-auto overflow-hidden">
          <img
            src={lookbook}
            alt="FW26 lookbook"
            loading="lazy"
            width={1600}
            height={1024}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="bg-foreground text-background flex items-center px-8 lg:px-20 py-20 lg:py-32">
          <div className="max-w-md">
            <p className="text-eyebrow opacity-60 mb-6">Lookbook / FW26</p>
            <h2 className="text-display text-5xl lg:text-7xl mb-8">
              Wear what<br/>you stand for.
            </h2>
            <p className="text-base opacity-70 mb-10 leading-relaxed">
              A study in restraint and weight. Premium 280gsm cotton, garment dyed and washed for a worn-in hand. Built to last seasons, not trends.
            </p>
            <a href="#" className="inline-flex items-center gap-3 border-b border-background pb-1 text-eyebrow hover:opacity-70 transition-opacity">
              Explore The Story →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lookbook;
