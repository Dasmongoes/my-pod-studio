import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PAGE_META } from "@/config/seo";
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

const textLink = "underline underline-offset-4 hover:text-foreground";

const questions: { q: string; a: ReactNode }[] = [
  {
    q: "How long will my order take?",
    a: "Each tee is printed to order and dispatched in 1–5 days. Delivery time after that depends on your address, and you'll see the estimate at checkout.",
  },
  {
    q: "Where do you deliver?",
    a: "We currently deliver within India only.",
  },
  {
    q: "How much is shipping?",
    a: "Shipping is calculated at checkout once you've entered your address, so you'll see the full cost before you pay.",
  },
  {
    q: "How do I track my order?",
    a: (
      <>
        <a href={`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/account`} className={textLink}>Sign in to your account</a> to
        see your order, or <Link to="/contact" className={textLink}>contact us</Link> with your order number.
      </>
    ),
  },
  {
    q: "Can I return or exchange a tee?",
    a: "Because every tee is printed for your order, we can't accept returns or exchanges for a change of mind or the wrong size. Please check the size guide on the product page before you order.",
  },
  {
    q: "My tee arrived damaged or wrong. What now?",
    a: (
      <>
        Email <a href="mailto:support@bincohub.com" className={textLink}>support@bincohub.com</a> within 7 days of
        delivery with your order number and an unboxing video, and we'll help put it right.
      </>
    ),
  },
  {
    q: "How do your tees fit?",
    a: "They're a roomy unisex oversized fit with drop shoulders, in sizes XS to 3XL. Each product page has a size guide with chest, length and shoulder measurements.",
  },
  {
    q: "What are the tees made of, and how do I wash them?",
    a: "A 260 GSM terry fabric in a 90/10 cotton-polyester blend. Wash inside-out in cold water, dry on low heat and flip inside out before ironing.",
  },
];

const Faq = () => {
  usePageTitle(PAGE_META.faq.title, { description: PAGE_META.faq.description });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-eyebrow text-muted-foreground mb-3">Help</p>
          <h1 className="text-display text-5xl md:text-6xl mb-10">FAQ</h1>
          <Accordion type="multiple" className="border-t border-border">
            {questions.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left text-base font-medium">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-10 text-sm text-muted-foreground">
            Still need help? <Link to="/contact" className={textLink}>Contact us</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
