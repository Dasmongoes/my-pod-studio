import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import podCall from "@/assets/pod-call.jpg";
import podMeeting from "@/assets/pod-meeting.jpg";
import podFocus from "@/assets/pod-focus.jpg";

const products = [
  {
    title: "Solo Pod",
    description: "Perfect for private calls and focused work sessions",
    image: podCall,
    features: ["Soundproof design", "Ventilation system", "USB charging ports"],
  },
  {
    title: "Meeting Pod",
    description: "Collaborative space for teams of 4-6 people",
    image: podMeeting,
    features: ["Video conferencing ready", "Whiteboard surface", "Premium acoustics"],
  },
  {
    title: "Focus Pod",
    description: "Ultimate concentration zone for deep work",
    image: podFocus,
    features: ["Ergonomic desk", "Adjustable lighting", "Climate control"],
  },
];

const Products = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Pod Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed for modern workspaces, built for productivity
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.title} className="overflow-hidden border-border shadow-soft hover:shadow-elegant transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{product.title}</CardTitle>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
