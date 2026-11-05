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
            <p className="text-eyebrow eyebrow-bar opacity-70 mb-6">The Tee / FW26</p>
            <h2 className="text-display text-5xl lg:text-7xl mb-8">
              Made to<br/>be worn.
            </h2>
            <p className="text-base opacity-70 mb-10 leading-relaxed">
              260 GSM terry fabric in a 90/10 cotton-polyester blend. A roomy unisex fit with drop shoulders, printed only after you order.
            </p>
            <a href="#journal" className="inline-flex items-center gap-3 border-b-2 border-highlight pb-1 text-eyebrow hover:opacity-70 transition-opacity">
              See How It's Made →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lookbook;
