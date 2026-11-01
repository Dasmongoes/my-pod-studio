import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopPolicy } from "@/lib/shopify";

// Shared footer. Policy links come from Shopify, so a new policy appears here as soon as it's published.
const Footer = () => {
  const { data: policies = [] } = useQuery<ShopPolicy[]>({
    queryKey: ["policies"],
    queryFn: shopify.getPolicies,
    staleTime: 1000 * 60 * 30,
  });

  return (
    <footer className="bg-background border-t border-border">
      <div className="px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2">
            <Link to="/" className="text-display text-3xl mb-4 inline-block">
              BincoHub
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium printed t-shirts. Made on demand, printed for you.
            </p>
          </div>
          <div>
            <h4 className="text-eyebrow mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground">All Tees</Link></li>
              <li><Link to="/#lookbook" className="hover:text-foreground">Lookbook</Link></li>
              <li><Link to="/#journal" className="hover:text-foreground">How It's Made</Link></li>
            </ul>
          </div>
          {policies.length > 0 && (
            <div>
              <h4 className="text-eyebrow mb-4">Help</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {policies.map((p) => (
                  <li key={p.handle}>
                    <Link to={`/policies/${p.handle}`} className="hover:text-foreground">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="pt-8 border-t border-border text-xs text-muted-foreground uppercase tracking-wider">
          <p>© {new Date().getFullYear()} BincoHub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
