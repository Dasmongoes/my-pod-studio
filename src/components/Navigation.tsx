import { Button } from "@/components/ui/button";

const Navigation = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PodSpace
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-foreground hover:text-primary transition-colors">
              Products
            </a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>
          
          <Button 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
