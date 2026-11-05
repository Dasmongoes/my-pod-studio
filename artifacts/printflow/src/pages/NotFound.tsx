import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page not found", { noindex: true });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-40 text-center">
        <p className="text-eyebrow text-muted-foreground mb-4">Error 404</p>
        <h1 className="text-display text-6xl md:text-8xl mb-6 uppercase">Lost.</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-10 leading-relaxed max-w-sm">
          The page you requested doesn't exist or has moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest bg-foreground text-background px-8 py-4 font-semibold hover:opacity-90 transition-opacity"
          >
            Shop all tees
          </Link>
          <Link
            to="/"
            className="text-xs uppercase tracking-widest border border-border px-8 py-4 font-semibold hover:border-foreground transition-colors"
          >
            Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
