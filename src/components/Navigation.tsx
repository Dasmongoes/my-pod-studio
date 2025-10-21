import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-3xl font-black bg-gradient-accent bg-clip-text text-transparent">
              PrintFlow
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#designs" className="text-foreground hover:text-primary transition-colors font-medium">
                Designs
              </a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-foreground hover:text-primary transition-colors font-medium">
                Pricing
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="font-semibold">
                Sign In
              </Button>
              <Button className="bg-gradient-hero text-background hover:opacity-90 font-bold shadow-glow">
                Start Free
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
