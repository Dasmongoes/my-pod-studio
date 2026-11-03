import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { contactLinks } from "@/lib/contactLinks";

const Contact = () => {
  usePageTitle("Contact Us");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-eyebrow text-muted-foreground mb-3">Get in touch</p>
          <h1 className="text-display text-5xl md:text-6xl mb-6">Contact Us</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            Questions about an order, or an idea you'd like to work on together? Reach us here. For order questions,
            please include your order number.
          </p>
          <ul className="border-t border-border">
            {contactLinks.map(({ href, label, note, Icon }) => (
              <li key={href} className="border-b border-border py-6 flex items-start gap-4">
                <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-base font-medium break-all hover:underline underline-offset-4"
                  >
                    {label}
                  </a>
                  {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
