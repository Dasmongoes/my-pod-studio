import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopPolicy } from "@/lib/shopify";
import { contactLinks } from "@/lib/contactLinks";

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
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
          <div>
            <h4 className="text-eyebrow mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
              {policies.map((p) => (
                <li key={p.handle}>
                  <Link to={`/policies/${p.handle}`} className="hover:text-foreground">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {contactLinks.length > 0 && (
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-eyebrow mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {contactLinks.map(({ href, label, note, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-foreground break-all"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </a>
                    {note && <p className="mt-1 pl-6 text-xs">{note}</p>}
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
