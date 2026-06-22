import Link from "next/link";

const footerLinks = {
  platform: [
    { label: "Overview", href: "#platform" },
    { label: "Compliance", href: "#compliance" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/reinhartsamuel/tokenforge" },
    { label: "Pitch Deck", href: "/pitch-deck.html" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function FooterSection() {
  return (
    <footer className="border-t border-slate-200/60 bg-gradient-to-b from-[#F8FAFC] to-[#F0F4F8] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/lp-3" className="flex items-center gap-2 mb-4">
              <img src="/anviltokenforge2.webp" alt="TokenForge" className="h-8 w-8" />
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">TokenForge</span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              The compliant tokenization platform for Indonesian digital assets. Built on Solana.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TokenForge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Built on Solana
          </div>
        </div>
      </div>
    </footer>
  );
}
