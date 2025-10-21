import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      
      <div className="container relative z-10 px-4 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-background">No Minimums · No Inventory</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-background mb-6 leading-tight tracking-tight animate-slide-up">
          Design. Sell.
          <br />
          <span className="bg-gradient-accent bg-clip-text text-transparent">We Print.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-background/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Create custom t-shirts and apparel with zero upfront costs. Focus on your designs while we handle production and shipping.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg"
            className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-6 shadow-vibrant font-bold"
          >
            Start Designing Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-background/10 hover:bg-background/20 text-background border-background/30 text-lg px-8 py-6 backdrop-blur-sm font-semibold"
          >
            View Catalog
          </Button>
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-background/80 text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Free Mockups</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Fast Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Premium Quality</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
