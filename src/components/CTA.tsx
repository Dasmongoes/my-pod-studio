import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-background rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-background rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-background">Join 50,000+ Creators</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-background mb-6 leading-tight">
            Ready to Start Your
            <br />
            <span className="bg-gradient-to-r from-background to-background/70 bg-clip-text text-transparent">
              T-Shirt Empire?
            </span>
          </h2>
          
          <p className="text-xl text-background/90 mb-10 leading-relaxed">
            No credit card required. Start designing and selling in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-6 shadow-vibrant font-bold"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-background/10 hover:bg-background/20 text-background border-background/30 text-lg px-8 py-6 backdrop-blur-sm font-semibold"
            >
              See Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
