import { Phone, Users, Zap, Shield, Headphones, Leaf } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Acoustic Excellence",
    description: "Superior soundproofing for private conversations and focused work",
  },
  {
    icon: Users,
    title: "Flexible Capacity",
    description: "From solo pods to team meeting spaces, we have the right size",
  },
  {
    icon: Zap,
    title: "Quick Installation",
    description: "Modular design allows setup in hours, not days",
  },
  {
    icon: Shield,
    title: "Premium Materials",
    description: "Durable construction with high-quality, sustainable materials",
  },
  {
    icon: Headphones,
    title: "Tech-Ready",
    description: "Integrated power, USB ports, and AV equipment compatibility",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Sustainable materials and energy-efficient ventilation systems",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose PodSpace
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Engineered for performance, designed for comfort
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-soft transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
