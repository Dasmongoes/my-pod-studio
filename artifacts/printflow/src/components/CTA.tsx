import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/shopify";

const CTA = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const result = await subscribeToNewsletter(email);
    if (result === "subscribed" || result === "already") {
      setStatus("done");
      setEmail("");
      toast.success(result === "already" ? "You're already on the list." : "You're on the list. Welcome!");
    } else {
      setStatus("idle");
      toast.error(result === "invalid" ? "Please enter a valid email address." : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="bg-card text-foreground border-t border-border">
      <div className="px-6 lg:px-10 py-24 lg:py-40 text-center max-w-4xl mx-auto">
        <p className="text-eyebrow eyebrow-bar opacity-70 mb-6">Newsletter</p>
        <h2 className="text-display text-5xl md:text-7xl lg:text-8xl mb-8">
          Be first to know.
        </h2>
        <p className="text-base opacity-70 mb-12 max-w-md mx-auto">
          Early access to drops, lookbooks and brand stories. Straight to your inbox.
        </p>
        {status === "done" ? (
          <p className="inline-flex items-center gap-3 text-eyebrow" role="status">
            <Check className="h-4 w-4 text-highlight" /> Thanks, you're subscribed.
          </p>
        ) : (
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            aria-label="Email address"
            autoComplete="email"
            disabled={status === "sending"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent rounded border border-border px-5 py-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-highlight"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded disabled:opacity-70 bg-highlight text-highlight-foreground px-8 py-4 text-eyebrow hover:brightness-110 transition"
          >
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            Subscribe
          </button>
        </form>
        )}
        <p className="mt-6 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default CTA;
