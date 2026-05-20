const steps = [
  { n: "01", title: "Design", desc: "Upload artwork or build in our studio with templates and tools." },
  { n: "02", title: "Customize", desc: "Choose products, colorways, sizing, and set your retail price." },
  { n: "03", title: "Launch", desc: "Go live in minutes — share your store and start selling." },
  { n: "04", title: "We Fulfill", desc: "We print on premium blanks, pack, and ship every order globally." },
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
            Zero inventory. Zero waste. Every garment is produced only after it's sold — built for creators who care about quality and consequence.
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
