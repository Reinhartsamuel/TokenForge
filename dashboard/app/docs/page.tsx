"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Database,
  Layout,
  Route,
  Cpu,
  Shield,
  Settings2,
  Wrench,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections: { id: string; title: string }[];
}

const sections: Section[] = [
  {
    id: "architecture",
    title: "Architecture",
    icon: <Cpu className="h-4 w-4" />,
    subsections: [
      { id: "arch-overview", title: "Overview" },
      { id: "arch-design", title: "Key Design Decisions" },
    ],
  },
  {
    id: "routes",
    title: "Route Map",
    icon: <Route className="h-4 w-4" />,
    subsections: [
      { id: "routes-pages", title: "Dashboard Pages" },
      { id: "routes-api", title: "API Routes" },
    ],
  },
  {
    id: "api-ref",
    title: "API Reference",
    icon: <Cpu className="h-4 w-4" />,
    subsections: [
      { id: "api-create-token", title: "Create Token" },
      { id: "api-mint", title: "Mint Tokens" },
      { id: "api-transfer", title: "Transfer Tokens" },
      { id: "api-famp", title: "FAMP Policy" },
      { id: "api-distribution", title: "Distribution" },
    ],
  },
  {
    id: "database",
    title: "Database",
    icon: <Database className="h-4 w-4" />,
    subsections: [
      { id: "db-schema", title: "Schema" },
      { id: "db-relations", title: "Relations" },
    ],
  },
  {
    id: "components",
    title: "Components",
    icon: <Layout className="h-4 w-4" />,
    subsections: [
      { id: "comp-sidebar", title: "Sidebar" },
      { id: "comp-badge", title: "Status Badge" },
      { id: "comp-address", title: "Address Label" },
    ],
  },
  {
    id: "sdk",
    title: "SDK Integration",
    icon: <Shield className="h-4 w-4" />,
    subsections: [
      { id: "sdk-layers", title: "Three-Layer Architecture" },
      { id: "sdk-pdas", title: "PDA Derivation" },
    ],
  },
  {
    id: "env",
    title: "Environment",
    icon: <Settings2 className="h-4 w-4" />,
    subsections: [
      { id: "env-vars", title: "Variables" },
      { id: "env-setup", title: "Setup" },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: <Wrench className="h-4 w-4" />,
    subsections: [
      { id: "tshoot-common", title: "Common Issues" },
      { id: "tshoot-programs", title: "Program IDs" },
    ],
  },
];

const programIds = [
  { name: "SSTS Core", id: "SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap" },
  { name: "SSTS Transfer Hook", id: "HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL" },
  { name: "FAMP Policy", id: "99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K" },
  { name: "NOOP Verifier", id: "5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd" },
  { name: "Token-2022", id: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb" },
];

const statusVariants: [string, string][] = [
  ["active", "green"], ["paused", "amber"], ["frozen", "red"],
  ["confirmed", "green"], ["failed", "red"], ["pending", "amber"],
  ["completed", "blue"], ["create", "blue"], ["mint", "green"],
  ["transfer", "cyan"], ["policy_create", "violet"], ["allowlist", "green"],
  ["blocklist", "red"], ["devnet", "sky"], ["mainnet", "purple"],
];

const discriminatorMap: [string, string][] = [
  ["createPolicy", "[27, 81, 33, 27, 196, 103, 246, 53]"],
  ["addToAllowlist", "[149, 143, 78, 134, 241, 244, 7, 56]"],
  ["removeFromAllowlist", "[45, 46, 214, 56, 189, 77, 242, 227]"],
  ["addToBlocklist", "[201, 138, 75, 216, 252, 201, 26, 106]"],
  ["removeFromBlocklist", "[132, 125, 30, 120, 139, 22, 210, 90]"],
];

const dbTables = [
  { name: "tokens", cols: 16, desc: "Security token records" },
  { name: "transactions", cols: 10, desc: "On-chain transaction log" },
  { name: "famp_policies", cols: 6, desc: "FAMP compliance policies" },
  { name: "famp_policy_entries", cols: 4, desc: "Policy list entries" },
  { name: "distributions", cols: 10, desc: "Merkle-based distributions" },
  { name: "distribution_claims", cols: 8, desc: "Individual claim records" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
      <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto text-base font-mono text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={`border-slate-800 bg-slate-900/50 ${className}`}>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.subsections.some((sub) => sub.title.toLowerCase().includes(search.toLowerCase()))
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="px-6 lg:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-sky-400" />
            <span className="text-lg font-semibold text-white">TokenForge Docs</span>
          </div>
          <a
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <div className="px-6 lg:px-12 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Documentation</h1>
            <p className="text-base text-slate-400 mt-1">Full reference for the TokenForge issuer dashboard</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search documentation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-700 bg-slate-800"
          />
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-60 shrink-0">
            <nav className="sticky top-20 space-y-1">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-md text-base transition-colors ${
                      activeSection === section.id
                        ? "bg-sky-500/10 text-sky-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                  {section.subsections.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => scrollTo(sub.id)}
                      className={`block w-full text-left pl-10 pr-3 py-1 rounded-md text-sm transition-colors ${
                        activeSection === sub.id
                          ? "text-sky-400"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0 space-y-10">
            <section id="architecture">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-sky-400" /> Architecture
              </h2>

              <div id="arch-overview" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">Overview</h3>
                <p className="text-base text-slate-400 leading-relaxed">
                  The TokenForge dashboard is a Next.js 16 application that sits between issuers and the Solana blockchain.
                  It provides a no-code interface for deploying and managing security tokens using the canonical SSTS programs.
                </p>
                <SectionCard>
                  <div className="font-mono text-sm text-slate-400 leading-relaxed whitespace-pre">
{`┌──────────────────────────────────────────────────┐
│              Next.js 16 Dashboard                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Pages    │ │ API      │ │ DB (PostgreSQL)  │  │
│  │ (14)     │ │ Routes   │ │ Drizzle ORM      │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
│                       │                           │
│  ┌────────────────────┴──────────────────────┐   │
│  │          Solana Devnet                     │   │
│  │  SSTS Core · Transfer Hook · FAMP · NOOP  │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘`}
                  </div>
                </SectionCard>
              </div>

              <div id="arch-design" className="space-y-4">
                <h3 className="text-xl font-medium text-white">Key Design Decisions</h3>
                <div className="grid gap-3">
                  {[
                    { title: "Server-side signing", desc: "All on-chain operations use TEST_WALLET_KEYPAIR env var. No browser wallet required for token operations." },
                    { title: "Manual instruction building", desc: "API routes build raw TransactionInstruction with explicit account flags, bypassing canonicalIxToWeb3 which has known isWritable bugs." },
                    { title: "Non-fatal DB writes", desc: "On-chain success is primary. Database persistence is best-effort, wrapped in try/catch." },
                    { title: "Dual Solana client libraries", desc: "@solana/web3.js v1 for transaction construction, @solana/kit v2 for PDA derivation and canonical types." },
                    { title: "Dark theme only", desc: "Forces className='dark' on <html>. No light mode support." },
                    { title: "Client-side data fetching", desc: "All dashboard pages use useEffect + fetch(). No server components or server actions in the dashboard." },
                  ].map((item) => (
                    <Card key={item.title} className="border-slate-800 bg-slate-900/50">
                      <CardContent className="py-3 px-4">
                        <div className="text-base font-medium text-white">{item.title}</div>
                        <div className="text-sm text-slate-400 mt-0.5">{item.desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section id="routes">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Route className="h-5 w-5 text-sky-400" /> Route Map
              </h2>

              <div id="routes-pages" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">Dashboard Pages</h3>
                <SectionCard>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Route</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["/dashboard", "Overview with KPI cards, recent activity, quick actions"],
                          ["/dashboard/tokens", "Token list with search and filters"],
                          ["/dashboard/tokens/create", "3-step wizard: Details → Metadata → Deploy"],
                          ["/dashboard/tokens/[mint]", "Token detail with transaction history and policy tabs"],
                          ["/dashboard/tokens/[mint]/mint", "Mint tokens form"],
                          ["/dashboard/tokens/[mint]/transfer", "Transfer with FAMP gating toggle"],
                          ["/dashboard/tokens/[mint]/policy", "Full FAMP policy management"],
                          ["/dashboard/policies", "Policy list derived from tokens"],
                          ["/dashboard/policies/[mint]", "Per-token policy management"],
                          ["/dashboard/distributions", "Distribution list"],
                          ["/dashboard/distributions/create", "Create escrow + Claim (tabs)"],
                          ["/dashboard/distributions/[id]", "Distribution detail with claim history"],
                          ["/dashboard/activity", "Full transaction log with search and type filter"],
                          ["/dashboard/settings", "Network configuration and RPC endpoint"],
                        ].map(([route, desc]) => (
                          <tr key={route} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400 whitespace-nowrap">{route}</td>
                            <td className="py-2 text-sm text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>

              <div id="routes-api" className="space-y-4">
                <h3 className="text-xl font-medium text-white">API Routes</h3>
                <SectionCard>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Route</th>
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Method</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["/api/stats", "GET", "Aggregate KPI counts"],
                          ["/api/tokens", "GET/POST", "List tokens / create DB record"],
                          ["/api/tokens/[mint]", "GET/PATCH", "Single token detail / status update"],
                          ["/api/transactions", "GET/POST", "List transactions / record"],
                          ["/api/test-create-token", "POST", "Deploy SSTS token on-chain + persist"],
                          ["/api/mint-tokens", "POST", "Mint tokens via server-side keypair"],
                          ["/api/transfer-tokens", "POST", "Transfer with optional FAMP enforcement"],
                          ["/api/famp-policy", "POST", "FAMP CRUD: 6 actions"],
                          ["/api/distribution", "POST", "Create escrow + Claim distribution"],
                          ["/api/init-vc-transfer", "POST", "Init VerificationConfig for transfer"],
                          ["/api/r3-upload", "POST", "Upload metadata JSON to Cloudflare R2"],
                        ].map(([route, method, desc]) => (
                          <tr key={route} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400 whitespace-nowrap">{route}</td>
                            <td className="py-2 pr-4">
                              <Badge className={`text-xs px-1.5 py-0 ${
                                method === "GET" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                              } border-0`}>{method}</Badge>
                            </td>
                            <td className="py-2 text-sm text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>
            </section>

            <section id="api-ref">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-sky-400" /> API Reference
              </h2>

              <div id="api-create-token" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">POST /api/test-create-token</h3>
                <p className="text-base text-slate-400">Creates a canonical SSTS security token on Solana devnet.</p>
                <SectionCard>
                  <div className="text-sm text-slate-400 font-medium mb-2">Request</div>
                  <CodeBlock code={`{ "name": "My Token", "symbol": "MST", "decimals": 6, "uri": "https://..." }`} />
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Flow</div>
                  <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                    <li>Derive MintAuthority, FreezeAuthority, VerificationConfig PDAs</li>
                    <li>Build InitializeMint instruction with Token-2022 extensions</li>
                    <li>Build InitializeVerificationConfig instruction (disc 12, CPI mode)</li>
                    <li>Simulate, sign with TEST_WALLET_KEYPAIR + mint keypair, send</li>
                    <li>Persist token + transaction records to PostgreSQL</li>
                  </ol>
                </SectionCard>
              </div>

              <div id="api-mint" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">POST /api/mint-tokens</h3>
                <p className="text-base text-slate-400">Mints tokens to a destination ATA (auto-creates if missing).</p>
                <SectionCard>
                  <div className="text-sm text-slate-400 font-medium mb-2">Request</div>
                  <CodeBlock code={`{ "mintAddress": "...", "destination": "...", "amount": "1000" }`} />
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Key Behavior</div>
                  <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                    <li>Derives MintAuthority PDA + VerificationConfig PDA (discriminator 6)</li>
                    <li>Checks if VerificationConfig exists; creates if missing (CPI mode)</li>
                    <li>Appends NOOP verifier as remaining account for SSTS verify_by_programs</li>
                  </ul>
                </SectionCard>
              </div>

              <div id="api-transfer" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">POST /api/transfer-tokens</h3>
                <p className="text-base text-slate-400">Transfers tokens with optional FAMP policy enforcement.</p>
                <SectionCard>
                  <div className="text-sm text-slate-400 font-medium mb-2">Request</div>
                  <CodeBlock code={`{
  "mintAddress": "...",
  "source": "...",
  "recipient": "...",
  "amount": "100",
  "enforceFamp": true
}`} />
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Verification Selection</div>
                  <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                    <li><span className="text-sky-400">enforceFamp=true</span> → uses FAMP_PROGRAM_ID as verification program</li>
                    <li><span className="text-sky-400">enforceFamp=false</span> → uses NOOP_VERIFICATION_PROGRAM_ID</li>
                  </ul>
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Transfer Instruction Accounts (10)</div>
                  <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                    <li>Mint address</li>
                    <li>VerificationConfig PDA (disc 12)</li>
                    <li>Instructions sysvar</li>
                    <li>PermanentDelegate PDA</li>
                    <li>Mint address (again)</li>
                    <li>Source ATA (writable)</li>
                    <li>Destination ATA (writable)</li>
                    <li>Transfer hook program</li>
                    <li>Token-2022 program</li>
                    <li>Verification program (FAMP or NOOP)</li>
                  </ol>
                </SectionCard>
              </div>

              <div id="api-famp" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">POST /api/famp-policy</h3>
                <p className="text-base text-slate-400">Full FAMP policy CRUD. Supports 6 actions.</p>
                <SectionCard>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Action</th>
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Extra Params</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["create", "allowlistMode (bool)", "Create FAMP policy"],
                          ["addToAllowlist", "wallet (base58)", "Add wallet to allowlist"],
                          ["removeFromAllowlist", "wallet", "Remove from allowlist"],
                          ["addToBlocklist", "wallet", "Add to blocklist"],
                          ["removeFromBlocklist", "wallet", "Remove from blocklist"],
                          ["getPolicy", "none", "Read policy state from chain"],
                        ].map(([action, params, desc]) => (
                          <tr key={action} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400">{action}</td>
                            <td className="py-2 pr-4 text-sm text-slate-400">{params}</td>
                            <td className="py-2 text-sm text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Instruction Discriminators (Anchor 0.31.x)</div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Instruction</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Discriminator</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {discriminatorMap.map(([name, disc]) => (
                          <tr key={name} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400">{name}</td>
                            <td className="py-2 text-sm font-mono text-slate-400">{disc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>

              <div id="api-distribution" className="space-y-4">
                <h3 className="text-xl font-medium text-white">POST /api/distribution</h3>
                <p className="text-base text-slate-400">Create escrow (disc 20) and Claim distribution (disc 21).</p>
                <SectionCard>
                  <div className="text-sm text-slate-400 font-medium mb-2">Create Escrow</div>
                  <CodeBlock code={`{
  "action": "create",
  "mintAddress": "...",
  "merkleRoot": "0x...64hexchars...",
  "escrowTokenAccount": "...",
  "actionId": 0
}`} />
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Claim Distribution</div>
                  <CodeBlock code={`{
  "action": "claim",
  "mintAddress": "...",
  "claimantAddress": "...",
  "amount": "1000",
  "merkleRoot": "0x...",
  "actionId": 0,
  "leafIndex": 0,
  "proofs": ["0x...", "0x..."]
}`} />
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Claim Flow</div>
                  <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                    <li>Derive VerificationConfig (disc 21), ProofAccount PDA, PermanentDelegate PDA</li>
                    <li>Derive claimant ATA + escrow ATA (owned by mint PDA)</li>
                    <li>If proofs: build CreateProofAccount instruction (disc 18)</li>
                    <li>Build ClaimDistribution instruction (disc 21) with Merkle proof option</li>
                  </ol>
                </SectionCard>
              </div>
            </section>

            <section id="database">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-sky-400" /> Database
              </h2>

              <div id="db-schema" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">Schema</h3>
                <p className="text-base text-slate-400">PostgreSQL via Drizzle ORM — 6 tables.</p>
                <div className="grid gap-3">
                  {dbTables.map((t) => (
                    <Card key={t.name} className="border-slate-800 bg-slate-900/50">
                      <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-base font-mono text-sky-400">{t.name}</span>
                          <span className="text-sm text-slate-500 ml-2">({t.cols} columns)</span>
                        </div>
                        <span className="text-sm text-slate-400">{t.desc}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div id="db-relations" className="space-y-4">
                <h3 className="text-xl font-medium text-white">Relations</h3>
                <SectionCard>
                  <div className="font-mono text-sm text-slate-400 leading-relaxed">
                    tokens ──1:N──&gt; transactions
                    <br />
                    tokens ──1:1──&gt; famp_policies ──1:N──&gt; famp_policy_entries
                    <br />
                    tokens ──1:N──&gt; distributions ──1:N──&gt; distribution_claims
                  </div>
                  <div className="text-sm text-slate-500 mt-3">
                    Migration commands: npm run db:generate | db:migrate | db:studio
                  </div>
                </SectionCard>
              </div>
            </section>

            <section id="components">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Layout className="h-5 w-5 text-sky-400" /> Components
              </h2>

              <div id="comp-sidebar" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">AppSidebar</h3>
                <SectionCard>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Item</th>
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Icon</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Sub-items</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["Overview", "LayoutDashboard", "—"],
                          ["Tokens", "Coins", "All Tokens, Create Token"],
                          ["Policies", "ShieldCheck", "—"],
                          ["Distributions", "Send", "—"],
                          ["Activity", "Activity", "—"],
                          ["Settings", "Settings", "—"],
                        ].map(([item, icon, sub]) => (
                          <tr key={item} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 text-sm text-white">{item}</td>
                            <td className="py-2 pr-4 text-sm font-mono text-slate-400">{icon}</td>
                            <td className="py-2 text-sm text-slate-400">{sub}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>

              <div id="comp-badge" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">StatusBadge</h3>
                <p className="text-base text-slate-400">Color-coded badge using CVA with 15 variants.</p>
                <SectionCard>
                  <div className="flex flex-wrap gap-2">
                    {statusVariants.map(([status, color]) => (
                      <Badge key={status} className={`bg-${color}-500/10 text-${color}-400 border-${color}-500/20 capitalize text-sm`}>
                        {status}
                      </Badge>
                    ))}
                  </div>
                </SectionCard>
              </div>

              <div id="comp-address" className="space-y-4">
                <h3 className="text-xl font-medium text-white">AddressLabel</h3>
                <p className="text-base text-slate-400">Truncated Solana address with copy-to-clipboard and tooltip.</p>
                <SectionCard>
                  <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                    <li><span className="text-sky-400">shortenAddress(address, chars)</span> — shows first/last N chars</li>
                    <li>Copy button with checkmark feedback (2s timeout)</li>
                    <li>Tooltip showing full address on hover</li>
                  </ul>
                </SectionCard>
              </div>
            </section>

            <section id="sdk">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-400" /> SDK Integration
              </h2>

              <div id="sdk-layers" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">Three-Layer Architecture</h3>
                <SectionCard>
                  <div className="space-y-4">
                    {[
                      { layer: "L0 — Canonical Client", path: "lib/sdk/l0/", desc: "Re-exports from canonical SSTS git submodule. Instruction builders, program IDs, types." },
                      { layer: "L1 — Adapters", path: "lib/sdk/l1/", desc: "PDA derivation (derive.ts), error enrichment (errors.ts), transaction building (transactions.ts)." },
                      { layer: "L2 — Workflows", path: "lib/sdk/l2/", desc: "Token lifecycle, distribution, and FAMP policy workflows (13 functions)." },
                    ].map((item) => (
                      <div key={item.layer} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <div>
                          <div className="text-base font-medium text-white">{item.layer}</div>
                          <div className="text-sm text-slate-500 font-mono">{item.path}</div>
                          <div className="text-sm text-slate-400 mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <div className="text-sm text-amber-400 font-medium">Important</div>
                    <div className="text-sm text-amber-400/80 mt-1">
                      API routes bypass L2 workflows and build instructions manually using raw TransactionInstruction.
                      This is because canonicalIxToWeb3 does not correctly set isWritable for TransactionSigner accounts
                      (assigns role: 3 instead of role: 5).
                    </div>
                  </div>
                </SectionCard>
              </div>

              <div id="sdk-pdas" className="space-y-4">
                <h3 className="text-xl font-medium text-white">PDA Derivation Functions</h3>
                <SectionCard>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Function</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["deriveMintAuthorityPda", "MintAuthority PDA for the token"],
                          ["deriveFreezeAuthorityPda", "FreezeAuthority PDA"],
                          ["deriveVerificationConfigPda", "VerificationConfig PDA per discriminator"],
                          ["deriveFampPolicyPda", "FAMP PolicyAccount PDA"],
                          ["deriveProofAccountPda", "ProofAccount PDA for distributions"],
                          ["deriveRateAccountPda", "RateAccount PDA for splits/conversions"],
                          ["derivePermanentDelegatePda", "PermanentDelegate PDA"],
                          ["deriveTransferHookPda", "TransferHook PDA"],
                          ["deriveExtraAccountMetasPda", "ExtraAccountMetas PDA"],
                        ].map(([fn, desc]) => (
                          <tr key={fn} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400 whitespace-nowrap">{fn}</td>
                            <td className="py-2 text-sm text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>
            </section>

            <section id="env">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-sky-400" /> Environment
              </h2>

              <div id="env-vars" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">Variables</h3>
                <SectionCard>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Variable</th>
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Required</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["DATABASE_URL", "Yes", "PostgreSQL connection string"],
                          ["TEST_WALLET_KEYPAIR", "Yes", "Server-side signing keypair (base64 or JSON array)"],
                          ["R2_ACCOUNT_ID", "No", "Cloudflare account ID (for metadata upload)"],
                          ["R2_ACCESS_KEY_ID", "No", "R2 API access key"],
                          ["R2_SECRET_ACCESS_KEY", "No", "R2 API secret key"],
                          ["R2_BUCKET_NAME", "No", "R2 bucket name"],
                          ["R2_PUBLIC_URL", "No", "Public URL for bucket"],
                        ].map(([varName, required, desc]) => (
                          <tr key={varName} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400 whitespace-nowrap">{varName}</td>
                            <td className="py-2 pr-4">
                              <Badge className={`text-xs px-1.5 py-0 ${
                                required === "Yes" ? "bg-red-500/10 text-red-400" : "bg-slate-500/10 text-slate-400"
                              } border-0`}>{required}</Badge>
                            </td>
                            <td className="py-2 text-sm text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>

              <div id="env-setup" className="space-y-4">
                <h3 className="text-xl font-medium text-white">Setup</h3>
                <SectionCard>
                  <div className="text-sm text-slate-400 font-medium mb-2">Installation</div>
                  <CodeBlock code={`cd dashboard
npm install
cp .env.example .env.local
# Edit .env.local with DATABASE_URL and TEST_WALLET_KEYPAIR
npm run db:migrate
npm run dev`} />
                  <div className="text-sm text-slate-400 font-medium mt-4 mb-2">Available Scripts</div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 font-medium pb-2 pr-4 text-sm">Script</th>
                          <th className="text-left text-slate-400 font-medium pb-2 text-sm">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          ["dev", "Development server (turbopack)"],
                          ["build", "Production build"],
                          ["start", "Production server"],
                          ["lint", "ESLint check"],
                          ["db:generate", "Generate Drizzle migration"],
                          ["db:migrate", "Apply migrations"],
                          ["db:studio", "Drizzle ORM GUI"],
                        ].map(([script, desc]) => (
                          <tr key={script} className="border-b border-slate-800/50">
                            <td className="py-2 pr-4 font-mono text-sm text-sky-400">{script}</td>
                            <td className="py-2 text-sm text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>
            </section>

            <section id="troubleshooting">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-sky-400" /> Troubleshooting
              </h2>

              <div id="tshoot-common" className="space-y-4 mb-8">
                <h3 className="text-xl font-medium text-white">Common Issues</h3>
                <div className="grid gap-3">
                  {[
                    { symptom: "Simulation fails: 'account not writable'", cause: "isWritable flag incorrect on an account that needs writing", fix: "Check account roles in the instruction keys array" },
                    { symptom: "'VerificationProgramNotFound'", cause: "NOOP verifier not deployed or not in remaining accounts", fix: "Deploy verification_policy_noop; append verifier program ID as remaining account" },
                    { symptom: "'AccountAlreadyInitialized'", cause: "VerificationConfig already exists", fix: "Check before creating (idempotent pattern)" },
                    { symptom: "Token create fails: 'immutable'", cause: "Mint account not set as writable + signer", fix: "Ensure mint keypair has isSigner: true, isWritable: true" },
                    { symptom: "DB operations silently fail", cause: "DATABASE_URL not set or connection issue", fix: "Check .env.local; DB writes are non-fatal" },
                    { symptom: "Wallet adapter: 'No wallets found'", cause: "No wallet adapters configured in provider", fix: "Install Phantom/Backpack browser extension" },
                  ].map((item) => (
                    <Card key={item.symptom} className="border-slate-800 bg-slate-900/50">
                      <CardContent className="py-3 px-4">
                        <div className="text-base font-medium text-white mb-1">{item.symptom}</div>
                        <div className="space-y-0.5 text-sm">
                          <div><span className="text-slate-500">Cause:</span> <span className="text-slate-400">{item.cause}</span></div>
                          <div><span className="text-slate-500">Fix:</span> <span className="text-green-400">{item.fix}</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div id="tshoot-programs" className="space-y-4">
                <h3 className="text-xl font-medium text-white">Devnet Program IDs</h3>
                <SectionCard>
                  <div className="space-y-2">
                    {programIds.map((p) => (
                      <div key={p.name} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
                        <span className="text-base text-white">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-400">{p.id.slice(0, 8)}...{p.id.slice(-4)}</span>
                          <CopyButton text={p.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}