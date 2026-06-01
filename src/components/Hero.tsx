import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <img
        src={heroBg}
        alt="BincoHub campaign"
        width={1920}
        height={1280}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      <div className="relative h-full flex flex-col justify-between px-6 lg:px-10 py-24 pt-32 text-white">
        <div className="flex items-start justify-between">
          <span className="text-eyebrow opacity-80">FW 26 / Vol. 01</span>
          <span className="text-eyebrow opacity-80 hidden md:block">Made on demand · Shipped worldwide</span>
        </div>

        <div className="max-w-5xl">
          <p className="text-eyebrow mb-6 opacity-80 animate-fade-in">The New Collection</p>
          <h1 className="text-display text-[15vw] md:text-[10vw] lg:text-[8.5rem] leading-[0.85] mb-8 animate-slide-up">
            DESIGNED<br/>TO BE WORN.
          </h1>
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <a href="#shop" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-eyebrow hover:bg-white/90 transition-colors">
              Shop The Collection
            </a>
            <a href="#lookbook" className="inline-flex items-center gap-3 border border-white/40 text-white px-8 py-4 text-eyebrow hover:bg-white/10 transition-colors">
              View Lookbook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
