import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PAGE_META } from "@/config/seo";

const sections = [
  {
    title: "What we make",
    body: "BincoHub is a t-shirt label from India. We make printed oversized tees for people who want something a little different from what's on every rack.",
  },
  {
    title: "How it's made",
    body: "Every tee is printed only after it's ordered. We don't keep a warehouse of finished stock, so your tee is made for your order and dispatched in 1–5 days.",
  },
  {
    title: "The tee",
    body: "A 260 GSM terry fabric in a 90/10 cotton-polyester blend, cut as a roomy unisex fit with drop shoulders. Sizes run from XS to 3XL.",
  },
  {
    title: "Where we ship",
    body: "We currently deliver across India. Shipping is worked out at checkout once you've entered your address.",
  },
];

const About = () => {
  usePageTitle(PAGE_META.about.title, { description: PAGE_META.about.description });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-eyebrow text-muted-foreground mb-3">Our story</p>
          <h1 className="text-display text-5xl md:text-6xl mb-10">About Us</h1>
          <div className="border-t border-border">
            {sections.map(({ title, body }) => (
              <section key={title} className="border-b border-border py-8">
                <h2 className="text-display text-2xl mb-3">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </section>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className="rounded bg-highlight text-highlight-foreground px-8 py-4 text-eyebrow hover:brightness-110 transition">
              Shop The Tees
            </Link>
            <Link to="/contact" className="rounded border border-border px-8 py-4 text-eyebrow hover:border-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
