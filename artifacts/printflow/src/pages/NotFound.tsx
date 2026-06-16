import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="text-center max-w-sm">
        <p className="text-eyebrow text-muted-foreground mb-4">Error 404</p>
        <h1 className="text-display text-6xl md:text-8xl mb-6 uppercase">Lost.</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-10 leading-relaxed">
          The page you requested does not exist or has been relocated in the archives.
        </p>
        <Link 
          to="/" 
          className="inline-block text-xs uppercase tracking-widest bg-foreground text-background px-8 py-4 font-semibold hover:opacity-90 transition-opacity"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
