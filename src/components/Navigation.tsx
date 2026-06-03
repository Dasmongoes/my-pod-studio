import { Search, User, Menu, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b border-border z-50">
      <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          <button className="lg:hidden" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-7 text-eyebrow">
            <a href="/#shop" className="hover:opacity-60 transition-opacity">Shop Tees</a>
            <a href="/#collections" className="hover:opacity-60 transition-opacity">Styles</a>
            <a href="/#lookbook" className="hover:opacity-60 transition-opacity">Lookbook</a>
            <a href="/#journal" className="hover:opacity-60 transition-opacity">Process</a>
          </div>
        </div>

        <Link to="/" className="text-display text-2xl tracking-tighter font-medium absolute left-1/2 -translate-x-1/2">
          BincoHub
        </Link>

        <div className="flex items-center gap-5 flex-1 justify-end text-eyebrow">
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <Search className="w-4 h-4" />
          </button>
          <button aria-label="Account" className="hover:opacity-60 transition-opacity hidden sm:block">
            <User className="w-4 h-4" />
          </button>
          <button aria-label="Bag" className="hover:opacity-60 transition-opacity">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
