import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedDesigns />
      <HowItWorks />
      <Features />
      <CTA />
      
      <footer className="bg-foreground text-background py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-black bg-gradient-accent bg-clip-text text-transparent mb-4">
                PrintFlow
              </h3>
              <p className="text-background/70">
                Create and sell custom apparel with zero upfront costs.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-background/70 hover:text-background">T-Shirts</a></li>
                <li><a href="#" className="text-background/70 hover:text-background">Hoodies</a></li>
                <li><a href="#" className="text-background/70 hover:text-background">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-background/70 hover:text-background">Design Guide</a></li>
                <li><a href="#" className="text-background/70 hover:text-background">Pricing</a></li>
                <li><a href="#" className="text-background/70 hover:text-background">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-background/70 hover:text-background">About</a></li>
                <li><a href="#" className="text-background/70 hover:text-background">Contact</a></li>
                <li><a href="#" className="text-background/70 hover:text-background">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-background/20 text-center text-background/60">
            <p>&copy; 2025 PrintFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
