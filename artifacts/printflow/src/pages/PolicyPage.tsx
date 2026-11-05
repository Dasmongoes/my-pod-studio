import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopPolicy } from "@/lib/shopify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

// Renders a store policy (privacy, refund, shipping, terms) written in Shopify admin → Settings → Policies.
const PolicyPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: policies = [], isLoading } = useQuery<ShopPolicy[]>({
    queryKey: ["policies"],
    queryFn: shopify.getPolicies,
    staleTime: 1000 * 60 * 30,
  });
  const policy = policies.find((p) => p.handle === handle);

  usePageTitle(policy?.title ?? (isLoading ? null : "Policy not found"), { noindex: !isLoading && !policy });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 w-2/3 bg-muted animate-pulse" />
              <div className="h-4 bg-muted animate-pulse" />
              <div className="h-4 bg-muted animate-pulse" />
              <div className="h-4 w-4/5 bg-muted animate-pulse" />
            </div>
          ) : !policy ? (
            <div className="text-center py-24">
              <h1 className="text-display text-5xl mb-6">Not found.</h1>
              <Link to="/" className="text-xs uppercase tracking-widest underline underline-offset-4">
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <p className="text-eyebrow text-muted-foreground mb-3">Policies</p>
              <h1 className="text-display text-5xl md:text-6xl mb-10">{policy.title}</h1>
              <article
                className="text-sm text-muted-foreground leading-relaxed space-y-4 [&_*]:![color:inherit] [&_*]:!bg-transparent
                  [&_h1]:![color:hsl(var(--foreground))] [&_h2]:![color:hsl(var(--foreground))] [&_h3]:![color:hsl(var(--foreground))]
                  [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-2
                  [&_h3]:font-semibold [&_h3]:mt-6 [&_strong]:![color:hsl(var(--foreground))]
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1
                  [&_a]:![color:hsl(var(--foreground))] [&_a]:underline [&_a]:underline-offset-4"
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
