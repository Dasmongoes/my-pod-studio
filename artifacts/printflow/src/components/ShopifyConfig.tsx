import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getShopifyCredentials, isShopifyConfigured } from "@/lib/shopify";
import { Settings, CheckCircle, HelpCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const ShopifyConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [token, setToken] = useState("");
  const [configured, setConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const creds = getShopifyCredentials();
    setDomain(creds.domain);
    setToken(creds.accessToken);
    setConfigured(isShopifyConfigured());
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim() || !token.trim()) {
      toast.error("Please fill in both Shopify Domain and Access Token");
      return;
    }

    setIsTesting(true);
    
    // Clean domain
    const cleanDomain = domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

    try {
      // Test the API connection by making a minimal GraphQL call
      const testUrl = `https://${cleanDomain}/api/2024-04/graphql.json`;
      const testQuery = `{ shop { name } }`;

      const response = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token.trim(),
        },
        body: JSON.stringify({ query: testQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.errors) {
        throw new Error(resJson.errors[0].message);
      }

      const shopName = resJson.data?.shop?.name || "Shopify Store";

      // Save credentials
      localStorage.setItem("shopify_store_domain", cleanDomain);
      localStorage.setItem("shopify_storefront_access_token", token.trim());
      
      setConfigured(true);
      toast.success(`Successfully connected to: ${shopName}!`, {
        description: "The catalog will now load products from your store.",
      });

      setIsOpen(false);
      // Reload page to refresh React Query cache & reload client with new creds
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error("Connection failed", {
        description: `Please verify your domain and access token. Error: ${error.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("shopify_store_domain");
    localStorage.removeItem("shopify_storefront_access_token");
    
    setDomain("");
    setToken("");
    setConfigured(false);
    
    toast.success("Disconnected Shopify credentials", {
      description: "Returning to local Demo Mode catalog.",
    });

    setIsOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      {/* Floating config badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-foreground text-background p-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-xs uppercase tracking-wider font-semibold border border-background/20 group"
        aria-label="Shopify Connection Configuration"
      >
        <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 ease-out inline-block whitespace-nowrap">
          {configured ? "Shopify: Connected" : "Shopify: Sandbox"}
        </span>
        <span className={`w-2 h-2 rounded-full ${configured ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l border-border p-6 overflow-y-auto">
          <SheetHeader className="pb-6 border-b border-border">
            <SheetTitle className="text-eyebrow text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Shopify Configuration
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-2">
              Configure your Shopify Storefront API settings here to dynamically load real products, prices, and variant selections.
            </SheetDescription>
          </SheetHeader>

          {/* Connection Status Box */}
          <div className="my-6 p-4 border rounded-none flex items-start gap-3 bg-muted/30">
            {configured ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-foreground">Connected Mode</h4>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Products are loaded dynamically from <code className="text-foreground">{domain}</code>. Checkout will redirect to your official checkout page.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-foreground">Sandbox Mode</h4>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Running in simulated storefront mode. Showing local heavyweight premium designs. Paste your Shopify API credentials below to connect your real store.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-foreground mb-2">
                  Shopify Store Domain
                </label>
                <input
                  type="text"
                  placeholder="your-store-name.myshopify.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-foreground mb-2">
                  Storefront Access Token
                </label>
                <input
                  type="password"
                  placeholder="shpca_..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </div>

              {/* Instructions */}
              <div className="border-t border-border pt-6">
                <h5 className="text-[10px] uppercase tracking-wider font-semibold text-foreground flex items-center gap-1.5 mb-3">
                  <HelpCircle className="w-3.5 h-3.5" />
                  How to generate storefront token?
                </h5>
                <ol className="list-decimal pl-4 text-[11px] text-muted-foreground space-y-2 leading-relaxed">
                  <li>Go to Shopify Admin &rarr; <b>Settings</b> &rarr; <b>Apps and sales channels</b>.</li>
                  <li>Click <b>Develop apps</b> and then click <b>Create an app</b>.</li>
                  <li>In the Configuration tab, select <b>Configure Storefront API scopes</b>.</li>
                  <li>Select scopes (e.g. <code className="text-foreground font-mono">unauthenticated_read_products</code>).</li>
                  <li>Click <b>Install app</b>. Copy the Storefront access token from the API credentials tab.</li>
                </ol>
              </div>
            </div>

            <div className="pt-8 border-t border-border mt-8 space-y-3">
              <button
                type="submit"
                disabled={isTesting}
                className="w-full bg-foreground text-background py-4 uppercase tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test & Save Connection"
                )}
              </button>

              {configured && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="w-full border border-destructive text-destructive py-4 uppercase tracking-widest text-xs font-semibold hover:bg-destructive/5 transition-colors"
                >
                  Disconnect Credentials
                </button>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShopifyConfig;
