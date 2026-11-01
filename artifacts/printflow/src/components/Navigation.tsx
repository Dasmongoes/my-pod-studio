import { useEffect, useState } from "react";
import { Search, User, Menu, ShoppingBag, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import SearchDialog from "@/components/SearchDialog";
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

const LINKS = [
  { to: "/shop", label: "Shop Tees" },
  { to: "/#collections", label: "Styles" },
  { to: "/#lookbook", label: "Lookbook" },
  { to: "/#journal", label: "Process" },
];

const ACCOUNT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/account`;

const Navigation = () => {
  const { items, toggleCartOpen } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full bg-background/90 backdrop-blur-md border-b z-50 transition-shadow ${
          scrolled ? "border-border shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : "border-border/60"
        }`}
      >
        <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-7 text-eyebrow">
              {LINKS.map((l) =>
                l.to.startsWith("/#") ? (
                  <Link key={l.to} to={l.to} className="hover:text-highlight transition-colors">
                    {l.label}
                  </Link>
                ) : (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `hover:text-highlight transition-colors ${isActive ? "text-highlight" : ""}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ),
              )}
            </div>
          </div>

          <Link to="/" className="text-display text-3xl absolute left-1/2 -translate-x-1/2">
            BincoHub
          </Link>

          <div className="flex items-center gap-5 flex-1 justify-end text-eyebrow">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-60 transition-opacity flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <kbd className="hidden xl:inline text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>
            <a
              href={ACCOUNT_URL}
              aria-label="Account"
              className="hover:opacity-60 transition-opacity hidden sm:block"
            >
              <User className="w-4 h-4" />
            </a>
            <button
              aria-label={`Bag, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
              onClick={() => toggleCartOpen(true)}
              className="hover:opacity-60 transition-opacity relative p-1"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span
                  key={totalItems}
                  className="absolute -top-1 -right-1 bg-highlight text-highlight-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300"
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm p-0 flex flex-col [&>button]:hidden">
          <div className="h-16 px-6 flex items-center justify-between border-b border-border">
            <SheetTitle className="text-display text-2xl">BincoHub</SheetTitle>
            <SheetClose aria-label="Close menu">
              <X className="w-5 h-5" />
            </SheetClose>
          </div>
          <nav className="flex-1 px-6 py-8 flex flex-col gap-1">
            <SheetClose asChild>
              <Link to="/" className="text-display text-4xl py-2 hover:text-highlight transition-colors">
                Home
              </Link>
            </SheetClose>
            {LINKS.map((l) => (
              <SheetClose asChild key={l.to}>
                <Link to={l.to} className="text-display text-4xl py-2 hover:text-highlight transition-colors">
                  {l.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="px-6 py-6 border-t border-border flex flex-col gap-4 text-eyebrow">
            <button
              className="flex items-center gap-3 text-left"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search className="w-4 h-4" /> Search
            </button>
            <a href={ACCOUNT_URL} className="flex items-center gap-3">
              <User className="w-4 h-4" /> Account & Orders
            </a>
          </div>
        </SheetContent>
      </Sheet>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navigation;
