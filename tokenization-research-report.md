# Tokenization Landscape Research Report

> Compiled: May 16, 2026
> Scope: Global tokenization landscape, security products, regulation (Reg D/Reg S), prerequisites, steps, requirements, secondary markets, overlooked details, and Indonesia-specific regulatory framework (OJK/Bappebti).

---

## Table of Contents

1. [The Tokenization Landscape](#1-the-tokenization-landscape)
2. [Current Available Solutions — Platform Landscape](#2-current-available-solutions--platform-landscape)
3. [Token Standards](#3-token-standards)
4. [Regulation & Policy — Global](#4-regulation--policy--global)
5. [Prerequisites for Private Equity Tokenization](#5-prerequisites-for-private-equity-tokenization)
6. [Step-by-Step: How to Tokenize](#6-step-by-step-how-to-tokenize)
7. [How Much Should You Tokenize](#7-how-much-should-you-tokenize)
8. [How Tokenization Works in Detail](#8-how-tokenization-works-in-detail)
9. [How Investors Buy Tokenized Assets](#9-how-investors-buy-tokenized-assets)
10. [Secondary Market Mechanics](#10-secondary-market-mechanics)
11. [The Nitty-Gritty — Overlooked Details](#11-the-nitty-gritty--overlooked-details)
12. [Question 1: Licenses Explained](#question-1-what-are-licenses-broker-dealer-transfer-agent-sec-registered-mas-licensed-ats-partner-ats)
13. [Question 2: Indonesia Regulatory Landscape](#question-2-indonesia-regulatory-landscape-and-market)
14. [Question 3: Parallel Offerings](#question-3-what-are-parallel-offerings)
15. [Question 4: Subscription Agreements](#question-4-what-is-a-subscription-agreement-and-what-does-subscribe-mean)
16. [Question 5: KYC/AML Responsibility](#question-5-who-does-kycaml--the-tokenizing-party-or-the-investor)
17. [Question 6: Net Asset Value (NAV)](#question-6-net-asset-value-nav--why-the-formula-and-why-not-just-post-manually)
18. [Source Links](#source-links)

---

## 1. The Tokenization Landscape

Tokenized real-world assets (RWAs) hit **~$30 billion in April 2026**, more than tripling from ~$8.8 billion a year earlier. Growth is heavily concentrated — **tokenized treasuries and money market funds dominate**. Tokenized real estate grew from ~$35M to ~$296M, and private equity from ~$60M to ~$223M.

The STO platform market itself was valued at **$1.21B in 2025**, projected to reach **$5.67B by 2034** (18.6% CAGR).

Tokenization does not change the underlying asset's risk or value — it improves efficiencies in issuance, trading, and settlement. The legal framework is the same as traditional securities. What changes is the infrastructure layer: on-chain cap tables, programmable compliance, atomic settlement, and 24/7 accessibility.

---

## 2. Current Available Solutions — Platform Landscape

### Tier 1 — SEC-Registered Full-Stack Platforms (US)

| Platform | Licenses | Min Issuance | Secondary Market | Blockchains |
|---|---|---|---|---|
| **Securitize** | Broker-Dealer, Transfer Agent, ATS | $5M+ | Securitize Markets (ATS) | Ethereum, Polygon, Avalanche |
| **Tokensoft** | SEC-registered (6 divisions engaged) | N/A | Partner ATS | Ethereum + all EVM |
| **tZERO** | Broker-Dealer, ATS | $10M+ | tZERO ATS | Ethereum, Tezos |
| **INX** | SEC-registered | N/A | INX One | Ethereum |
| **KoreConX** | SEC-registered Transfer Agent | $1M+ | Partner ATS | Private/Public |

**Securitize** is the clear leader for US-regulated issuances. Powers BlackRock's BUIDL fund. Over $2B processed.
**Tokensoft** is the only platform with compliance reviewed and accepted by the SEC for fully registered offerings. Co-authored ERC-1404. 80,000+ investor onboardings/hour.
**Ondo Finance** opened Global Markets in September 2025 — tokenized US stocks/ETFs for non-US investors. Over $650M TVL, $12B+ cumulative volume, ~60% market share. SEC closed investigation without charges.

### Tier 2 — EU/International Platforms

| Platform | HQ | Regulatory Status | Key Feature |
|---|---|---|---|
| **Tokeny** | Luxembourg | Tech provider, ERC-3643/T-REX | $32B+ tokenized, backed by Euronext |
| **ONINO** | Germany | White-label, DLT Pilot Regime | 24+ EU/Swiss countries, $35M+ |
| **Stokr** | Luxembourg | Regulated | $1B+ tokenized |
| **DigiShares** | Denmark | Regulated | $1B+ tokenized |
| **Securitize Europe** | Spain | CNMV DLT Trading & Settlement | Only EU DLT Pilot Regime authorization |
| **Bitbond** | Berlin | BaFin-regulated | EU-focused |
| **21X AG** | Germany | DLT MTF authorized | Regulated secondary venue |
| **360X AG** | Germany | DLT MTF authorized | Regulated secondary venue |

### Tier 3 — Decentralized/DeFi-Native

| Platform | Focus | Key Feature |
|---|---|---|
| **Centrifuge** | Decentralized credit | $600M+ financed, trade finance, real estate debt |
| **Maple Finance** | Institutional private credit | Managed lending |
| **Polymath/Polymesh** | Purpose-built blockchain | Identity-first, built for security tokens |
| **Republic** | Retail/crowdfunding | $50k+ minimum, Reg CF |

### Tier 4 — Specialized/Niche

| Platform | Focus |
|---|---|
| **OWNR** | Mortgage-backed securities, T3 Protocol for atomic settlement |
| **ADDX** | Singapore, MAS-licensed, Hamilton Lane tokenized PE fund |
| **InvestaX** | Singapore/APAC, MAS-regulated |
| **Backed Finance** | Swiss DLT-regulated tokenized stocks |
| **Aktionariat** | Swiss DLT law, tokenized private equity with order book |

---

## 3. Token Standards

| Standard | Used By | Status |
|---|---|---|
| **ERC-3643 (T-REX)** | Tokeny, most EU platforms, Securitize Europe | **Recommended.** Open standard, on-chain compliance via ONCHAINID identity contracts. Every transfer verifies investor eligibility automatically. |
| **ERC-1400** | Polymath, some US platforms | Established but less composable with DeFi. Bundles ERC-1410, ERC-1594, ERC-1643, ERC-1644. |
| **ERC-1404** | Tokensoft | Only token standard used in fully SEC-registered securities offering. |
| **ERC-7518** | Zoniqx | Newer, emerging, fewer integrations. |
| **Proprietary** | Legacy platforms | **Avoid.** Creates lock-in, no portability. |
| **Token-2022 (Solana)** | Solana-based issuances | Native extension architecture supports transfer restrictions, confidential transfers. |
| **STV3 (Stobox)** | Stobox 4 | DID-based compliance, transfer restrictions, cap table enforcement. |

---

## 4. Regulation & Policy — Global

### United States

The SEC's January 28, 2026 joint statement clarified: **tokenized securities remain subject to the full scope of US federal securities laws.** Tokenization is a change in technological process, not in the underlying legal analysis. SEC collected **$4.98 billion in penalties during 2024**, 58% for unregistered securities offerings.

**Key Exemptions:**

| Rule | Investors | General Solicitation | Verification |
|---|---|---|---|
| **Reg D 506(b)** | Unlimited accredited + up to 35 sophisticated non-accredited | No | Self-certification |
| **Reg D 506(c)** | Accredited investors only | Yes | Reasonable steps required (tax returns, bank statements, CPA letters) |
| **Reg S** | Non-US persons only | Offshore only | Verify non-US person status |
| **Reg A+** | Retail + accredited | Yes | SEC qualification (Form A), $75M cap |

**Accredited Investor Thresholds (2025 update):**
- Individual: $1M net worth (excl. primary residence) OR $200K annual income ($300K joint)
- Entities: $5M in assets
- SEC guidance: anyone investing $200K+ can be **presumed** accredited in most instances

### European Union

- **MiCA** (fully effective Dec 2024): Excludes financial instruments under MiFID II. Most tokenized securities fall under MiFID II, not MiCA.
- **DLT Pilot Regime** (effective March 2023): Only **four operators authorized** as of early 2026: CSD Prague, 21X AG, 360X AG, Securitize Europe. **Primary issuance is mature; regulated secondary liquidity is the bottleneck.**
- **eWpG** (Germany, Jan 2024): Digital securities law.

### Other Jurisdictions

| Jurisdiction | Regulator | Framework |
|---|---|---|
| **Switzerland** | FINMA | DLT Act (2021) — flexible |
| **Singapore** | MAS | Recognized Market Operator licensing |
| **UAE/Dubai** | VARA | Professional investor focus |
| **UK** | FCA | Prospectus requirements, KYC/AML |
| **Hong Kong** | SFC | Licensing requirements |
| **Japan** | FSA | Payment Services Act, strict KYC/AML |
| **Saudi Arabia** | SAMA | Security token framework, Vision 2030 |

---

## 5. Prerequisites for Private Equity Tokenization

### Legal & Structural
1. **Legal Entity Formation**: Delaware LP/LLC (US), Cayman/BVI (offshore), Luxembourg RAIF (EU)
2. **SPV Formation**: Holds the actual PE asset; tokens represent fractional ownership
3. **Amend Operating Agreement**: Must explicitly recognize on-chain token records as authoritative cap table
4. **Howey Test Analysis**: Determine if token is a security (virtually all PE tokenizations are)
5. **Securities Counsel**: Engage before any technology decisions. Cost: $15K-$80K+
6. **Offering Documents**: PPM, subscription agreements, token terms
7. **KYC/AML Infrastructure**: Identity verification, source of funds, sanctions screening, PEP screening
8. **Custody**: Institutional-grade custody non-negotiable for US-regulated funds

### Technical
9. **Token Standard Selection**: ERC-3643 (EU), ERC-1404 (US), or Token-2022 (Solana)
10. **Smart Contract Audit**: Mandatory before going live
11. **Platform Selection**: Minimum deal sizes vary: $5M-$10M+ for institutional, $500K+ for smaller
12. **Blockchain Selection**: Ethereum (institutional), Polygon/Avalanche (cost), Solana (speed)
13. **ISO 27001 and SOC 2 certifications** for infrastructure providers — baseline requirements

### Cost Estimates

| Component | Cost Range |
|---|---|
| Legal structuring & counsel | $15K - $80K+ |
| SPV/entity formation | $5K - $30K |
| Smart contract development & audit | $10K - $50K |
| Platform setup/engagement | $50K - $150K (minimums) |
| KYC/AML integration | $5K - $20K |
| Ongoing compliance/admin | 0.5% - 2% of AUM annually |

**Total: $85K - $330K+**, with 3-6 months timeline.

---

## 6. Step-by-Step: How to Tokenize

### Phase 1: Legal & Regulatory Structuring (Weeks 1-8)
1. Engage securities counsel — before any technology decisions
2. Determine jurisdiction and exemption path (Reg D, Reg S, Reg A+, or combination)
3. Form legal entity/SPV
4. Amend fund documents — recognize on-chain records, define token rights
5. Draft offering documents — PPM, subscription agreements, token terms
6. Bad actor checks — questionnaires for all covered persons
7. Determine selling geography and investor types

### Phase 2: Technology Setup (Weeks 4-12)
8. Select tokenization platform
9. Select token standard
10. Deploy smart contracts — encode transfer restrictions, whitelists, jurisdiction flags, lockups
11. Independent smart contract audit — mandatory
12. Integrate KYC/AML provider
13. Set up custody — qualified custodian, MPC wallets
14. Integrate NAV/oracle infrastructure

### Phase 3: Issuance & Onboarding (Weeks 8-16)
15. Configure primary issuance — minimum investment amounts, pricing, NAV
16. Investor onboarding — KYC/AML, accreditation, jurisdiction, wallet whitelisting
17. Mint and distribute tokens
18. File Form D — within 15 days of first sale (Reg D)
19. State Blue Sky filings — notice filing in each investor state

### Phase 4: Post-Issuance (Ongoing)
20. Ongoing compliance — AML monitoring, sanctions updates, claim renewals
21. NAV reporting — regular valuation updates, posted on-chain
22. Distribution automation — dividends, coupons, revenue share via smart contracts
23. Cap table management — blockchain is the source of truth
24. Corporate actions — voting, consent solicitations, forced transfers
25. Regulatory reporting — periodic filings, investor reporting, tax reporting

---

## 7. How Much Should You Tokenize

| Asset Type | Minimum Viable Threshold | Notes |
|---|---|---|
| **Single-asset real estate** | $10M+ property value | Below $10M, structuring costs consume 8%-12% of raise |
| **Pooled fund** | $50M - $100M AUM | Below this, single-asset SPVs more efficient |
| **PE fund tokenization** | $5M+ (via Securitize) | Hamilton Lane: minimum from $125K to $10K |
| **Small deals** | $500K - $5M | Polymath or direct Reg D without platform |

Economics are front-loaded. Below threshold, per-deal costs dominate. Above threshold, costs amortize across portfolio.

---

## 8. How Tokenization Works in Detail

### The Token Structure

A security token is **not** the underlying asset. It is a **digital representation** of a legal claim:

- **Issuer-sponsored model**: Issuer creates tokens sharing substantially the same rights as the underlying security. Blockchain serves as official ownership record.
- **Custodial tokenized securities** (third-party): Third party holds underlying in custody, issues tokens as entitlements.
- **Synthetic tokenized securities**: Tokens mimic economic exposure without underlying rights. May be classified as **security-based swaps** (additional regulatory layer).

### Compliance Enforcement

**Programmable compliance** is the critical innovation:

1. **On-chain identity (ONCHAINID/DID)**: Each investor gets blockchain-based identity contract with signed claims (accredited status, jurisdiction, KYC clearance)
2. **Transfer restrictions at smart contract level**: Before any transfer executes, contract checks:
   - Is recipient wallet whitelisted?
   - Valid KYC/AML claims?
   - Permitted jurisdiction?
   - Holding period elapsed (Reg D: 12 months, Reg S: 40 days-1 year)?
   - Concentration limits or affiliate transfer rules?
3. **If any check fails, transfer reverts on-chain.**

### NAV & Pricing

- NAV = (total portfolio asset value - liabilities) / outstanding tokens
- Traditionally calculated monthly/quarterly by fund administrators
- On-chain NAV (via Chainlink or similar) enables continuous calculation, preventing stale pricing arbitrage

---

## 9. How Investors Buy Tokenized Assets

### Primary Market (Initial Purchase)

1. **Register on platform** — account with email, country, investor type
2. **Complete KYC/AML** — government ID, proof of address, selfie, source of funds (3-7 business days)
3. **Accreditation verification** (if Reg D) — tax returns, bank statements, or third-party letter
4. **Jurisdiction verification** — confirm eligibility based on offering geography
5. **Receive ONCHAINID/DID** — smart contract deployed with verified claims
6. **Wallet setup** — self-custody (MetaMask), integrated/MPC wallet, or custodial
7. **Fund account** — bank wire, fiat-to-stablecoin on-ramp, crypto deposit, ACH
8. **Sign subscription documents** — electronic signature
9. **Tokens allocated** — smart contract mints/transfers, applies lockups/vesting

### Secondary Market (Trading After Issuance)

| Venue Type | Description | Liquidity |
|---|---|---|
| **Regulated ATS/MTF** | Licensed marketplaces (Securitize Markets, tZERO, 21X, 360X) | Continuous or periodic, institutional-grade |
| **Custodial Marketplaces** | Trading built into custodian infrastructure | High settlement efficiency, limited client base |
| **RFQ/OTC Pools** | Request-for-Quote, negotiated through brokers | Episodic, flexible pricing |
| **Issuer Bulletin Boards** | Investor-to-investor communication, no matching engine | Limited liquidity |
| **DeFi/AMMs** | Permissionless pools (Uniswap, Aave Horizon) | Continuous but limited to compliant tokens |

**Trading process:**
1. Seller lists tokens on licensed venue
2. Venue matches with eligible buyer
3. Smart contract verifies buyer eligibility before execution
4. If all checks pass, trade settles **on-chain** — T+0 atomic delivery-versus-payment
5. Cap table updates automatically

---

## 10. Secondary Market Mechanics

### EU Framework

- **MiFID II**: Defines three venue types — regulated markets (RMs), multilateral trading facilities (MTFs), organized trading facilities (OTFs). MTFs most relevant for tokenized securities.
- **DLT Pilot Regime** (Regulation EU 2022/858): Sandbox for DLT-based trading. Three entity types: DLT MTFs, DLT SSs, DLT TSSs.
- **ERC-3643 (T-REX)**: Enforces identity-based compliance at protocol level. Compliance follows the token, not the platform.

### US Framework

- **ATS operated by FINRA-registered broker-dealers**
- **Compliance-gated order books**: Only verified, eligible participants accepted
- **Atomic DvP settlement**: Simultaneous exchange of tokens and payment — no settlement window, no counterparty risk, no CCP needed

### Key Differences from Traditional Markets

| Aspect | Traditional | Tokenized |
|---|---|---|
| Settlement | T+1 or T+2 | T+0 (atomic) |
| Trading hours | Market hours | 24/7 |
| Compliance | Broker-level | Token-level (smart contract) |
| Records | Database | Blockchain-verifiable |
| Counterparty risk | Clearinghouse | None (atomic DvP) |

---

## 11. The Nitty-Gritty — Overlooked Details

### GP Consent Rights
Most PE fund operating agreements require GP consent for LP interest transfers. Must be encoded as smart contract approval step. If tokenizing existing fund, operating agreement may need amendment.

### "Shadow Investors" / Orphaned Token Holders
Tokenization must avoid creating token holders without enforceable contractual rights. Secondary buyers must be properly admitted as LPs in the feeder/SPV.

### Lockup and Vesting Enforcement
- Reg D 12-month holding period (Rule 144)
- Reg S distribution compliance period (40 days-1 year)
- Fund-specific lockups (e.g., 2-year hard lockup)
- Gates and redemption limits (e.g., max 10% NAV per quarter)

### Force Transfer for Legal Compliance
Where law requires (court orders, lost keys, regulatory action), admin/transfer-agent can force-transfer tokens with on-chain trail.

### FATCA/CRS Reporting
Cross-border token holders trigger tax reporting obligations. ONCHAINID/DID solves this by linking identity to wallet.

### Tax Implications
- Every token distribution is taxable event (FMV at time of receipt)
- Token vesting taxable at vest, not release
- Cross-border contributors may owe taxes in multiple jurisdictions
- Withholding may be required before token delivery
- Capital gains on secondary sales apply

### Oracle Risk for Illiquid Assets
Chainlink Proof of Reserve "only ensures that data from centralized entities is not tampered with before it makes it on-chain" — does **not validate credibility of underlying attestation**. Hardest technical problem in RWA tokenization.

### Cold Start Liquidity Problem
Tokenized PE fund with $50M NAV is meaningless if daily trading volume is $12,000. Academic research confirms most RWA tokens exhibit low volumes, long holding periods, limited participation.

### Custody 24/7 Mismatch
Crypto markets operate 24/7. Qualified custodians generally do not. Programmatic alerts useless if assets can't be transferred until custodian opens.

### Blue Sky State Filings
Federal exemptions don't eliminate state-level compliance. Must file Form D in **each state where investors are located** within 15 days of first sale.

### SEC January 2026 Taxonomy
1. **Issuer-sponsored**: Token and underlying security share substantially same rights
2. **Custodial tokenized securities** (third-party): Third party holds underlying, issues token as entitlement
3. **Synthetic tokenized securities**: Mimics economic exposure without underlying rights (may be security-based swaps)

### DTC Pilot Program
DTC received no-action letter (Dec 2025) for securities tokenization pilot launching H2 2026. Nasdaq filed to enable tokenized securities trading under this program.

---

## Question 1: What Are Licenses? Broker-Dealer, Transfer Agent, SEC-Registered, MAS-Licensed, ATS, Partner ATS

### Broker-Dealer (BD)
A person or firm licensed by the SEC (US) and FINRA to buy/sell securities on behalf of others (broker) or for own account (dealer).

**What it lets you do:**
- Facilitate secondary market trading of security tokens
- Act as intermediary between buyers and sellers
- Handle investor onboarding, order routing, settlement
- Legally receive compensation for executing securities transactions

**Why it matters:** Facilitating any security token trading without a BD license = operating unregistered broker-dealer — one of the most common SEC enforcement actions.

### Transfer Agent (TA)
Registered with the SEC to maintain the official record of ownership for a security. Tracks who owns what, processes transfers, handles corporate actions, maintains cap table.

**What it lets you do:**
- Be the legally authoritative source for "who owns this token"
- Process token minting, burning, transfers as official record
- Issue replacement tokens for lost keys (recovery mechanism)
- Handle corporate actions on-chain

**Why it matters:** There **must** be a legally accountable party maintaining the official ownership record. Smart contract handles mechanics, but Transfer Agent responds to disputes, court orders, and regulatory inquiries.

### SEC-Registered
Entity or offering registered with the US Securities and Exchange Commission. Multiple forms:
- **SEC-registered offering**: Full registration (Form S-1). Costs $1M+, takes 6-12 months.
- **SEC-registered entity**: BD, TA, ATS, investment adviser that has gone through SEC registration.
- **Exempt offering**: Uses Reg D, Reg S, or Reg A+ to avoid full registration while compliant.

Tokensoft is the only platform whose compliance has been reviewed and accepted by the SEC across six divisions for fully registered offerings.

### MAS-Licensed (Singapore)
Monetary Authority of Singapore license for digital asset trading (as **Recognized Market Operator**). Allows legal facilitation of tokenized securities trading in Singapore.

**Why it matters:** Singapore is one of the most crypto-friendly major jurisdictions. ADDX has been MAS-licensed since Feb 2020, tokenized Hamilton Lane's fund (minimum from $125K to $10K). MAS licensing signals institutional-grade compliance attracting Asian capital.

### ATS (Alternative Trading System)
SEC-registered, FINRA-regulated trading venue that matches buyers and sellers of securities **without** being a full national securities exchange. A "private stock exchange" for unlisted securities.

**What it does:**
- Operates order book for buy/sell orders
- Matches orders and executes trades
- Ensures compliance with transfer restrictions encoded in smart contract
- Handles settlement (T+0 on blockchain vs T+1/T+2 traditional)

**Why it matters:** Primary legal pathway for secondary market trading of security tokens in the US. Without an ATS, no regulated venue for investors to sell tokenized holdings. Securitize Markets is the most active. tZERO also operates prominent ATS.

### Partner ATS
Many tokenization platforms (Tokeny, Polymath, DigiShares) **do not operate their own ATS**. They partner with existing ATS operators (Securitize Markets, tZERO) for secondary market access.

**Why this model:**
- Operating ATS requires FINRA registration, substantial capital, ongoing compliance overhead
- Many platforms specialize in **issuance technology**, leave secondary to licensed partners
- Token standards (ERC-3643, ERC-1404) ensure **portability** — token can trade on any compatible ATS

---

## Question 2: Indonesia Regulatory Landscape and Market

### The Regulatory Shift: Bappebti → OJK

**Before January 10, 2025:** Crypto regulated by **Bappebti** (Ministry of Trade) as a **commodity**.

**After January 10, 2025:** Crypto and all Digital Financial Assets (Aset Keuangan Digital / AKD) regulated by **OJK** (Otoritas Jasa Keuangan) as **financial instruments**. Mandated by:
- **Law No. 4 of 2023** (P2SK Law)
- **Government Regulation No. 49 of 2024** (GR 49/2024)
- **POJK No. 27 of 2024** — effective January 10, 2025
- **POJK No. 23 of 2025** — effective November 10, 2025

Crypto is **no longer a commodity** in Indonesia. It is now a **digital financial asset** subject to financial services regulatory standards.

### Current Regulatory Framework

#### POJK 27/2024 (as amended by POJK 23/2025) — Trading Framework
Covers **secondary market** for Digital Financial Assets (AKD):
- **Market Infrastructure**: Bursa AKD, Kliring (KKI), Kustodian, Pedagang — all **OJK-licensed**
- **Capital Requirements**: Minimum paid-up capital increased from IDR 1B to **IDR 5B** for traders
- **Fit-and-proper test** for senior management
- **Mandatory disclosures** for every product offered to retail
- **AML/KYC** enforced by OJK's financial intelligence unit
- **Staking, lending, DeFi** under OJK supervision if offered to Indonesian users
- **PSE registration** explicitly required
- **Derivatives** of DFA now classified as DFAs themselves

#### Draft OJK Regulation on DFA Offerings (Published September 19, 2025) — Primary Market
Covers **ICOs/ITOs and tokenized asset offerings** for the first time:

| Aspect | Requirement |
|---|---|
| **Classification** | Tokenized assets (backed) vs. crypto assets (currency-backed or asset-backed) |
| **OJK Approval** | Required if offering value ≥ **IDR 1 billion** (~USD $59,850) |
| **OJK Notification** | For offerings below IDR 1 billion |
| **CFX Exchange Approval** | For **unbacked** crypto-assets if value ≥ IDR 1 billion |
| **Entity requirement** | Must be **PT (Perseroan Terbatas)** under Indonesian law |
| **Offering methods** | Single (3-5 business days) or continuous (tokenized/backed only) |
| **Custody** | OJK-approved asset custodian required |
| **Settlement** | OJK-approved clearing institution (KKI) |
| **Consumer protection** | OJK-approved documents required |
| **Exclusions** | Capital market securities, central bank-issued, non-transferable, closed-loop, unique NFTs, free offerings |

**Status:** Draft published for public consultation through October 2, 2025. OJK targets **finalization in 2026**.

#### Regulatory Sandbox (POJK 3/2024)
Active sandbox projects:
- **Gold tokenization** — graduated August 2025
- **Government securities (SBN) tokenization** — fragmented for retail accessibility
- **Property tokenization**

#### Securities Crowdfunding (POJK 17/2025)
Effective July 25, 2025. Securities defined as "conventional, digital, or other forms." Issuers must have net assets ≤ IDR 10B (excl. land/buildings). Funds must be used for projects in Indonesia. Platform operators need IDR 25B paid-up capital, IDR 5B equity.

#### Shariah Compliance
OJK working with DSN-MUI for shariah-compliant crypto classifications. Tokenized assets with real-world underlying assets viewed as having "alignment with Islamic economic justice principles." Shariah token list may be established.

#### Bank Indonesia's Role
- **Crypto cannot be used as payment** — Rupiah is only legal tender
- BI developing **Digital Rupiah** infrastructure for settlement
- Platforms must integrate with rupiah settlement infrastructure

### Indonesia's Tokenization Market Landscape

**Market Size:**
- **Project Wira**: Indonesia's asset tokenization market projected to reach **US$88 billion by 2030** (31.7% growth)
- **21 million+ crypto investors** (late 2024) — far exceeding **6.4 million** IDX stock investors
- Transaction volumes: **IDR 650 trillion** in 2024
- Digital payment market: **US$760 billion**; QRIS: 5,925 million transactions

**Active Players:**

| Platform | Status | Focus |
|---|---|---|
| **GORO** | **Graduated OJK sandbox** (Nov 2025) | Fractional property, from $1. 100K+ users, 350% AUM growth 2024, ~IDR 42B from 7 properties |
| **D3 Labs / BTN / RMI** | Sandbox — REIT tokenization | First property asset tokenization with Bank Tabungan Negara |
| **Binaryx** | Operating | Property tokenization |
| **ProspertiHub** | Operating | Property tokenization |
| **Tokenize Indonesia** | Accelerator (April-August 2025) | Backed by Saison Capital, BRI Ventures, Coinvestasi |
| **Seaseed Network** | Layer-1 blockchain | Permissioned public blockchain for financial institutions |
| **CFX Exchange** | Licensed bourse | Central crypto exchange |
| **KKI** | Licensed clearing | Settlement for DFA trading |
| **ICC** | Licensed custodian | Digital asset custody |

**Three Pathways for Tokenization in Indonesia:**

1. **Local DFA Offering under POJK 27/2024 + Draft Offering Regulation** — Indonesian PT issues tokens to domestic investors. Requires OJK license. Setup: 6-10 weeks.

2. **OJK Sandbox Pilot under POJK 3/2024** — Test under OJK oversight. Pathway to full licensing. Setup: 8-12 weeks.

3. **Offshore Issuer with Geo-Blocking** — Offshore entity issues tokens referencing Indonesian assets. Indonesian residents excluded. Setup: 4-6 weeks.

**Key Legal Challenges Specific to Indonesia:**
- **Agrarian Law Gap**: UUPA No. 5/1960 does not recognize digital tokens as valid in rem rights (hak kebendaan). Tokens represent contractual claims, not direct property title.
- **Tax Efficiency Crisis**: Tax regime designed for high-value singular transactions. Thousands of micro-transactions create massive compliance overhead. Proposed: **Aggregated Tax Consolidation** — platform acts as Withholding Agent (WAPU), triggering full tax payment only during final Transfer of Title (AJB).
- **Foreign Ownership Restrictions**: Indonesian property law restricts foreign ownership.
- **Crypto Payment Prohibition**: Bank Indonesia prohibits crypto for payments. All settlements in Rupiah.

---

## Question 3: What Are Parallel Offerings?

A **parallel offering** means running **two or more simultaneous capital raises** under **different regulatory exemptions**, targeting **different investor populations**, for the **same underlying asset**.

### Reg D + Reg S (Most Common)

| Track | Target | Regulation | Requirements |
|---|---|---|---|
| **US Track** | US accredited investors | Reg D 506(c) | Accreditation verification, Form D within 15 days, Blue Sky filings |
| **Offshore Track** | Non-US persons | Reg S | Verify non-US status, no directed selling in US, distribution compliance period (40 days-1 year) |

**Why do parallel offerings:**
1. Maximize capital — access both US and international investors simultaneously
2. Different terms — different pricing, minimums, rights per track
3. Safe harbor from integration — SEC explicitly stated Reg D and Reg S won't be "integrated" if properly structured

### Integration Risk — The Danger Zone

The SEC may "integrate" separate offerings into a **single offering** if they appear to be one financing plan. If integrated, the combined offering must satisfy at least one exemption — and Reg D + Reg S together may fail both.

**To avoid integration risk:**
- Separate offering documents (different PPMs for US vs. offshore)
- Separate subscription processes
- Separate marketing channels (no global social media targeting US persons)
- Coordinated timing and pricing
- Different transfer restriction legends on tokens

---

## Question 4: What Is a Subscription Agreement and What Does "Subscribe" Mean?

A **subscription agreement** is the **binding legal contract** between an issuer (company/fund) and an investor, where the investor commits to purchase a specific amount of securities at a specific price.

### What "Subscribe" Means

To **subscribe** means to formally apply to purchase newly-issued shares or fund units directly from the issuer.

- **Subscription** = buying new shares from the company (primary market). New capital flows in. Total shares increase.
- **Secondary purchase** = buying existing shares from another investor. No new capital to company. Shares change hands.

When you "subscribe" to a fund, you are saying: *"I commit $X to this fund under these terms, and I represent that I qualify to invest."*

### What a Subscription Agreement Contains

| Section | Purpose |
|---|---|
| **Investment Terms** | Amount committed, price per share/unit, payment schedule, capital call provisions |
| **Representations & Warranties** | Investor certifies accredited status, sophistication, ability to bear risk, purchasing for investment |
| **Accredited Investor Questionnaire** | Detailed certification of which accredited category applies |
| **Risk Acknowledgments** | Securities are restricted, no public market, total loss possible, projections may fail |
| **Transfer Restrictions** | "Restricted" under Rule 144 — cannot resell without registration or exemption. 6-12 month minimum holding. |
| **Regulatory Compliance** | Confirms compliance with Reg D, Blue Sky filings, AML requirements |
| **Closings & Timelines** | When capital is due, minimum/maximum offering sizes, refund provisions |
| **Covenants** | Ongoing obligations for both parties |
| **Indemnification** | Protects company from investor misrepresentations |
| **Acceptance Mechanism** | Subscription is an *offer* by investor. Company must *accept*. Not binding until accepted. |

### PPM vs. Subscription Agreement

- **PPM** = disclosure document. Tells investor what they're buying and what could go wrong.
- **Subscription Agreement** = binding contract. Captures the commitment.

**Flow:** Investor reads PPM → evaluates → signs subscription agreement → wires funds → company accepts → shares/tokens issued → cap table updated.

### In Tokenization Context

The subscription agreement is often **digitized**:
- Investor signs electronically through platform
- Platform verifies accredited status automatically
- Upon acceptance, smart contract mints tokens to whitelisted wallet
- Subscription terms (lockups, vesting, transfer restrictions) **encoded into smart contract**

---

## Question 5: Who Does KYC/AML — The Tokenizing Party or the Investor?

**Both parties participate, but responsibility differs:**

### Tokenizing Party (Issuer / Platform) is Responsible For:

1. **Setting up and operating the KYC/AML system** — Regulatory obligation on the issuer
2. **Choosing the KYC provider** — Onfido, ChainScore, or platform-native
3. **Reviewing and approving** — Compliance team reviews documents, screens against OFAC/EU/UN sanctions, performs PEP screening, adverse media checks
4. **Issuing on-chain identity claims** — Deploys OnchainID/DID smart contract with verified claims
5. **Ongoing monitoring** — Sanctions updates, claim renewals, suspicious activity reporting

### Investor Must:

1. **Submit documents** — Government ID, proof of address, selfie, source of funds, accreditation documentation
2. **Complete self-registration** — Create account, verify email, accept terms
3. **Provide accurate representations** — Certify accredited status, jurisdiction, intent. False representations create legal liability.
4. **Maintain wallet security** — Protect seed phrase/private keys once verified.

### The Critical Point

KYC/AML is a **compliance obligation on the issuer**, enforced by regulators. The investor cannot "do their own KYC" — they must submit to the issuer's process. The investor **must cooperate** by providing documents and accurate information.

**In practice: Platform handles infrastructure and review. Investor provides documents and certifications. Issuer is legally liable if they fail to perform adequate KYC/AML — not the investor.**

---

## Question 6: Net Asset Value (NAV) — Why the Formula, and Why Not Just Post Manually?

### Why NAV = (Total Portfolio Asset Value − Liabilities) ÷ Outstanding Tokens

This formula represents **the per-token fair value** of the underlying fund:

> *"If we liquidated everything the fund owns today, paid off all debts, and split the remaining value equally among all token holders — how much would each token be worth?"*

- **Total Portfolio Asset Value** = Sum of all holdings at fair market price
- **Liabilities** = Accrued management fees, operational expenses, outstanding debt
- **Outstanding Tokens** = Total tokens held by investors

Universal standard used by mutual funds, ETFs, and every regulated fund worldwide. Ensures **fair pricing** for both new subscribers and exiting redeemers.

### Why Not Just Post the NAV On-Chain Manually?

You technically **can** post NAV manually. Many platforms do. But there are problems:

#### What Manual Posting Looks Like:
1. Fund administrator calculates NAV off-chain
2. Administrator logs into platform dashboard
3. Enters NAV value (e.g., "110.50 USD")
4. Platform writes to smart contract
5. Smart contract uses NAV to price subscriptions and redemptions

#### Problems with Pure Manual Posting:

| Problem | Impact |
|---|---|
| **Human error** | Misplaced decimal point immediately misprices all subscriptions/redemptions |
| **No cryptographic proof** | Anyone with admin access can enter any number. No way to verify calculation was correct. |
| **Stale pricing / NAV lag** | NAV calculated once per business day at close. Stale for 20+ hours. Sophisticated traders exploit stale-price arbitrage. |
| **No audit trail** | Manual entries don't create verifiable chain linking NAV to source data. Regulators need this trail. |
| **No tolerance bounds** | No automatic flag if NAV suddenly changes 30% without corresponding trades. |
| **Single point of failure** | If administrator unavailable, no NAV posted. Fund stalls. |

#### What the Industry Actually Does — Hybrid Approach:

1. **Fund administrator calculates NAV off-chain** using regulated fund accounting (always off-chain — requires human judgment, especially for illiquid assets needing appraisals).

2. **Oracle or automated pipeline delivers it on-chain**:
   - **Chainlink SmartData / RedStone**: Fund administrator's verified NAV cryptographically attested and published on-chain. Traceable audit trail.
   - **API integration**: Platform automatically pulls NAV from administrator's system via API.
   - **Multi-attestor model**: Two independent attestors must agree on NAV before accepted on-chain.
   - **Manual upload with controls**: Dual approval (four-eye principle), tolerance bounds, timestamped audit logs.

3. **Freshness is the hard problem**: Oracle doesn't check whether NAV value is **correct** — only that it was **published faithfully on-chain**. If administrator reports NAV based on six-month-old appraisal, oracle delivers that six-month-old number with high precision. **Oracle is necessary but not sufficient.**

#### Bottom Line on NAV:

- **Quality of tokenized asset set by quality of appraiser, administrator, and valuation policy** — not by oracle vs. manual posting.
- **Oracles solve the delivery problem, not the valuation problem.** They ensure number gets on-chain without tampering. They don't ensure the number is right.
- **For liquid assets (treasuries, public stocks):** Daily or hourly NAV updates via oracle are practical.
- **For illiquid assets (real estate, private equity):** NAV inherently stale because appraisals happen quarterly or annually. No technology fixes this.
- **Manual posting is acceptable** for smaller funds or early-stage, but should include: dual approval, tolerance bounds, audit logging, clear freshness timestamps.

---

## Source Links

### Global Tokenization Landscape & Platforms
- RedStone — Tokenization & RWA Standards Report 2026: https://blog.redstone.finance/2026/03/26/tokenization-rwa-report-2026/
- GlobalTokenize — How to Choose a Tokenization Platform (2026): https://globaltokenize.com/how-to-choose-a-tokenization-platform-7-key-criteria-2026/
- Commodara — Tokenization Platforms Compared (2026): https://commodara.com/tokenization-platforms-compared/
- ONINO — Top White-Label Tokenization Platforms in EU (2026): https://onino.io/blog/top-white-label-tokenization-platforms-in-the-eu-(2026-guide)
- Tokensoft — Tokenization Platform: https://tokensoft.com/blog/tokenization-platform.html
- Polymath — Capital Platform: https://polymath.network/capital-platform
- TokenizeStartup — Securitize Review 2026: https://tokenizestartup.com/platforms/securitize-review/
- TokenizeStartup — Best Tokenization Platforms Compared: https://tokenizestartup.com/guide/best-tokenization-platforms/
- OWNR — RWA Tokenization Platforms Compared (2026): https://ownr.finance/resources/rwa-tokenization-platforms-compared
- IntelMarketResearch — STO Platform Market Outlook 2026-2034: https://www.intelmarketresearch.com/security-token-offering-platform-market-44502

### Regulation & Policy
- Astraea Counsel — Token Launch Legal Checklist (2025): https://astraea.law/insights/token-launch-legal-checklist-sec-compliance-2025
- Pedex — Tokenization Regulation, Tax & Compliance Guide (2025): https://pedex.org/blog/tokenization-regulation-compliance-guide
- Raetzer Law — Raising Capital with Reg D and Reg S: https://raetzerlaw.com/raising-capital-how-regulation-d-and-regulation-s-work-together-for-u-s-and-international-investors/
- Terms.Law — Cross-Border Token Offerings: https://terms.law/Trading-Legal/guides/cross-border-token-offerings.html
- Terms.Law — Fundraising Compliance Playbook: https://terms.law/Trading-Legal/guides/fundraising-compliance-playbook.html
- Wojcik Law Firm — Reg S vs Reg D: https://www.wojciklawfirm.com/reg-s-vs-reg-d-offerings-key-differences-and-considerations
- Market Edge (DLA Piper) — SEC Updates Guidance on Exempt Offerings (March 2025): https://marketedge.dlapiper.com/2025/03/exempt-offerings/
- Fensory — RWA Regulation Guide: https://fensory.com/insights/learn/regulatory-landscape-rwa
- JemHS — Token Tactician's Legal Guide to Reg S: https://jemhs.substack.com/p/the-token-tacticians-legal-guide
- ChainUp — What Is a Security Token Offering: https://www.chainup.com/blog/what-is-security-token-offering-sto/

### Private Equity Tokenization Prerequisites & Steps
- Starke Finance — How to Tokenize a Private Equity Fund (2026): https://starke.finance/blog/tokenize-private-equity-fund
- VCII Institute — Tokenizing Private Equity (2025): https://www.vciinstitute.com/blog/tokenizing-private-equity-the-next-leap-in-liquidity-and-global-access
- Debut Infotech — How Private Equity Tokenization Works: https://www.debutinfotech.com/blog/private-equity-tokenization-process
- InvestaX — Private Equity Tokenization Explained: https://blog.investax.io/blog/private-equity-tokenization-explained
- ONINO — How to Tokenize Investment Funds: https://onino.io/blog/how-to-tokenize-investment-funds
- CoinPaprika — Tokenized Private Equity (2026): https://coinpaprika.com/education/tokenized-private-equity-how-blockchain-opens-alternative-assets
- Starke Finance — How to Tokenize a Fund (2026): https://starke.finance/blog/how-to-tokenize-a-fund
- SettleMint — How to Issue an Equity Token: https://console.settlemint.com/documentation/asset-tokenization-kit/user-guides/asset-issuance/issue-equity
- ChainTerms — Tokenizing VC and PE: https://www.chainterms.com/digital-assets/tokenizing-venture-capital-and-private-equity-unlocking-liquidity-illiquid-markets
- SPV.co — SPVs and Tokenization for PE Secondaries: https://spv.co/blog/spvs-and-tokenization-for-private-equity-secondaries

### Secondary Markets & Trading
- ONINO — Secondary Markets in Tokenization Explained: https://onino.io/blog/blog-secondary-markets-tokenization
- Greeks.live — What Are Security Token Exchanges: https://learn.greeks.live/path/what-are-security-token-exchanges-and-how-they-operate/
- GlobalTokenize — From SPV to Secondary Market: https://globaltokenize.com/from-spv-to-secondary-market-lifecycle-of-a-tokenized-asset/
- Liquid Mercury — Tokenized Securities Marketplace (2026): https://www.liquidmercury.com/resources/tokenized-securities-marketplace
- Restifi — How to Trade on Secondary Market: https://docs.resti.fi/getting-started-for-investors/how-to-trade-on-the-secondary-market
- Chaintech Network — Secondary Market Trading in STOs: https://www.chaintech.network/security-token-offerings-stos/exploring-secondary-market-trading-in-stos
- Aktionariat — Secondary Trading in Private Equity: https://www.aktionariat.com/resources/insights/secondary-trading-private-equity
- Plume — Primary Offering & Secondary Trading: https://docs.plume.org/plume/arc/primary-offering-and-secondary-trading
- Securities.io — RWA Liquidity & Market Structure (2026): https://www.securities.io/rwa-liquidity-market-structure-tokenized-assets/
- Allocations — Secondary Market Problem in PE: https://www.allocations.com/blog/the-secondary-market-problem-in-private-equity-how-tokenization-is-fixing-it

### Overlooked Details, Costs, NAV
- Reuters — Asset Tokenization in US: Practical Guide (2026): https://www.reuters.com/practical-law-the-journal/transactional/asset-tokenization-us-practical-guide-2026-05-01
- SEC — Statement on Tokenized Securities (Jan 28, 2026): https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826-statement-tokenized-securities
- Fenwick — Tokenized Securities Under the Microscope (2026): https://www.fenwick.com/insights/publications/tokenized-securities-under-the-microscope-what-companies-should-know-after-the-secs-clarification
- Lexology — SEC Guidance on Custody of Crypto Asset Securities (2025): https://www.lexology.com/library/detail.aspx?g=f6cc2cfe-46cf-44ea-aab2-1b9f9b24d51c
- Cleary Securities Watch — SEC Staff Issues Guidance on Tokenized Security Taxonomies: https://www.clearysecuritieswatch.com/2026/02/sec-staff-issues-guidance-on-tokenized-security-taxonomies/
- Market Edge (DLA Piper) — SEC Issues Guidance on Tokenized Securities (2026): https://marketedge.dlapiper.com/2026/02/sec-issues-guidance-on-tokenized-securities-and-related-developments
- Toku — Token Management for Lawyers (2026): https://www.toku.com/resources/token-management-for-lawyers
- SettleMint — How to Issue a Fund Token: https://console.settlemint.com/documentation/asset-tokenization-kit/user-guides/asset-issuance/issue-fund
- Chainlink — Onchain NAV Calculation: https://chain.link/article/onchain-nav-calculation
- Tokenizer.Estate — Single Asset vs Fund Guide (2026): https://blog.tokenizer.estate/tokenized-real-estate-a-decision-framework-for-single-asset-vs-diversified-fund-tokenization/
- Tokeny — Managing NAV: https://docs.tokeny.com/docs/how-to-manage-the-net-asset-value-nav
- Ondo Finance — Token & Quote Pricing: https://docs.ondo.finance/ondo-global-markets/token-and-quote-pricing
- GlobalTokenize — How to Tokenize Real Estate: https://globaltokenize.com/guides/how-to-tokenize-real-estate/
- Autheo — RWA Tokenization Hit $30 Billion (2026): https://www.autheo.com/blog/rwa-tokenization-30-billion-reality-check
- Tokenizer.Estate — How Tokenized Property Is Valued: https://blog.tokenizer.estate/how-tokenized-property-is-valued-appraisals-nav-and-the-lag-nobody-warns-you-about/

### Indonesia Specific
- Liputan6 — Finalisasi Aturan Tokenisasi Aset Digital OJK (2025): https://www.liputan6.com/crypto/read/6139814/finalisasi-aturan-tokenisasi-aset-digital-ditargetkan-ojk-tahun-ini
- OJK — POJK 23/2025 (Amendment to POJK 27/2024): https://ojk.go.id/id/regulasi/Pages/POJK-23-2025-Perubahan-POJK-27-Tahun-2024-tentang-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-Termasuk-Aset-Kripto.aspx
- JawaPos — OJK Siapkan Regulasi Kripto untuk Tokenisasi Aset Nyata: https://www.jawapos.com/kripto/2508250191/ojk-siapkan-regulasi-kripto-untuk-tokenisasi-aset-nyata-dan-agunan
- WartaEkonomi — Regulasi Aset Digital Diperkuat OJK: https://wartaekonomi.co.id/read580205/regulasi-aset-digital-diperkuat-ojk-garap-aturan-derivatif-hingga-token-baru
- OJK — POJK 27/2024: https://www.ojk.go.id/id/regulasi/Pages/POJK-27-2024-AKD-AK.aspx
- ANTARA — OJK Perkuat Tokenisasi Aset Riil untuk Prinsip Syariah (2026): https://www.antaranews.com/berita/5450771/ojk-perkuat-tokenisasi-aset-riil-agar-bisa-penuhi-prinsip-syariah
- WartaEkonomi — OJK Siapkan Regulasi Tokenisasi Aset Domestik 2026: https://wartaekonomi.co.id/read595669/ojk-siapkan-regulasi-tokenisasi-aset-domestik-mulai-2026
- OJK — POJK 17/2025 (Securities Crowdfunding): https://www.ojk.go.id/id/regulasi/Documents/Pages/POJK-17-Tahun-2025-Penawaran-Efek-Melalui-Layanan-Urun-Dana-Berbasis-Teknologi-Informasi/Abstrak%20POJK%2017%20Tahun%202025%20Penawaran%20Efek%20Melalui%20Layanan%20Urun%20Dana%20Berbasis%20Teknologi%20Informasi.pdf
- OJK — Siaran Pers POJK 23/2025: https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/POJK-23-Tahun-2025-Perubahan-POJK-27-Tahun-2024-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-Termasuk-Aset-Kripto.aspx
- Mondaq — Indonesia Issues Draft OJK Regulation on DFA Offerings: https://www.mondaq.com/financial-services/1708816/indonesia-issues-draft-ojk-regulation-on-digital-financial-asset-offerings
- AHP — Indonesia's Push to Regulate DFA Offerings: https://www.ahp.id/indonesias-push-to-regulate-digital-financial-asset-offerings-a-framework-for-crypto-and-token-issuers/
- OJK — Bappebti Transfers Duties to OJK and BI (Jan 10, 2025): https://www.ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/Bappebti-Transfers-Regulation-and-Supervision-Duties-on-Digital-Financial-Assets-Crypto-Assets-and-Derivatives-to-OJK-BI.aspx
- Nusantara Legal — Transition from Bappebti to OJK: https://nusantaralegal.com/understanding-the-transition-of-supervisory-authority-over-digital-financial-assets-in-indonesia-from-bappebti-to-ojk/
- ADCO Law — Direction of Crypto Asset Regulation in Indonesia: https://adcolaw.com/blog/the-direction-of-crypto-asset-regulation-in-indonesia-following-the-transfer-of-supervisory-authority-from-bappebti-to-the-ojk
- NGLL Law — Bappebti Crypto Oversight Changes (2025): https://ngllaw.net/bappebti-crypto-oversight-and-licensing-what-changed-in-indonesia-in
- Mondaq — Understanding Transition of Supervisory Authority: https://www.mondaq.com/commoditiesderivativesstock-exchanges/1633680/understanding-the-transition-of-supervisory-authority-over-digital-financial-assets-in-indonesia-from-bappebti-the-commodity-futures-trading-regulatory-agency-to-ojk-the-financial-services-authority
- Lexology — Transition of Crypto Asset Supervision (2025): https://www.lexology.com/library/detail.aspx?g=7a498fdd-ad79-4f74-a489-a33f94eac135
- BTCC — Tokenize Indonesia Launches: https://www.btcc.com/en-US/square/Blockchainreporter/258430
- Bagus Enrico — OJK's Expanded Framework on DFA: https://bagusenrico.com/legal-insight/ojk%E2%80%99s-expanded-framework-on-digital-financial-assets--new-amendments-and-new-draft-regulation
- TNGlobal — GORO First in Indonesia Regulatory Sandbox: https://technode.global/2024/12/05/goro-becomes-first-participant-in-indonesias-regulatory-sandbox-for-property-tokenization/
- D3 Labs — Project Wira ($88B by 2030): https://d3labs.io/blog/detail/project-wira-indonesias-asset-tokenization-market-to-reach-88-billion-by-2030/
- Mondaq — Indonesia Strengthens Framework Under OJK Reg 23/2025: https://www.mondaq.com/commoditiesderivativesstock-exchanges/1734852/indonesia-strengthens-regulatory-framework-for-digital-financial-asset-trading-key-updates-under-ojk-regulation-no-23-of-2025
- SQMU — Tokenising Indonesian Property: https://sqmu.net/guide/2026/04/tokenising-indonesian-property-with-sqmus-open-source-stack/
- Tokenizer.Estate — Indonesia: https://tokenizer.estate/indonesia
- D3 Labs — Indonesia's First Property Asset Tokenization: https://d3labs.io/blog/detail/indonesias-first-property-asset-tokenization/
- SQMU — Transforming Indonesia's Real Estate Market: https://sqmu.net/market-analysis/2025/08/indonesia-case-study-tokenising-real-estate-with-sqmu/
- Bahori Ahoen Institute — Tokenization in Real Estate Markets (2026): https://bahoriahoeninstitute.com/journal-tokenization-real-estate-multidisciplinary-analysis/

### Subscription Agreements & KYC
- Umbrex — Subscription Agreement: https://umbrex.com/resources/private-equity-glossary/subscription-agreement/
- Investopedia — Subscription Agreement: https://www.investopedia.com/terms/s/subscriptionagreement.asp
- Acquisition Stars — Subscription Agreement Guide (2026): https://acquisitionstars.com/blog/subscription-agreement-guide
- UPCounsel — Subscription Agreement Basics: https://www.upcounsel.com/subscription-agreement
- KonsLaw — What Is a Subscription Agreement: https://konslaw.com/legal-news/what-is-a-subscription-agreement/
- Vestlane — PE Fund Subscription Agreement Guide: https://vestlane.pages.dev/blog/subscription-agreement-investor-guide
- FrameLegal — Understanding Subscription Agreements: https://www.framelegal.com/business-transactions/business-agreements/subscription-agreement/

### NAV & Oracle Design
- Chainlink — Net Asset Value Data: https://chain.link/article/net-asset-value-data
- RedStone — NAV Onchain (2026): https://blog.redstone.finance/2026/04/23/nav-onchain-how-tokenized-fund-pricing-works-and-why-oracle-design-matters/
- Orochi Network — NAV Lag in Tokenized Funds: https://orochi.network/blog/nav-lag-tokenized-funds-defi-collateral
- Goldsky — Build Multi-Chain NAV Oracle: https://docs.goldsky.com/compose/guides/build-a-nav-oracle
- Zoth — Oracle and Attestation Security: https://docs.zoth.io/zoth/security-and-risk-management-framework/oracle-and-attestation-security
- TOSS — NAV Update Process: https://docs.toss.fi/protocol/processes/system/nav-update
- NAVquant — NAV Calculation Process: https://www.navquant.com/blog/nav-calculation-process-data-to-report

---

*End of Report*
