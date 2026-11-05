import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopifyProduct, productCategory } from "@/lib/shopify";

// Style tiles. A tile appears once a product with that Product type exists in Shopify
// (Products → product → Product organization → Type).
const categories = ["Graphics", "Typography", "Oversized", "Vintage Wash"];
const desktopColumns: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const Features = () => {
  const { data: products = [] } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
    staleTime: 1000 * 60 * 5,
  });
  const countFor = (name: string) =>
    products.filter((p) => productCategory(p)?.toLowerCase() === name.toLowerCase()).length;
  const visible = categories.filter((name) => countFor(name) > 0);
  if (visible.length === 0) return null;
  return (
    <section id="collections" className="bg-background border-t border-border">
      <div className="px-6 lg:px-10 py-20 lg:py-28">
        <div className="mb-12">
          <p className="text-eyebrow eyebrow-bar text-muted-foreground mb-3">Shop By Style</p>
          <h2 className="text-display text-5xl md:text-7xl">Tee Collections.</h2>
        </div>

        <div className={`grid grid-cols-2 ${desktopColumns[visible.length]} border-t border-border`}>
          {visible.map((name, i) => {
            const count = countFor(name);
            return (
            <Link
              key={name}
              to={`/shop?style=${encodeURIComponent(name)}`}
              className={`group relative aspect-square ${visible.length < 4 ? "lg:aspect-[2/1]" : ""} border-b border-r border-border last:border-r-0 lg:border-b-0 flex flex-col justify-between p-6 lg:p-8 hover:bg-highlight hover:text-highlight-foreground transition-colors duration-300`}
            >
              <span className="text-eyebrow opacity-60">0{i + 1}</span>
              <div>
                <h3 className="text-display text-3xl lg:text-4xl mb-2">{name}</h3>
                <p className="text-xs text-muted-foreground group-hover:text-highlight-foreground/80">
                  {count} {count === 1 ? "Tee" : "Tees"}
                </p>
                <span className="inline-block mt-6 text-eyebrow border-b border-current pb-1">
                  Shop →
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
