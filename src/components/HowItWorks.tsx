import { Palette, Upload, Rocket, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Palette,
    title: "Create Your Design",
    description: "Use our designer tool or upload your own artwork",
    color: "text-primary",
  },
  {
    icon: Upload,
    title: "Upload & Customize",
    description: "Choose products, colors, and set your prices",
    color: "text-secondary",
  },
  {
    icon: Rocket,
    title: "Start Selling",
    description: "Share your store and promote your designs",
    color: "text-accent",
  },
  {
    icon: DollarSign,
    title: "We Handle the Rest",
    description: "We print, pack, and ship every order for you",
    color: "text-primary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start selling in 4 simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="mb-6 inline-flex">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow`}>
                    <step.icon className="w-10 h-10 text-background" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-4 border-background flex items-center justify-center">
                    <span className="text-sm font-black text-foreground">{index + 1}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
