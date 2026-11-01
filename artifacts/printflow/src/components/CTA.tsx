import { useState } from "react";

const CTA = () => {
  const [email, setEmail] = useState("");
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
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent rounded border border-border px-5 py-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-highlight"
          />
          <button
            type="submit"
            className="rounded bg-highlight text-highlight-foreground px-8 py-4 text-eyebrow hover:brightness-110 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default CTA;
