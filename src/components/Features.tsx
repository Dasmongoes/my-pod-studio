import { Zap, Shield, Truck, Sparkles, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Orders printed and shipped within 2-4 business days",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "High-quality fabrics and eco-friendly inks",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free worldwide shipping on all orders over $50",
  },
  {
    icon: Sparkles,
    title: "Easy Designer",
    description: "Intuitive design tools with thousands of templates",
  },
  {
    icon: TrendingUp,
    title: "Track Sales",
    description: "Real-time analytics and profit tracking dashboard",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join 50k+ creators selling custom designs",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-8 rounded-2xl border border-border bg-card hover:bg-gradient-card hover:border-primary/30 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <feature.icon className="w-7 h-7 text-background" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">
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
