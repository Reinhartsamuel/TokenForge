import { Code2, BookOpen, FileText, Bird, MessageSquare, ShieldCheck } from "lucide-react";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "GitHub Repository", href: "https://github.com/reinhartsamuel/tokenforge", icon: Code2 },
      { label: "SDK Documentation", href: "https://github.com/reinhartsamuel/tokenforge/tree/main/sdk", icon: BookOpen },
      { label: "Technical Specifications", href: "https://github.com/reinhartsamuel/tokenforge/tree/main/SPECIFICATION", icon: FileText },
      { label: "Pitch Deck", href: "https://github.com/reinhartsamuel/tokenforge/tree/main/pitch-deck", icon: FileText },
    ],
  },
  community: {
    title: "Community",
    links: [
      { label: "Twitter/X", href: "https://twitter.com", icon: Bird },
      { label: "Discord", href: "https://discord.com", icon: MessageSquare },
      { label: "Solana Foundation", href: "https://solana.com", icon: ShieldCheck },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Apache-2.0 License", href: "https://github.com/reinhartsamuel/tokenforge/blob/main/LICENSE", icon: FileText },
    ],
  },
};

export function FooterSection() {
  return (
    <footer className="py-12 bg-[#0F0F23] border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-white mb-2">TokenForge</div>
            <p className="text-sm text-[#8B8BA7]">
              The Metaplex of RWA Tokens
            </p>
            <p className="text-xs text-[#8B8BA7] mt-4">
              Built for the Solana Frontier Hackathon
            </p>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#8B8BA7] hover:text-[#14F195] transition-colors inline-flex items-center gap-2"
                    >
                      <link.icon className="h-4 w-4 flex-shrink-0" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-[#8B8BA7]">
            &copy; {new Date().getFullYear()} TokenForge. Apache-2.0 License.
          </p>
        </div>
      </div>
    </footer>
  );
}
