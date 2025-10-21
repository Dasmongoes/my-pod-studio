import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Features from "@/components/Features";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Products />
      <Features />
      <Contact />
      
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PodSpace</h3>
              <p className="text-primary-foreground/80">
                Transforming workspaces with innovative privacy solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground">Products</a></li>
                <li><a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground">Features</a></li>
                <li><a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-primary-foreground/80">
                Email: hello@podspace.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
            <p>&copy; 2025 PodSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
