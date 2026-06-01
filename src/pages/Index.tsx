import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import Lookbook from "@/components/Lookbook";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <FeaturedDesigns />
        <Lookbook />
        <Features />
        <HowItWorks />
        <CTA />
      </main>

      <footer className="bg-background border-t border-border">
        <div className="px-6 lg:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 md:col-span-2">
              <div className="text-display text-3xl mb-4">BincoHub</div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Premium print-on-demand apparel. Designed in studio, made on demand, shipped worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-eyebrow mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">T-Shirts</a></li>
                <li><a href="#" className="hover:text-foreground">Hoodies</a></li>
                <li><a href="#" className="hover:text-foreground">Outerwear</a></li>
                <li><a href="#" className="hover:text-foreground">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-eyebrow mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Shipping</a></li>
                <li><a href="#" className="hover:text-foreground">Returns</a></li>
                <li><a href="#" className="hover:text-foreground">Sizing</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-eyebrow mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Journal</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground uppercase tracking-wider">
            <p>© 2026 PRINTFLOW. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
