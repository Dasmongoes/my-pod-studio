import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";
import tshirt4 from "@/assets/tshirt-4.jpg";

const designs = [
  {
    id: 1,
    name: "Geometric Burst",
    price: "$29.99",
    image: tshirt1,
    tag: "Trending",
  },
  {
    id: 2,
    name: "Neon Dreams",
    price: "$32.99",
    image: tshirt2,
    tag: "New",
  },
  {
    id: 3,
    name: "Minimalist Lines",
    price: "$27.99",
    image: tshirt3,
    tag: "Popular",
  },
  {
    id: 4,
    name: "Retro Wave",
    price: "$31.99",
    image: tshirt4,
    tag: "Limited",
  },
];

const FeaturedDesigns = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-accent text-accent-foreground border-0">
            Featured Collection
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4">
            Trending Designs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular custom designs loved by thousands
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {designs.map((design, index) => (
            <Card 
              key={design.id} 
              className="group overflow-hidden border-border bg-card hover:shadow-vibrant transition-all duration-500 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  src={design.image} 
                  alt={design.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground border-0 shadow-lg">
                    {design.tag}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 rounded-full bg-background/90 hover:bg-background shadow-lg transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-card-foreground mb-1">
                  {design.name}
                </h3>
                <p className="text-2xl font-black bg-gradient-accent bg-clip-text text-transparent">
                  {design.price}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
