import { Search, User, Menu, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";

const Navigation = () => {
  const { items, toggleCartOpen } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
      <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          <button className="lg:hidden" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-7 text-eyebrow">
            <Link to="/shop" className="hover:text-highlight transition-colors">Shop Tees</Link>
            <a href="/#collections" className="hover:text-highlight transition-colors">Styles</a>
            <a href="/#lookbook" className="hover:text-highlight transition-colors">Lookbook</a>
            <a href="/#journal" className="hover:text-highlight transition-colors">Process</a>
          </div>
        </div>

        <Link to="/" className="text-display text-3xl absolute left-1/2 -translate-x-1/2">
          BincoHub
        </Link>

        <div className="flex items-center gap-5 flex-1 justify-end text-eyebrow">
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <Search className="w-4 h-4" />
          </button>
          <button aria-label="Account" className="hover:opacity-60 transition-opacity hidden sm:block">
            <User className="w-4 h-4" />
          </button>
          <button 
            aria-label="Bag" 
            onClick={() => toggleCartOpen(true)}
            className="hover:opacity-60 transition-opacity relative p-1"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-highlight text-highlight-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-fade-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
