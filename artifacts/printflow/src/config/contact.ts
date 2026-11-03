// Contact details shown in the site footer. Leave a value empty to hide it.
export const CONTACT = {
  // Every address listed here is shown, in this order. "note" is optional text shown under it.
  emails: [
    { address: "support@bincohub.com" },
    { address: "hello@bincohub.com", note: "Collaborations, wholesale enquiries and general messages" },
  ] as { address: string; note?: string }[],
  // Instagram username without the @, e.g. "bincohub"
  instagram: "",
  // WhatsApp number with country code, shown as written, e.g. "+91 98765 43210"
  whatsapp: "+91 91758 56853",
};
