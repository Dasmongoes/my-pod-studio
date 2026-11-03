import type { ComponentType } from "react";
import { Mail } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { CONTACT } from "@/config/contact";

export interface ContactLink {
  href: string;
  label: string;
  note?: string;
  Icon: ComponentType<{ className?: string }>;
}

const digits = (s: string) => s.replace(/\D/g, "");
const instagram = CONTACT.instagram.replace(/^@/, "");

// Contact links built from src/config/contact.ts; empty values are skipped.
export const contactLinks: ContactLink[] = [
  ...CONTACT.emails.map(({ address, note }) => ({ href: `mailto:${address}`, label: address, note, Icon: Mail })),
  ...(instagram ? [{ href: `https://instagram.com/${instagram}`, label: `@${instagram}`, Icon: FaInstagram }] : []),
  ...(CONTACT.whatsapp
    ? [{ href: `https://wa.me/${digits(CONTACT.whatsapp)}`, label: CONTACT.whatsapp, note: "WhatsApp", Icon: FaWhatsapp }]
    : []),
];
