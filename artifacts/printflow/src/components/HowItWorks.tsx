const steps = [
  { n: "01", title: "Pick A Tee", desc: "Browse our edit of printed t-shirts — graphics, typography, oversized, washed." },
  { n: "02", title: "Choose Size", desc: "Heavyweight 280gsm cotton. Unisex sizing from XS to 3XL." },
  { n: "03", title: "We Print", desc: "Each tee is printed to order on premium blanks — never warehoused." },
  { n: "04", title: "Ships Worldwide", desc: "Packed and dispatched within 72 hours. Delivered to your door." },
];

const HowItWorks = () => {
  return (
    <section id="journal" className="bg-secondary border-t border-border">
      <div className="px-6 lg:px-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <p className="text-eyebrow text-muted-foreground mb-3">The Process</p>
            <h2 className="text-display text-5xl md:text-7xl">Made on<br/>demand.</h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-lg text-muted-foreground leading-relaxed self-end">
            One product. Done properly. Every t-shirt is printed only after it's ordered — no inventory, no waste, no compromise on quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-border">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="border-b md:border-r border-border last:border-r-0 py-10 pr-6 lg:pr-10 lg:py-14 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-eyebrow text-muted-foreground">{step.n}</span>
              <h3 className="text-display text-3xl mt-6 mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
