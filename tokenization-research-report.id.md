# Laporan Riset Landscape Tokenisasi

> Disusun: 16 Mei 2026
> Scope: Landscape Tokenisasi Global, security products, regulasi (Reg D/Reg S), prerequisites, steps, requirements, secondary markets, overlooked details, dan framework regulasi spesifik Indonesia (OJK/Bappebti).

---

## Daftar Isi

1. [Lanskap Tokenisasi](#1-Tokenisasi-landscape)
2. [Solusi yang Tersedia — Platform Landscape](#2-solusi-yang-tersedia--platform-landscape)
3. [Token Standards](#3-token-standards)
4. [Regulasi & Kebijakan — Global](#4-regulasi--kebijakan--global)
5. [Prerequisites untuk Private Equity Tokenisasi](#5-prerequisites-untuk-private-equity-Tokenisasi)
6. [Step-by-Step: Cara Tokenize](#6-step-by-step-cara-tokenize)
7. [Berapa Banyak yang Harus di-Tokenize](#7-berapa-banyak-yang-harus-di-tokenize)
8. [Bagaimana Tokenisasi Bekerja Secara Detail](#8-bagaimana-Tokenisasi-bekerja-secara-detail)
9. [Bagaimana Investor Membeli Tokenized Assets](#9-bagaimana-investor-membeli-tokenized-assets)
10. [Secondary Market Mechanics](#10-secondary-market-mechanics)
11. [Hal-Hal Kecil yang Sering Terlewat](#11-hal-hal-kecil-yang-sering-terlewat)
12. [Pertanyaan 1: Licenses Dijelaskan](#pertanyaan-1-apa-itu-licenses-broker-dealer-transfer-agent-sec-registered-mas-licensed-ats-partner-ats)
13. [Pertanyaan 2: Regulatory Landscape Indonesia](#pertanyaan-2-regulatory-landscape-dan-market-indonesia)
14. [Pertanyaan 3: Parallel Offerings](#pertanyaan-3-apa-itu-parallel-offerings)
15. [Pertanyaan 4: Subscription Agreements](#pertanyaan-4-apa-itu-subscription-agreement-dan-apa-artinya-subscribe)
16. [Pertanyaan 5: Tanggung Jawab KYC/AML](#pertanyaan-5-siapa-yang-melakukan-kycaml--pihak-yang-melakukan-tokenizing-atau-investor)
17. [Pertanyaan 6: Net Asset Value (NAV)](#pertanyaan-6-net-asset-value-nav--kenapa-pakai-formula-dan-kenapa-tidak-sekadar-post-manual)
18. [Pertanyaan 7: Framework Regulasi Tokenisasi Indonesia — Detail Lengkap](#pertanyaan-7-framework-regulasi-tokenisasi-indonesia--detail-lengkap-per-peraturan)
19. [Source Links](#source-links)

---

## 1. Landscape Tokenisasi

Tokenized real-world assets (RWAs) mencapai **~$30 miliar pada April 2026**, lebih dari tiga kali lipat dari ~$8.8 miliar setahun sebelumnya. Pertumbuhan sangat terkonsentrasi — **tokenized treasuries dan money market funds mendominasi**. Tokenized real estate tumbuh dari ~$35M ke ~$296M, dan private equity dari ~$60M ke ~$223M.

Pasar STO platform sendiri bernilai **$1.21B pada 2025**, diproyeksikan mencapai **$5.67B pada 2034** (18.7% CAGR).

Tokenisasi tidak mengubah risiko atau nilai underlying asset — ia meningkatkan efisiensi dalam issuance, trading, dan settlement. Framework legalnya sama dengan securities tradisional. Yang berubah adalah infrastruktur: on-chain cap tables, programmable compliance, atomic settlement, dan aksesibilitas 24/7.

---

## 2. Solusi yang Tersedia — Platform Landscape

### Tier 1 — SEC-Registered Full-Stack Platforms (US)

| Platform | Licenses | Min Issuance | Secondary Market | Blockchains |
|---|---|---|---|---|
| **Securitize** | Broker-Dealer, Transfer Agent, ATS | $5M+ | Securitize Markets (ATS) | Ethereum, Polygon, Avalanche |
| **Tokensoft** | SEC-registered (6 divisions engaged) | N/A | Partner ATS | Ethereum + all EVM |
| **tZERO** | Broker-Dealer, ATS | $10M+ | tZERO ATS | Ethereum, Tezos |
| **INX** | SEC-registered | N/A | INX One | Ethereum |
| **KoreConX** | SEC-registered Transfer Agent | $1M+ | Partner ATS | Private/Public |

**Securitize** adalah pemimpin jelas untuk US-regulated issuances. Menggerakkan BlackRock's BUIDL fund. Lebih dari $2B diproses.
**Tokensoft** adalah satu-satunya platform yang compliance-nya telah direview dan diterima oleh SEC untuk fully registered offerings. Co-authored ERC-1404. 80,000+ investor onboardings/jam.
**Ondo Finance** membuka Global Markets pada September 2025 — tokenized US stocks/ETFs untuk investor non-US. Lebih dari $650M TVL, $12B+ volume kumulatif, ~60% market share. SEC menutup investigasi tanpa charges.

### Tier 2 — EU/International Platforms

| Platform | HQ | Regulatory Status | Key Feature |
|---|---|---|---|
| **Tokeny** | Luxembourg | Tech provider, ERC-3643/T-REX | $32B+ tokenized, didukung oleh Euronext |
| **ONINO** | Germany | White-label, DLT Pilot Regime | 24+ EU/Swiss countries, $35M+ |
| **Stokr** | Luxembourg | Regulated | $1B+ tokenized |
| **DigiShares** | Denmark | Regulated | $1B+ tokenized |
| **Securitize Europe** | Spain | CNMV DLT Trading & Settlement | Satu-satunya otorisasi DLT Pilot Regime di EU |
| **Bitbond** | Berlin | BaFin-regulated | EU-focused |
| **21X AG** | Germany | DLT MTF authorized | Regulated secondary venue |
| **360X AG** | Germany | DLT MTF authorized | Regulated secondary venue |

### Tier 3 — Decentralized/DeFi-Native

| Platform | Focus | Key Feature |
|---|---|---|
| **Centrifuge** | Decentralized credit | $600M+ financed, trade finance, real estate debt |
| **Maple Finance** | Institutional private credit | Managed lending |
| **Polymath/Polymesh** | Purpose-built blockchain | Identity-first, dibangun untuk security tokens |
| **Republic** | Retail/crowdfunding | $50k+ minimum, Reg CF |

### Tier 4 — Specialized/Niche

| Platform | Focus |
|---|---|
| **OWNR** | Mortgage-backed securities, T3 Protocol untuk atomic settlement |
| **ADDX** | Singapore, MAS-licensed, Hamilton Lane tokenized PE fund |
| **InvestaX** | Singapore/APAC, MAS-regulated |
| **Backed Finance** | Swiss DLT-regulated tokenized stocks |
| **Aktionariat** | Swiss DLT law, tokenized private equity dengan order book |

---

## 3. Token Standards

| Standard | Digunakan Oleh | Status |
|---|---|---|
| **ERC-3643 (T-REX)** | Tokeny, kebanyakan platform EU, Securitize Europe | **Direkomendasikan.** Open standard, on-chain compliance via ONCHAINID identity contracts. Setiap transfer memverifikasi kelayakan investor secara otomatis. |
| **ERC-1400** | Polymath, beberapa platform US | Established tapi kurang composable dengan DeFi. Menggabungkan ERC-1410, ERC-1594, ERC-1643, ERC-1644. |
| **ERC-1404** | Tokensoft | Satu-satunya token standard yang digunakan dalam fully SEC-registered securities offering. |
| **ERC-7518** | Zoniqx | Lebih baru, emerging, lebih sedikit integrasi. |
| **Proprietary** | Legacy platforms | **Hindari.** Menciptakan lock-in, tidak ada portability. |
| **Token-2022 (Solana)** | Solana-based issuances | Native extension architecture mendukung transfer restrictions, confidential transfers. |
| **STV3 (Stobox)** | Stobox 4 | DID-based compliance, transfer restrictions, cap table enforcement. |

---

## 4. Regulasi & Kebijakan — Global

### United States

Joint statement SEC tanggal 28 Januari 2026 memperjelas: **tokenized securities tetap tunduk pada seluruh US federal securities laws.** Tokenisasi adalah perubahan proses teknologi, bukan perubahan analisis legal yang mendasarinya. SEC mengumpulkan **$4.98 miliar dalam penalties selama 2024**, 58% untuk unregistered securities offerings.

**Key Exemptions:**

| Rule | Investors | General Solicitation | Verification |
|---|---|---|---|
| **Reg D 506(b)** | Unlimited accredited + hingga 35 sophisticated non-accredited | Tidak | Self-certification |
| **Reg D 506(c)** | Accredited investors saja | Ya | Diperlukan reasonable steps (tax returns, bank statements, CPA letters) |
| **Reg S** | Non-US persons saja | Offshore only | Verifikasi status non-US person |
| **Reg A+** | Retail + accredited | Ya | SEC qualification (Form A), $75M cap |

**Accredited Investor Thresholds (update 2025):**
- Individu: $1M net worth (tidak termasuk primary residence) ATAU $200K pendapatan tahunan ($300K joint)
- Entitas: $5M dalam assets
- SEC guidance: siapa pun yang investasi $200K+ bisa **dipresumsikan** accredited di kebanyakan kasus

### European Union

- **MiCA** (efektif penuh Des 2024): Tidak mencakup financial instruments di bawah MiFID II. Kebanyakan tokenized securities masuk MiFID II, bukan MiCA.
- **DLT Pilot Regime** (efektif Maret 2023): Hanya **empat operator yang terotorisasi** per awal 2026: CSD Prague, 21X AG, 360X AG, Securitize Europe. **Primary issuance sudah matang; regulated secondary liquidity adalah bottleneck-nya.**
- **eWpG** (Jerman, Jan 2024): Digital securities law.

### Other Jurisdictions

| Jurisdiction | Regulator | Framework |
|---|---|---|
| **Switzerland** | FINMA | DLT Act (2021) — fleksibel |
| **Singapore** | MAS | Recognized Market Operator licensing |
| **UAE/Dubai** | VARA | Professional investor focus |
| **UK** | FCA | Prospectus requirements, KYC/AML |
| **Hong Kong** | SFC | Licensing requirements |
| **Japan** | FSA | Payment Services Act, strict KYC/AML |
| **Saudi Arabia** | SAMA | Security token framework, Vision 2030 |

---

## 5. Prerequisites untuk Private Equity Tokenisasi

### Legal & Structural
1. **Legal Entity Formation**: Delaware LP/LLC (US), Cayman/BVI (offshore), Luxembourg RAIF (EU)
2. **SPV Formation**: Memegang actual PE asset; tokens merepresentasikan fractional ownership
3. **Amend Operating Agreement**: Harus secara eksplisit mengakui on-chain token records sebagai authoritative cap table
4. **Howey Test Analysis**: Menentukan apakah token adalah security (hampir semua PE Tokenisasis adalah)
5. **Securities Counsel**: Libatkan sebelum keputusan teknologi apa pun. Biaya: $15K-$80K+
6. **Offering Documents**: PPM, subscription agreements, token terms
7. **KYC/AML Infrastructure**: Identity verification, source of funds, sanctions screening, PEP screening
8. **Custody**: Institutional-grade custody non-negotiable untuk US-regulated funds

### Technical
9. **Token Standard Selection**: ERC-3643 (EU), ERC-1404 (US), atau Token-2022 (Solana)
10. **Smart Contract Audit**: Wajib sebelum go live
11. **Platform Selection**: Minimum deal sizes bervariasi: $5M-$10M+ untuk institutional, $500K+ untuk yang lebih kecil
12. **Blockchain Selection**: Ethereum (institutional), Polygon/Avalanche (cost), Solana (speed)
13. **ISO 27001 dan SOC 2 certifications** untuk infrastructure providers — baseline requirements

### Estimasi Biaya

| Komponen | Rentang Biaya |
|---|---|
| Legal structuring & counsel | $15K - $80K+ |
| SPV/entity formation | $5K - $30K |
| Smart contract development & audit | $10K - $50K |
| Platform setup/engagement | $50K - $150K (minimums) |
| KYC/AML integration | $5K - $20K |
| Ongoing compliance/admin | 0.5% - 2% dari AUM per tahun |

**Total: $85K - $330K+**, dengan timeline 3-6 bulan.

---

## 6. Step-by-Step: Cara Tokenize

### Phase 1: Legal & Regulatory Structuring (Minggu 1-8)
1. Libatkan securities counsel — sebelum keputusan teknologi apa pun
2. Tentukan jurisdiction dan exemption path (Reg D, Reg S, Reg A+, atau kombinasi)
3. Bentuk legal entity/SPV
4. Amend fund documents — akui on-chain records, definisikan token rights
5. Draft offering documents — PPM, subscription agreements, token terms
6. Bad actor checks — kuesioner untuk semua covered persons
7. Tentukan selling geography dan tipe investor

### Phase 2: Technology Setup (Minggu 4-12)
8. Pilih Tokenisasi platform
9. Pilih token standard
10. Deploy smart contracts — encode transfer restrictions, whitelists, jurisdiction flags, lockups
11. Independent smart contract audit — wajib
12. Integrasikan KYC/AML provider
13. Setup custody — qualified custodian, MPC wallets
14. Integrasikan NAV/oracle infrastructure

### Phase 3: Issuance & Onboarding (Minggu 8-16)
15. Konfigurasi primary issuance — minimum investment amounts, pricing, NAV
16. Investor onboarding — KYC/AML, accreditation, jurisdiction, wallet whitelisting
17. Mint dan distribusikan tokens
18. File Form D — dalam 15 hari setelah first sale (Reg D)
19. State Blue Sky filings — notice filing di setiap state tempat investor berada

### Phase 4: Post-Issuance (Berkelanjutan)
20. Ongoing compliance — AML monitoring, sanctions updates, claim renewals
21. NAV reporting — pembaruan valuasi reguler, diposting on-chain
22. Distribution automation — dividen, kupon, revenue share via smart contracts
23. Cap table management — blockchain adalah source of truth
24. Corporate actions — voting, consent solicitations, forced transfers
25. Regulatory reporting — periodic filings, investor reporting, tax reporting

---

## 7. Berapa Banyak yang Harus di-Tokenize

| Tipe Aset | Minimum Viable Threshold | Catatan |
|---|---|---|
| **Single-asset real estate** | $10M+ property value | Di bawah $10M, structuring costs mengonsumsi 8%-12% dari raise |
| **Pooled fund** | $50M - $100M AUM | Di bawah ini, single-asset SPVs lebih efisien |
| **PE fund Tokenisasi** | $5M+ (via Securitize) | Hamilton Lane: minimum dari $125K turun ke $10K |
| **Small deals** | $500K - $5M | Polymath atau direct Reg D tanpa platform |

Economics bersifat front-loaded. Di bawah threshold, per-deal costs mendominasi. Di atas threshold, costs teramortisasi di seluruh portfolio.

---

## 8. Bagaimana Tokenisasi Bekerja Secara Detail

### Token Structure

Security token **bukan** underlying asset. Ia adalah **representasi digital** dari klaim legal:

- **Issuer-sponsored model**: Issuer membuat tokens yang secara substansial memiliki hak yang sama dengan underlying security. Blockchain berfungsi sebagai official ownership record.
- **Custodial tokenized securities** (third-party): Pihak ketiga memegang underlying dalam custody, menerbitkan tokens sebagai entitlements.
- **Synthetic tokenized securities**: Tokens meniru economic exposure tanpa underlying rights. Mungkin diklasifikasikan sebagai **security-based swaps** (ada regulatory layer tambahan).

### Compliance Enforcement

**Programmable compliance** adalah inovasi kritis:

1. **On-chain identity (ONCHAINID/DID)**: Setiap investor mendapatkan blockchain-based identity contract dengan signed claims (accredited status, jurisdiction, KYC clearance)
2. **Transfer restrictions di tingkat smart contract**: Sebelum transfer mana pun dieksekusi, contract memeriksa:
   - Apakah recipient wallet whitelisted?
   - Apakah ada valid KYC/AML claims?
   - Apakah jurisdiction diizinkan?
   - Apakah holding period sudah terlewati (Reg D: 12 bulan, Reg S: 40 hari-1 tahun)?
   - Apakah ada concentration limits atau affiliate transfer rules?
3. **Jika salah satu check gagal, transfer revert on-chain.**

### NAV & Pricing

- NAV = (total portfolio asset value - liabilities) / outstanding tokens
- Biasanya dihitung bulanan/triwulanan oleh fund administrators
- On-chain NAV (via Chainlink atau sejenisnya) memungkinkan kalkulasi berkelanjutan, mencegah stale pricing arbitrage

---

## 9. Bagaimana Investor Membeli Tokenized Assets

### Primary Market (Pembelian Awal)

1. **Daftar di platform** — account dengan email, country, investor type
2. **Selesaikan KYC/AML** — government ID, proof of address, selfie, source of funds (3-7 hari kerja)
3. **Accreditation verification** (jika Reg D) — tax returns, bank statements, atau third-party letter
4. **Jurisdiction verification** — konfirmasi eligibilitas berdasarkan offering geography
5. **Terima ONCHAINID/DID** — smart contract di-deploy dengan verified claims
6. **Wallet setup** — self-custody (MetaMask), integrated/MPC wallet, atau custodial
7. **Fund account** — bank wire, fiat-to-stablecoin on-ramp, crypto deposit, ACH
8. **Sign subscription documents** — electronic signature
9. **Tokens dialokasikan** — smart contract mint/transfer, menerapkan lockups/vesting

### Secondary Market (Trading Setelah Issuance)

| Tipe Venue | Deskripsi | Likuiditas |
|---|---|---|
| **Regulated ATS/MTF** | Licensed marketplaces (Securitize Markets, tZERO, 21X, 360X) | Continuous atau periodic, institutional-grade |
| **Custodial Marketplaces** | Trading dibangun di dalam custodian infrastructure | Settlement efisien, client base terbatas |
| **RFQ/OTC Pools** | Request-for-Quote, dinegosiasikan melalui brokers | Episodik, pricing fleksibel |
| **Issuer Bulletin Boards** | Komunikasi investor-ke-investor, tanpa matching engine | Likuiditas terbatas |
| **DeFi/AMMs** | Permissionless pools (Uniswap, Aave Horizon) | Continuous tapi terbatas pada compliant tokens |

**Proses trading:**
1. Seller mendaftarkan tokens di licensed venue
2. Venue mencocokkan dengan eligible buyer
3. Smart contract memverifikasi kelayakan buyer sebelum eksekusi
4. Jika semua check lulus, trade settle **on-chain** — T+0 atomic delivery-versus-payment
5. Cap table terupdate secara otomatis

---

## 10. Secondary Market Mechanics

### EU Framework

- **MiFID II**: Mendefinisikan tiga tipe venue — regulated markets (RMs), multilateral trading facilities (MTFs), organized trading facilities (OTFs). MTFs paling relevan untuk tokenized securities.
- **DLT Pilot Regime** (Regulation EU 2022/858): Sandbox untuk DLT-based trading. Tiga tipe entity: DLT MTFs, DLT SSs, DLT TSSs.
- **ERC-3643 (T-REX)**: Menerapkan identity-based compliance di tingkat protocol. Compliance mengikuti token, bukan platform.

### US Framework

- **ATS yang dioperasikan oleh FINRA-registered broker-dealers**
- **Compliance-gated order books**: Hanya peserta yang sudah terverifikasi dan eligible yang diterima
- **Atomic DvP settlement**: Pertukaran tokens dan pembayaran secara simultan — tanpa settlement window, tanpa counterparty risk, tanpa CCP

### Perbedaan Kunci dari Pasar Tradisional

| Aspek | Tradisional | Tokenized |
|---|---|---|
| Settlement | T+1 atau T+2 | T+0 (atomic) |
| Jam trading | Jam pasar | 24/7 |
| Compliance | Tingkat broker | Tingkat token (smart contract) |
| Records | Database | Diverifikasi blockchain |
| Counterparty risk | Clearinghouse | Tidak ada (atomic DvP) |

---

## 11. Hal-Hal Kecil yang Sering Terlewat

### GP Consent Rights
Kebanyakan PE fund operating agreements memerlukan GP consent untuk transfer LP interest. Ini harus di-encode sebagai smart contract approval step. Jika men-tokenize existing fund, operating agreement mungkin perlu amendemen.

### "Shadow Investors" / Orphaned Token Holders
Tokenisasi harus menghindari penciptaan token holders tanpa enforceable contractual rights. Secondary buyers harus secara proper di-admit sebagai LPs di feeder/SPV.

### Lockup dan Vesting Enforcement
- Reg D 12-month holding period (Rule 144)
- Reg S distribution compliance period (40 hari-1 tahun)
- Fund-specific lockups (misalnya, 2-year hard lockup)
- Gates dan redemption limits (misalnya, maks 10% NAV per kuartal)

### Force Transfer untuk Legal Compliance
Di mana hukum mewajibkan (court orders, lost keys, regulatory action), admin/transfer-agent dapat melakukan force-transfer tokens dengan on-chain trail.

### FATCA/CRS Reporting
Cross-border token holders memicu kewajiban pelaporan pajak. ONCHAINID/DID memecahkan ini dengan menghubungkan identity ke wallet.

### Implikasi Pajak
- Setiap distribusi token adalah taxable event (FMV pada saat penerimaan)
- Token vesting taxable di vest, bukan di release
- Cross-border contributors mungkin berutang pajak di multiple jurisdictions
- Withholding mungkin diperlukan sebelum token delivery
- Capital gains pada secondary sales berlaku

### Oracle Risk untuk Illiquid Assets
Chainlink Proof of Reserve "hanya memastikan bahwa data dari centralized entities tidak di-tamper sebelum masuk on-chain" — tidak **memvalidasi kredibilitas underlying attestation**. Masalah teknis tersulit dalam RWA Tokenisasi.

### Cold Start Liquidity Problem
Tokenized PE fund dengan $50M NAV tidak berarti jika daily trading volume hanya $12,000. Riset akademis mengonfirmasi bahwa kebanyakan RWA tokens menunjukkan volume rendah, holding period panjang, partisipasi terbatas.

### Custody 24/7 Mismatch
Pasar crypto beroperasi 24/7. Qualified custodians umumnya tidak. Programmatic alerts tidak berguna jika aset tidak bisa ditransfer sampai custodian buka.

### Blue Sky State Filings
Federal exemptions tidak menghilangkan kewajiban di tingkat state. Harus file Form D di **setiap state tempat investor berada** dalam 15 hari setelah first sale.

### SEC January 2026 Taxonomy
1. **Issuer-sponsored**: Token dan underlying security memiliki hak yang secara substansial sama
2. **Custodial tokenized securities** (third-party): Pihak ketiga memegang underlying, menerbitkan token sebagai entitlement
3. **Synthetic tokenized securities**: Meniru economic exposure tanpa underlying rights (mungkin merupakan security-based swaps)

### DTC Pilot Program
DTC menerima no-action letter (Des 2025) untuk securities Tokenisasi pilot yang diluncurkan H2 2026. Nasdaq mengajukan pendaftaran untuk memungkinkan tokenized securities trading di bawah program ini.

---

## Pertanyaan 1: Apa Itu Licenses? Broker-Dealer, Transfer Agent, SEC-Registered, MAS-Licensed, ATS, Partner ATS

### Broker-Dealer (BD)
Seseorang atau firma yang dilisensi oleh SEC (US) dan FINRA untuk membeli/menjual securities atas nama orang lain (broker) atau untuk account sendiri (dealer).

**Apa yang bisa dilakukan:**
- Memfasilitasi secondary market trading dari security tokens
- Bertindak sebagai intermediary antara buyers dan sellers
- Menangani investor onboarding, order routing, settlement
- Secara legal menerima kompensasi untuk mengeksekusi securities transactions

**Kenapa penting:** Memfasilitasi trading security token tanpa BD license = mengoperasikan unregistered broker-dealer — salah satu SEC enforcement actions yang paling umum.

### Transfer Agent (TA)
Terdaftar di SEC untuk memelihara official record of ownership untuk suatu security. Melacak siapa memiliki apa, memproses transfers, menangani corporate actions, memelihara cap table.

**Apa yang bisa dilakukan:**
- Menjadi sumber otoritatif secara legal untuk "siapa pemilik token ini"
- Memproses token minting, burning, transfers sebagai official record
- Menerbitkan replacement tokens untuk lost keys (recovery mechanism)
- Menangani corporate actions on-chain

**Kenapa penting:** **Harus** ada pihak yang bertanggung jawab secara hukum yang memelihara official ownership record. Smart contract menangani mekanisme, tapi Transfer Agent merespons disputes, court orders, dan regulatory inquiries.

### SEC-Registered
Entity atau offering yang terdaftar di US Securities and Exchange Commission. Multiple forms:
- **SEC-registered offering**: Full registration (Form S-1). Biaya $1M+, memakan 6-12 bulan.
- **SEC-registered entity**: BD, TA, ATS, investment adviser yang telah melalui SEC registration.
- **Exempt offering**: Menggunakan Reg D, Reg S, atau Reg A+ untuk menghindari full registration sambil tetap compliant.

Tokensoft adalah satu-satunya platform yang compliance-nya telah direview dan diterima oleh SEC di enam divisi untuk fully registered offerings.

### MAS-Licensed (Singapore)
Monetary Authority of Singapore license untuk digital asset trading (sebagai **Recognized Market Operator**). Memungkinkan fasilitasi legal tokenized securities trading di Singapore.

**Kenapa penting:** Singapore adalah salah satu jurisdiction paling crypto-friendly di antara negara-negara besar. ADDX telah MAS-licensed sejak Feb 2020, men-tokenize Hamilton Lane's fund (minimum dari $125K ke $10K). MAS licensing menandakan institutional-grade compliance yang menarik Asian capital.

### ATS (Alternative Trading System)
SEC-registered, FINRA-regulated trading venue yang mencocokkan buyers dan sellers securities **tanpa** menjadi full national securities exchange. "Private stock exchange" untuk unlisted securities.

**Apa yang dilakukan:**
- Mengoperasikan order book untuk buy/sell orders
- Mencocokkan orders dan mengeksekusi trades
- Memastikan kepatuhan terhadap transfer restrictions yang di-encode di smart contract
- Menangani settlement (T+0 di blockchain vs T+1/T+2 tradisional)

**Kenapa penting:** Primary legal pathway untuk secondary market trading security tokens di US. Tanpa ATS, tidak ada regulated venue bagi investor untuk menjual tokenized holdings. Securitize Markets adalah yang paling aktif. tZERO juga mengoperasikan ATS yang prominent.

### Partner ATS
Banyak Tokenisasi platforms (Tokeny, Polymath, DigiShares) **tidak mengoperasikan ATS sendiri**. Mereka bermitra dengan operator ATS yang sudah ada (Securitize Markets, tZERO) untuk akses secondary market.

**Kenapa model ini:**
- Mengoperasikan ATS memerlukan FINRA registration, kapital substansial, overhead compliance berkelanjutan
- Banyak platform yang berspesialisasi di **issuance technology**, menyerahkan secondary ke licensed partners
- Token standards (ERC-3643, ERC-1404) memastikan **portability** — token bisa trading di ATS mana pun yang kompatibel

---

## Pertanyaan 2: Regulatory Landscape dan Market Indonesia

### Peralihan Regulasi: Bappebti → OJK

**Sebelum 10 Januari 2025:** Crypto diatur oleh **Bappebti** (Kementerian Perdagangan) sebagai **komoditas**.

**Setelah 10 Januari 2025:** Crypto dan seluruh Digital Financial Assets (Aset Keuangan Digital / AKD) diatur oleh **OJK** (Otoritas Jasa Keuangan) sebagai **financial instruments**. Mandat dari:
- **UU No. 4 Tahun 2023** (UU P2SK)
- **PP No. 49 Tahun 2024** (PP 49/2024)
- **POJK No. 27 Tahun 2024** — berlaku 10 Januari 2025
- **POJK No. 23 Tahun 2025** — berlaku 10 November 2025

Crypto **bukan lagi komoditas** di Indonesia. Ia sekarang adalah **digital financial asset** yang tunduk pada standar regulasi jasa keuangan.

### Framework Regulasi Saat Ini

#### POJK 27/2024 (sebagaimana diubah oleh POJK 23/2025) — Trading Framework
Mengatur **secondary market** untuk Digital Financial Assets (AKD):
- **Market Infrastructure**: Bursa AKD, Kliring (KKI), Kustodian, Pedagang — semuanya **berlisensi OJK**
- **Capital Requirements**: Minimum paid-up capital naik dari IDR 1B menjadi **IDR 5B** untuk traders
- **Fit-and-proper test** untuk manajemen senior
- **Mandatory disclosures** untuk setiap produk yang ditawarkan ke retail
- **AML/KYC** ditegakkan oleh unit financial intelligence OJK
- **Staking, lending, DeFi** di bawah pengawasan OJK jika ditawarkan ke pengguna Indonesia
- **PSE registration** secara eksplisit diwajibkan
- **Derivatives** dari DFA sekarang diklasifikasikan sebagai DFA itu sendiri

#### Draft POJK tentang Penawaran DFA (Diterbitkan 19 September 2025) — Primary Market
Mengatur **ICOs/ITOs dan penawaran tokenized assets** untuk pertama kalinya:

| Aspek | Persyaratan |
|---|---|
| **Klasifikasi** | Tokenized assets (backed) vs. crypto assets (currency-backed atau asset-backed) |
| **Persetujuan OJK** | Diperlukan jika nilai penawaran ≥ **IDR 1 miliar** (~USD $59,850) |
| **Pemberitahuan OJK** | Untuk penawaran di bawah IDR 1 miliar |
| **Persetujuan CFX Exchange** | Untuk **unbacked** crypto-assets jika nilai ≥ IDR 1 miliar |
| **Entity requirement** | Harus **PT (Perseroan Terbatas)** berdasarkan hukum Indonesia |
| **Metode penawaran** | Tunggal (3-5 hari kerja) atau berkelanjutan (tokenized/backed only) |
| **Custody** | Asset custodian yang disetujui OJK diperlukan |
| **Settlement** | Lembaga kliring yang disetujui OJK (KKI) |
| **Perlindungan konsumen** | Dokumen yang disetujui OJK diperlukan |
| **Pengecualian** | Capital market securities, central bank-issued, non-transferable, closed-loop, unique NFTs, free offerings |

**Status:** Draft diterbitkan untuk konsultasi publik hingga 2 Oktober 2025. OJK menargetkan **finalisasi pada 2026**.

#### Regulatory Sandbox (POJK 3/2024)
Proyek sandbox yang aktif:
- **Gold Tokenisasi** — lulus Agustus 2025
- **Government securities (SBN) Tokenisasi** — di-fragmentasi untuk aksesibilitas retail
- **Property Tokenisasi**

#### Securities Crowdfunding (POJK 17/2025)
Berlaku 25 Juli 2025. Securities didefinisikan sebagai "konvensional, digital, atau bentuk lainnya." Issuer harus memiliki net assets ≤ IDR 10B (tidak termasuk tanah/bangunan). Dana harus digunakan untuk proyek di Indonesia. Platform operator perlu paid-up capital IDR 25B, equity IDR 5B.

#### Shariah Compliance
OJK bekerja sama dengan DSN-MUI untuk klasifikasi crypto yang shariah-compliant. Tokenized assets dengan real-world underlying assets dipandang memiliki "keselarasan dengan prinsip keadilan ekonomi Islam." Daftar shariah token mungkin akan ditetapkan.

#### Peran Bank Indonesia
- **Crypto tidak bisa digunakan sebagai alat pembayaran** — Rupiah adalah satu-satunya legal tender
- BI mengembangkan **Digital Rupiah** infrastructure untuk settlement
- Platform harus terintegrasi dengan rupiah settlement infrastructure

### Market Tokenisasi Indonesia

**Ukuran Pasar:**
- **Project Wira**: Pasar asset Tokenisasi Indonesia diproyeksikan mencapai **US$88 miliar pada 2030** (pertumbuhan 31.7%)
- **21 juta+ investor crypto** (akhir 2024) — jauh melebihi **6.4 juta** investor saham IDX
- Volume transaksi: **IDR 650 triliun** pada 2024
- Pasar pembayaran digital: **US$760 miliar**; QRIS: 5,925 juta transaksi

**Pemain Aktif:**

| Platform | Status | Fokus |
|---|---|---|
| **GORO** | **Lulus OJK sandbox** (Nov 2025) | Fractional property, dari $1. 100K+ users, 350% AUM growth 2024, ~IDR 42B dari 7 properti |
| **D3 Labs / BTN / RMI** | Sandbox — REIT Tokenisasi | Tokenisasi properti pertama dengan Bank Tabungan Negara |
| **Binaryx** | Beroperasi | Property Tokenisasi |
| **ProspertiHub** | Beroperasi | Property Tokenisasi |
| **Tokenize Indonesia** | Akselerator (April-Agustus 2025) | Didukung Saison Capital, BRI Ventures, Coinvestasi |
| **Seaseed Network** | Layer-1 blockchain | Permissioned public blockchain untuk financial institutions |
| **CFX Exchange** | Bursa berlisensi | Central crypto exchange |
| **KKI** | Kliring berlisensi | Settlement untuk DFA trading |
| **ICC** | Kustodian berlisensi | Digital asset custody |

**Tiga Pathways untuk Tokenisasi di Indonesia:**

1. **Local DFA Offering di bawah POJK 27/2024 + Draft POJK Penawaran** — PT Indonesia menerbitkan tokens ke investor domestik. Memerlukan license OJK. Setup: 6-10 minggu.

2. **OJK Sandbox Pilot di bawah POJK 3/2024** — Uji coba di bawah pengawasan OJK. Jalur menuju full licensing. Setup: 8-12 minggu.

3. **Offshore Issuer dengan Geo-Blocking** — Offshore entity menerbitkan tokens yang mereferensikan aset Indonesia. Penduduk Indonesia dikecualikan. Setup: 4-6 minggu.

**Tantangan Legal Khusus Indonesia:**
- **Agrarian Law Gap**: UUPA No. 5/1960 tidak mengakui digital tokens sebagai hak kebendaan yang valid (in rem rights). Tokens merepresentasikan klaim kontraktual, bukan hak milik langsung atas properti.
- **Tax Efficiency Crisis**: Rezim pajak dirancang untuk transaksi tunggal bernilai tinggi. Ribuan micro-transactions menciptakan beban kepatuhan yang masif. Diusulkan: **Aggregated Tax Consolidation** — platform bertindak sebagai Withholding Agent (WAPU), triggering pembayaran pajak penuh hanya saat final Transfer of Title (AJB).
- **Foreign Ownership Restrictions**: Hukum properti Indonesia membatasi kepemilikan asing.
- **Crypto Payment Prohibition**: Bank Indonesia melarang crypto untuk pembayaran. Semua settlement dalam Rupiah.

---

## Pertanyaan 3: Apa Itu Parallel Offerings?

**Parallel offering** berarti menjalankan **dua atau lebih penggalangan dana secara simultan** di bawah **exemptions regulasi yang berbeda**, menargetkan **populasi investor yang berbeda**, untuk **underlying asset yang sama**.

### Reg D + Reg S (Paling Umum)

| Track | Target | Regulation | Persyaratan |
|---|---|---|---|
| **US Track** | US accredited investors | Reg D 506(c) | Accreditation verification, Form D dalam 15 hari, Blue Sky filings |
| **Offshore Track** | Non-US persons | Reg S | Verifikasi status non-US, tidak ada directed selling di US, distribution compliance period (40 hari-1 tahun) |

**Kenapa melakukan parallel offerings:**
1. Memaksimalkan kapital — akses investor US dan internasional secara simultan
2. Terms yang berbeda — pricing, minimums, rights yang berbeda per track
3. Safe harbor dari integration — SEC secara eksplisit menyatakan Reg D dan Reg S tidak akan "diintegrasikan" jika distruktur dengan benar

### Integration Risk — Zona Bahaya

SEC mungkin "mengintegrasikan" separate offerings menjadi **satu offering** jika mereka tampak sebagai satu rencana pembiayaan. Jika diintegrasikan, combined offering harus memenuhi setidaknya satu exemption — dan Reg D + Reg S bersama-sama mungkin gagal memenuhi keduanya.

**Untuk menghindari integration risk:**
- Pisahkan offering documents (PPM berbeda untuk US vs. offshore)
- Pisahkan subscription processes
- Pisahkan marketing channels (tidak ada global social media yang menargetkan US persons)
- Timing dan pricing yang terkoordinasi
- Transfer restriction legends yang berbeda pada tokens

---

## Pertanyaan 4: Apa Itu Subscription Agreement dan Apa Artinya "Subscribe"?

**Subscription agreement** adalah **binding legal contract** antara issuer (perusahaan/dana) dan investor, di mana investor berkomitmen untuk membeli sejumlah securities tertentu pada harga tertentu.

### Apa Arti "Subscribe"

To **subscribe** berarti secara formal mengajukan permohonan untuk membeli saham atau fund units yang baru diterbitkan langsung dari issuer.

- **Subscription** = membeli saham baru dari perusahaan (primary market). Modal baru masuk. Total saham bertambah.
- **Secondary purchase** = membeli saham yang sudah ada dari investor lain. Tidak ada modal baru ke perusahaan. Saham berpindah tangan.

Saat Anda "subscribe" ke suatu fund, Anda mengatakan: *"Saya berkomitmen $X ke fund ini dengan terms ini, dan saya menyatakan bahwa saya memenuhi syarat untuk berinvestasi."*

### Isi Subscription Agreement

| Bagian | Tujuan |
|---|---|
| **Investment Terms** | Jumlah yang dikomitmenkan, harga per share/unit, jadwal pembayaran, capital call provisions |
| **Representations & Warranties** | Investor mensertifikasi accredited status, kecanggihan, kemampuan menanggung risiko, pembelian untuk investasi |
| **Accredited Investor Questionnaire** | Sertifikasi detail kategori accredited mana yang berlaku |
| **Risk Acknowledgments** | Securities bersifat restricted, tidak ada public market, kemungkinan rugi total, proyeksi bisa gagal |
| **Transfer Restrictions** | "Restricted" di bawah Rule 144 — tidak bisa dijual kembali tanpa registration atau exemption. Minimum holding 6-12 bulan. |
| **Regulatory Compliance** | Konfirmasi kepatuhan terhadap Reg D, Blue Sky filings, AML requirements |
| **Closings & Timelines** | Kapan modal jatuh tempo, ukuran minimum/maksimum offering, ketentuan refund |
| **Covenants** | Kewajiban berkelanjutan untuk kedua pihak |
| **Indemnification** | Melindungi perusahaan dari misrepresentations investor |
| **Acceptance Mechanism** | Subscription adalah *offer* oleh investor. Perusahaan harus *accept*. Tidak mengikat sampai diterima. |

### PPM vs. Subscription Agreement

- **PPM** = dokumen disclosure. Memberi tahu investor apa yang mereka beli dan apa yang bisa salah.
- **Subscription Agreement** = binding contract. Menangkap komitmen.

**Alur:** Investor membaca PPM → mengevaluasi → menandatangani subscription agreement → mentransfer dana → perusahaan accept → saham/tokens diterbitkan → cap table diupdate.

### Dalam Konteks Tokenisasi

Subscription agreement sering **didigitalisasi**:
- Investor menandatangani secara elektronik melalui platform
- Platform memverifikasi accredited status secara otomatis
- Setelah diterima, smart contract mint tokens ke whitelisted wallet
- Subscription terms (lockups, vesting, transfer restrictions) **di-encode ke dalam smart contract**

---

## Pertanyaan 5: Siapa yang Melakukan KYC/AML — Pihak yang Melakukan Tokenizing atau Investor?

**Kedua pihak berpartisipasi, tapi tanggung jawab berbeda:**

### Pihak yang Melakukan Tokenizing (Issuer / Platform) Bertanggung Jawab untuk:

1. **Menyiapkan dan mengoperasikan sistem KYC/AML** — Kewajiban regulasi ada pada issuer
2. **Memilih KYC provider** — Onfido, ChainScore, atau platform-native
3. **Meninjau dan menyetujui** — Tim compliance meninjau dokumen, screening terhadap sanksi OFAC/EU/UN, melakukan PEP screening, adverse media checks
4. **Menerbitkan on-chain identity claims** — Deploy OnchainID/DID smart contract dengan verified claims
5. **Pemantauan berkelanjutan** — Pembaruan sanksi, perpanjangan claim, pelaporan aktivitas mencurigakan

### Investor Harus:

1. **Menyerahkan dokumen** — Government ID, proof of address, selfie, source of funds, accreditation documentation
2. **Menyelesaikan self-registration** — Buat account, verifikasi email, setujui terms
3. **Memberikan representasi yang akurat** — Sertifikasi accredited status, jurisdiction, intent. Representasi palsu menciptakan liability hukum.
4. **Menjaga keamanan wallet** — Lindungi seed phrase/private keys setelah terverifikasi.

### Poin Kritis

KYC/AML adalah **kewajiban compliance pada issuer**, ditegakkan oleh regulator. Investor tidak bisa "melakukan KYC sendiri" — mereka harus tunduk pada proses issuer. Investor **harus bekerja sama** dengan memberikan dokumen dan informasi yang akurat.

**Dalam praktik: Platform menangani infrastruktur dan review. Investor menyediakan dokumen dan sertifikasi. Issuer bertanggung jawab secara hukum jika gagal melakukan KYC/AML yang memadai — bukan investor.**

---

## Pertanyaan 6: Net Asset Value (NAV) — Kenapa Pakai Formula, dan Kenapa Tidak Sekadar Post Manual?

### Kenapa NAV = (Total Portfolio Asset Value − Liabilities) ÷ Outstanding Tokens

Formula ini merepresentasikan **per-token fair value** dari underlying fund:

> *"Jika kita mencairkan semua yang dimiliki fund hari ini, membayar semua utang, dan membagi sisa nilai secara merata di antara seluruh token holders — berapa nilai setiap token?"*

- **Total Portfolio Asset Value** = Jumlah seluruh holdings pada fair market price
- **Liabilities** = Akrual management fees, biaya operasional, utang outstanding
- **Outstanding Tokens** = Total tokens yang dipegang investor

Standar universal yang digunakan oleh mutual funds, ETFs, dan setiap regulated fund di seluruh dunia. Memastikan **fair pricing** untuk subscriber baru maupun exiting redeemers.

### Kenapa Tidak Post NAV On-Chain Secara Manual?

Secara teknis Anda **bisa** post NAV manual. Banyak platform melakukannya. Tapi ada problem:

#### Seperti Apa Manual Posting:

1. Fund administrator menghitung NAV off-chain
2. Administrator login ke platform dashboard
3. Entry NAV value (misalnya, "110.50 USD")
4. Platform write ke smart contract
5. Smart contract menggunakan NAV untuk pricing subscriptions dan redemptions

#### Problem dengan Manual Posting Murni:

| Problem | Dampak |
|---|---|
| **Human error** | Decimal point yang salah langsung mispricing semua subscriptions/redemptions |
| **Tidak ada cryptographic proof** | Siapa pun dengan akses admin bisa entry angka berapa pun. Tidak ada cara untuk verifikasi bahwa kalkulasi benar. |
| **Stale pricing / NAV lag** | NAV dihitung sekali per hari kerja pada penutupan. Stale selama 20+ jam. Trader sophisticated bisa mengeksploitasi stale-price arbitrage. |
| **Tidak ada audit trail** | Entry manual tidak menciptakan rantai terverifikasi yang menghubungkan NAV ke source data. Regulator membutuhkan trail ini. |
| **Tidak ada tolerance bounds** | Tidak ada flag otomatis jika NAV tiba-tiba berubah 30% tanpa trades yang sesuai. |
| **Single point of failure** | Jika administrator tidak tersedia, NAV tidak terposting. Fund macet. |

#### Apa yang Sebenarnya Dilakukan Industri — Hybrid Approach:

1. **Fund administrator menghitung NAV off-chain** menggunakan regulated fund accounting (selalu off-chain — membutuhkan human judgment, terutama untuk illiquid assets yang memerlukan appraisals).

2. **Oracle atau automated pipeline mengirimkannya on-chain**:
   - **Chainlink SmartData / RedStone**: NAV fund administrator yang terverifikasi secara cryptographic di-attest dan dipublikasikan on-chain. Traceable audit trail.
   - **API integration**: Platform secara otomatis menarik NAV dari sistem administrator via API.
   - **Multi-attestor model**: Dua attestors independen harus setuju pada NAV sebelum diterima on-chain.
   - **Manual upload dengan controls**: Dual approval (four-eye principle), tolerance bounds, timestamped audit logs.

3. **Freshness adalah problem yang sulit**: Oracle tidak memeriksa apakah NAV value **benar** — hanya memastikan bahwa itu **dipublikasikan dengan setia on-chain**. Jika administrator melaporkan NAV berdasarkan appraisal enam bulan lalu, oracle mengirimkan angka enam bulan itu dengan presisi tinggi. **Oracle diperlukan tapi tidak cukup.**

#### Intinya soal NAV:

- **Kualitas tokenized asset ditentukan oleh kualitas appraiser, administrator, dan valuation policy** — bukan oleh oracle vs. manual posting.
- **Oracles memecahkan delivery problem, bukan valuation problem.** Mereka memastikan angka masuk on-chain tanpa tampering. Mereka tidak memastikan angka itu benar.
- **Untuk liquid assets (treasuries, public stocks):** Update NAV harian atau per jam via oracle adalah praktis.
- **Untuk illiquid assets (real estate, private equity):** NAV inherently stale karena appraisals terjadi triwulanan atau tahunan. Tidak ada teknologi yang memperbaiki ini.
- **Manual posting dapat diterima** untuk fund yang lebih kecil atau early-stage, tapi harus mencakup: dual approval, tolerance bounds, audit logging, timestamp freshness yang jelas.

---

## Pertanyaan 7: Framework Regulasi Tokenisasi Indonesia — Detail Lengkap per Peraturan

Bagian ini memberikan rincian per peraturan yang berlaku di Indonesia terkait tokenisasi, ITSK, dan aset keuangan digital. Setiap peraturan dijelaskan ruang lingkup, relevansi terhadap tokenisasi, dan implikasi bagi issuer.

---

### 7.1 Undang-Undang No. 4 Tahun 2023 (UU P2SK) — Pengembangan dan Penguatan Sektor Keuangan

**Tanggal berlaku:** 22 Januari 2023 (diundangkan)

**Ruang lingkup:**
UU P2SK adalah **payung hukum utama** yang mengubah landscape regulasi keuangan Indonesia. UU ini mengubah/menghapus/menetapkan pengaturan baru untuk belasan undang-undang sektor keuangan, termasuk:
- UU No. 21/2011 tentang OJK
- UU Perbankan
- UU Pasar Modal
- UU Perasuransian
- Dan lainnya

**Pasal kunci untuk tokenisasi:**
- **Pasal 216 ayat (1):** OJK berwenang mengatur **Inovasi Teknologi Sektor Keuangan (ITSK)**.
- **Pasal 269 & 270 ayat (3):** Mengamanatkan POJK tentang tata kelola dan manajemen risiko penyelenggara ITSK.
- **Pasal 312 ayat (1):** Peralihan tugas pengaturan dan pengawasan Aset Keuangan Digital dari Bappebti ke OJK harus selesai paling lambat **24 bulan** sejak pengundangan (12 Januari 2025).
- **Pasal 215A (Revisi RUU P2SK Oktober 2025):** LJK Aset Kripto wajib memiliki izin dari OJK. Seluruh aktivitas ITSK terkait aset keuangan digital wajib ditransaksikan melalui dan/atau dilaporkan kepada bursa AKD.

**Relevansi untuk tokenisasi:**
UU P2SK adalah **fondasi konstitusional** bagi seluruh regulasi tokenisasi di Indonesia. Tanpa UU ini, OJK tidak memiliki kewenanganexplicit untuk mengatur tokenisasi, ITSK sandbox, maupun aset keuangan digital. Semua POJK turunan (POJK 3/2024, POJK 27/2024, POJK 30/2025, dll.) bersandar pada UU P2SK.

**Revisi RUU P2SK (Oktober 2025):**
- Disahkan sebagai RUU inisiatif DPR pada 2 Oktober 2025.
- Menambah **Pasal 215A** yang secara eksplisit mengatur LJK Aset Kripto.
- Bursa AKD wajib bermodal disetor minimal **Rp1 triliun** dan didirikan minimal **11 perseroan terbatas**.
- OJK diberi wewenang pembekuan/blokir transaksi kripto oleh pihak asing maupun dalam negeri yang tidak sesuai ketentuan (Pasal 216).

---

### 7.2 Peraturan Pemerintah No. 49 Tahun 2024 (PP 49/2024) — Peralihan Tugas Pengaturan dan Pengawasan AKD

**Tanggal berlaku:** 2024 (sebagai jembatan transisi)

**Ruang lingkup:**
PP ini mengatur mekanisme peralihan tugas pengaturan dan pengawasan Aset Keuangan Digital (termasuk Aset Kripto) serta Derivatif Keuangan dari **Bappebti** (Kementerian Perdagangan) ke **OJK**.

**Relevansi untuk tokenisasi:**
PP 49/2024 adalah **jembatan hukum** yang memastikan tidak ada kekosongan regulasi saat transisi. Seluruh eks-regulasi Bappebti tentang perdagangan kripto diadopsi oleh OJK melalui POJK 27/2024 dengan penyempurnaan sesuai standar jasa keuangan.

---

### 7.3 POJK No. 3 Tahun 2024 — Penyelenggaraan Inovasi Teknologi Sektor Keuangan (ITSK)

**Tanggal ditetapkan:** 16 Februari 2024
**Tanggal berlaku:** 19 Februari 2024
**Mencabut:** POJK 13/POJK.02/2018 tentang Inovasi Keuangan Digital

**Ruang lingkup:**
POJK ini mengatur **keseluruhan ekosistem ITSK** di Indonesia, termasuk:
1. **Regulatory Sandbox** — mekanisme uji coba inovasi
2. **Perizinan** — kewajiban izin bagi penyelenggara ITSK
3. **Pemantauan dan evaluasi**
4. **Edukasi keuangan dan pelindungan konsumen**
5. **Pelindungan data pribadi konsumen**
6. **Aspek kelembagaan dan penyelenggaraan ITSK**
7. **Aktivitas pihak ketiga yang menunjang ITSK**

**Definisi ITSK:**
Inovasi berbasis teknologi yang berdampak pada **produk, aktivitas, layanan, dan model bisnis** dalam ekosistem keuangan digital. Tokenisasi aset keuangan digital termasuk dalam ruang lingkup ITSK.

**Regulatory Sandbox — Mekanisme Detail:**

| Aspek | Ketentuan |
|---|---|
| **Peserta** | Lembaga Jasa Keuangan (LJK) dan/atau badan hukum lain yang berkegiatan di sektor keuangan |
| **Kriteria kelayakan** | Inovasi dalam lingkup sektor jasa keuangan; memenuhi unsur kebaruan/pembeda signifikan; memberikan manfaat dan nilai tambah; siap diuji; memerlukan dukungan uji coba |
| **Durasi uji coba** | Maksimal **1 tahun** sejak persetujuan OJK |
| **Hasil sandbox** | Lulus atau Tidak Lulus |
| **Setelah lulus** | Wajib mengajukan izin usaha dalam **6 bulan** (dapat diperpanjang) |
| **Jika tidak lulus/gagal mengajukan izin** | Wajib menghentikan operasional, menyelesaikan kewajiban kepada konsumen, menjalankan exit policy dalam **3 bulan** |

**Pelaku sandbox yang sudah berjalan untuk tokenisasi:**
- **Gold Tokenisasi** — lulus Agustus 2025
- **Government securities (SBN) Tokenisasi** — di-fragmentasi untuk aksesibilitas retail
- **Property Tokenisasi** — GORO (lulus November 2025)
- **REIT Tokenisasi** — D3 Labs / BTN / RMI

**SEOJK Pelaksana:**
- **SEOJK 5/SEOJK.07/2024** — Mekanisme Ruang Uji Coba dan Pengembangan Inovasi (berlaku 3 Juni 2024). Mengatur tata cara permohonan, verifikasi, persetujuan/penolakan, proses uji coba, laporan hasil, dan alur mekanisme sandbox.

**Relevansi untuk tokenisasi:**
POJK 3/2024 adalah **pintu masuk regulasi** bagi platform tokenisasi di Indonesia. Setiap platform yang ingin mengoperasikan layanan tokenisasi **wajib** masuk sandbox terlebih dahulu, lulus, lalu memperoleh izin usaha. Ini adalah jalur regulasi yang harus dilalui TokenForge dan kompetitor.

---

### 7.4 POJK No. 7 Tahun 2024 — Bank Perekonomian Rakyat (BPR) dan BPR Syariah

**Tanggal ditetapkan:** 30 April 2024
**Tanggal berlaku:** 30 April 2024

**Ruang lingkup:**
POJK ini mengatur aspek kelembagaan BPR/BPR Syariah mulai dari pendirian, kepemilikan, kepengurusan, jaringan kantor, penggabungan, peleburan, pengambilalihan, hingga pencabutan izin usaha.

**Kebijakan strategis yang relevan untuk tokenisasi:**

1. **Akses permodalan melalui pasar modal:** BPR/BPR Syariah kini mendapat **kesempatan untuk melakukan penawaran umum efek melalui pasar modal** (Pasal tentang persetujuan OJK untuk penambahan modal). Ini membuka pintu bagi BPR untuk menerbitkan tokenized securities sebagai instrumen permodalan.

2. **Konsolidasi wajib:** BPR/BPR Syariah dalam kepemilikan Pemegang Saham Pengendali yang sama wajib konsolidasi dalam **2 tahun** (non-Pemda) atau **3 tahun** (Pemda). Konsolidasi ini mendorong BPR untuk mencari instrumen permodalan baru — termasuk tokenisasi loan portfolio.

3. **Nomenklatur baru:** BPR kini secara resmi bernama "Bank Perekonomian Rakyat" (sebelumnya "Bank Perkreditan Rakyat"). Perubahan ini mencerminkan perluasan peran BPR dalam ekosistem keuangan yang lebih luas.

4. **Sanksi administratif:** Denda untuk pelanggaran kewajiban perizinan dan pelaporan.

**Relevansi untuk tokenisasi:**
POJK 7/2024 secara **tidak langsung** mendorong tokenisasi di sektor BPR. Dengan dibukanya akses permodalan pasar modal dan kewajiban konsolidasi, BPR membutuhkan instrumen baru untuk mengakses institucional capital. **Tokenisasi loan pool BPR menjadi use case paling konkret** — BPR dapat men-tokenize performing loan portfolio menjadi tranches (senior/mezzanine/equity) dan menjualnya ke investor institusional melalui platform tokenisasi.

Ini adalah **use case utama TokenForge** — dan POJK 7/2024 memberikan landasan regulasi yang memungkinkan BPR melakukan sekuritisasi melalui tokenisasi.

---

### 7.5 POJK No. 27 Tahun 2024 — Penyelenggaraan Perdagangan Aset Keuangan Digital Termasuk Aset Kripto

**Tanggal ditetapkan:** 10 Desember 2024
**Tanggal berlaku:** 10 Januari 2025
**Dasar hukum:** UU No. 21/2011 (sebagaimana diubah UU No. 4/2023); UU No. 4/2023

**Ruang lingkup (17 bab):**
1. Ketentuan Umum
2. Aset Keuangan Digital yang diperdagangkan di Pasar AKD
3. Kelembagaan Penyelenggara Perdagangan AKD
4. Perizinan Penyelenggara Perdagangan AKD
5. Penilaian Kemampuan dan Kepatuhan (fit-and-proper)
6. Tata Kelola
7. Penyelenggaraan Perdagangan AKD
8. Aktivitas Penunjang
9. Pelaporan
10. Pengawasan
11. Mekanisme Permohonan Persetujuan Kepada OJK
12. Pelindungan Data Pribadi
13. Pelindungan Konsumer dan Masyarakat
14. Koordinasi
15. Ketentuan lain-lain
16. Ketentuan Peralihan
17. Ketentuan Penutup

**Definisi kunci:**
- **Aset Keuangan Digital (AKD):** Aset keuangan yang disimpan atau direpresentasikan secara digital, termasuk di dalamnya aset kripto.
- **Aset Kripto:** Representasi digital nilai yang dapat disimpan dan ditransfer menggunakan DLT/blockchain. Mencakup **backed crypto-asset** (terdukung aset) dan **unbacked crypto-asset**.
- **Bursa AKD:** Badan usaha yang menyediakan sistem/sarana untuk memfasilitasi perdagangan AKD.
- **Penyelenggara Perdagangan AKD:** Bursa, Kliring, Pengelola Tempat Penyimpanan, Pedagang.

**Kriteria Aset Kripto yang bisa diperdagangkan (Pasal 8):**
1. Menggunakan **Distributed Ledger Technology (DLT)**
2. Memiliki **utilitas** dan/atau didukung aset yang memberikan manfaat ekonomi
3. Dapat **ditelusuri** secara transparan — tidak ada fitur menyembunyikan data kepemilikan/transaksi
4. Memenuhi kriteria likuiditas yang ditetapkan bursa

**Kelembagaan yang diatur:**
- **Bursa AKD** — menyediakan sistem perdagangan
- **Lembaga Kliring** — penyelesaian transaksi
- **Pengelola Tempat Penyimpanan (Kustodian)** — penyimpanan aset
- **Pedagang AKD** — intermediary perdagangan

**Persyaratan perizinan:**
- Wajib memperoleh izin dari OJK
- Fit-and-proper test untuk Pihak Utama
- Modal disetor minimum naik dari IDR 1B menjadi **IDR 5B** untuk pedagang
- Tata kelola, manajemen risiko, keamanan sistem informasi dan siber
- AML/KYC

**Relevansi untuk tokenisasi:**
POJK 27/2024 adalah **regulasi operasional utama** untuk secondary market tokenisasi di Indonesia. Setiap perdagangan tokenized assets harus melalui infrastruktur yang diatur POJK ini (Bursa AKD, Kliring, Kustodian, Pedagang berizin). Namun, POJK ini **hanya mengatur secondary market (perdagangan)** — tidak mengatur primary market (penawaran/issuance). Kekosongan ini diisi oleh Draft POJK Penawaran DFA (lihat 7.8).

---

### 7.6 POJK No. 23 Tahun 2025 — Perubahan atas POJK 27/2024

**Tanggal ditetapkan:** 31 Oktober 2025
**Tanggal berlaku:** 10 November 2025

**Ruang lingkup:**
Mengubah beberapa ketentuan POJK 27/2024, termasuk:
- Ketentuan umum
- Kriteria AKD yang diperdagangkan
- Kriteria aset kripto yang diperdagangkan
- Mekanisme penetapan AKD
- Evaluasi Daftar AKD
- Mekanisme penghentian dan penyelesaian perdagangan
- Sanksi administratif
- Kewajiban, tanggung jawab, tugas, dan kewenangan Bursa
- Kewajiban, tugas, dan kewenangan Pengelola Tempat Penyimpanan

**Relevansi untuk tokenisasi:**
POJK 23/2025 memperkuat framework POJK 27/2024 dengan penyempurnaan kriteria aset yang bisa diperdagangkan, mekanisme penghentian perdagangan (penting untuk proteksi investor), dan penegasan kewajiban Bursa dan Kustodian. Ini menunjukkan OJK secara aktif menyempurnakan regulasi berdasarkan pengalaman implementasi.

---

### 7.7 POJK No. 30 Tahun 2025 — Penerapan Tata Kelola dan Manajemen Risiko bagi Penyelenggara ITSK

**Tanggal ditetapkan:** 21 November 2025
**Tanggal berlaku:** **1 Juli 2026**
**Mencabut:** Ketentuan evaluasi mandiri, tata kelola, dan manajemen risiko dalam POJK 3/2024 (bagi penyelenggara ITSK yang telah memperoleh izin usaha)

**Ruang lingkup:**
POJK ini mengatur **tata kelola dan manajemen risiko** bagi penyelenggara ITSK yang telah memperoleh izin usaha dari OJK, termasuk:
- Pemeringkat Kredit Alternatif
- Penyelenggara Agregasi Jasa Keuangan
- Dan ke depan: penyelenggara tokenisasi

**Ketentuan utama:**

| Aspek | Ketentuan |
|---|---|
| **Struktur Direksi** | Minimal **2 anggota Direksi** |
| **Dewan Komisaris** | Jumlah dan peran disesuaikan dengan skala dan kompleksitas usaha |
| **Jenis risiko yang dikelola** | Risiko strategis, operasional, siber, hukum, kepatuhan, reputasi |
| **Manajemen risiko** | Pengawasan aktif Direksi/Komisaris, kecukupan kebijakan/prosedur, identifikasi/pengukuran/pengendalian/pemantauan risiko, dukungan sistem informasi dan pengendalian internal |
| **Pelaporan tahunan** | Laporan penerapan tata kelola yang baik |
| **Pelaporan semesteran** | Laporan profil risiko |

**Relevansi untuk tokenisasi:**
POJK 30/2025 menetapkan **standar tata kelola** yang harus dipenuhi oleh setiap penyelenggara ITSK — termasuk platform tokenisasi. Bagi TokenForge, ini berarti: minimal 2 direksi, manajemen risiko komprehensif (terutama risiko siber dan operasional), dan pelaporan berkala ke OJK. Berlaku efektif **1 Juli 2026** — memberikan waktu transisi untuk penyesuaian.

---

### 7.8 Draft POJK tentang Penawaran Aset Keuangan Digital (ICO/ITO) — September 2025

**Status:** Draft untuk konsultasi publik (19 September — 2 Oktober 2025). **Ditargetkan finalisasi 2026** (target terbaru: **Q3 2026**).

**Ruang lingkup:**
Ini adalah regulasi yang **paling langsung relevan** untuk tokenisasi karena mengatur **primary market** — penawaran tokenized assets dan crypto assets kepada publik untuk pertama kalinya. Sebelumnya, POJK 27/2024 hanya mengatur secondary market (perdagangan).

**Klasifikasi AKD yang bisa ditawarkan:**

| Kategori | Deskripsi |
|---|---|
| **Tokenized Assets (backed)** | Didukung underlying assets (properti, emas, surat berharga, dll.) |
| **Tokenized Assets (unbacked)** | Tidak didukung underlying assets |
| **Crypto Assets (currency-backed)** | Nilai terikat fiat currency yang di-reserve (stablecoin) |
| **Crypto Assets (backed)** | Didukung underlying assets selain fiat |

**Threshold perizinan:**

| Kondisi | Persyaratan |
|---|---|
| Nilai penawaran **≥ IDR 1 miliar** (~USD $59,850) | **Persetujuan OJK** diperlukan |
| Nilai penawaran **< IDR 1 miliar** | **Pemberitahuan OJK** (notifikasi) |
| **Unbacked crypto-assets ≥ IDR 1 miliar** | Persetujuan **CFX Exchange** (bukan OJK) |
| Multiple offerings dalam 1 tahun mencapai ≥ IDR 1 miliar | Dihitung kumulatif |

**Persyaratan issuer:**
- Harus **PT (Perseroan Terbatas)** berdasarkan hukum Indonesia
- Issuer tokenized assets dan backed crypto-assets wajib memiliki **izin usaha dari OJK**
- Bursa, kliring, kustodian, asset storage manager memerlukan persetujuan OJK

**Metode penawaran:**
- **Tunggal** (3-5 hari kerja) — untuk tokenized assets, backed crypto, unbacked crypto
- **Berkelanjutan** (continuous) — **hanya** untuk tokenized assets dan backed crypto

**Proses penawaran:**
1. Pengumuman penawaran publik
2. Proses pemesanan/penjualan
3. Alokasi DFA (tidak berlaku untuk continuous offering)
4. Settlement melalui lembaga kliring yang disetujui OJK (misalnya PT Kliring Komoditi Indonesia / KKI)

**Perlindungan investor:**
- Pemisahan aset klien dari aset issuer
- Dokumen yang disetujui OJK diperlukan
- Custody oleh asset custodian yang disetujui OJK

**Pengecualian (tidak perlu persetujuan OJK):**
- Capital market securities (sudah diatur UU Pasar Modal)
- Central bank-issued
- Non-transferable
- Closed-loop
- Unique NFTs
- Free offerings

**Relevansi untuk tokenisasi:**
Draft POJK ini adalah **missing link** yang selama ini tidak ada — regulasi primary market untuk tokenisasi di Indonesia. Begitu finalisasi (target Q3 2026), issuer di Indonesia akan memiliki **jalur hukum yang jelas** untuk melakukan token offering. Ini akan membuka floodgates untuk:
- Tokenisasi properti
- Tokenisasi komoditas (emas, CPO, dll.)
- Tokenisasi loan portfolio
- Tokenisasi surat berharga
- ICO/ITO untuk proyek-proyek baru

---

### 7.9 POJK No. 17 Tahun 2025 — Penawaran Efek Melalui Layanan Urun Dana Berbasis Teknologi Informasi (Securities Crowdfunding)

**Tanggal berlaku:** 25 Juli 2025

**Ruang lingkup:**
Mengatur securities crowdfunding di mana securities didefinisikan sebagai **"konvensional, digital, atau bentuk lainnya."** Ini secara eksplisit mencakup tokenized securities.

**Persyaratan:**
- Issuer harus memiliki **net assets ≤ IDR 10 miliar** (tidak termasuk tanah/bangunan)
- Dana harus digunakan untuk **proyek di Indonesia**
- Platform operator perlu **paid-up capital IDR 25 miliar**, equity IDR 5 miliar

**Relevansi untuk tokenisasi:**
POJK 17/2025 membuka jalur **crowdfunding berbasis token** untuk UMKM dan perusahaan kecil di Indonesia. TokenForge bisa menjadi infrastruktur teknologi bagi platform securities crowdfunding yang ingin menawarkan tokenized securities di bawah regulasi ini.

---

### 7.10 SEOJK No. 20/SEOJK.07/2024 — Pelaksanaan POJK 27/2024

**Tanggal ditetapkan:** 19 Desember 2024
**Tanggal berlaku:** 10 Januari 2025

**Ruang lingkup:**
Ketentuan pelaksanaan dari POJK 27/2024 yang mengatur secara teknis:
- Tata cara pemberitahuan perdagangan aset kripto
- Tata cara dan mekanisme penyampaian hasil evaluasi atas aset kripto dalam Daftar Aset Kripto
- Penilaian kemampuan dan kepatutan terhadap Pihak Utama
- Penilaian kembali terhadap Pihak Utama
- Rencana bisnis Penyelenggara Perdagangan AKD
- Cakupan, tata cara, dan mekanisme penyampaian laporan berkala dan insidental

**Relevansi untuk tokenisasi:**
SEOJK ini memberikan **detail teknis implementasi** POJK 27/2024. Platform tokenisasi yang beroperasi di Indonesia harus memenuhi seluruh ketentuan pelaporan dan prosedur yang diatur di sini.

---

### 7.11 SEOJK No. 34/SEOJK.07/2025 — Rencana Bisnis Penyelenggara Perdagangan Aset Keuangan Digital

**Tanggal ditetapkan:** 1 Desember 2025
**Dasar hukum:** POJK 27/2024 sebagaimana diubah POJK 23/2025

**Ruang lingkup:**
Mewajibkan seluruh Penyelenggara Perdagangan AKD (Bursa, Kliring, Kustodian, Pedagang) menyusun **Rencana Bisnis** yang terstruktur:
- Sasaran usaha tahunan
- Strategi pencapaian
- Proyeksi keuangan mendalam
- Khusus Pedagang: target jumlah konsumen, estimasi nilai dan volume perdagangan

**Timeline pelaporan:**
- Rencana bisnis pertama: paling lambat **30 November 2026**
- Laporan realisasi triwulanan pertama: paling lambat **15 hari kerja** setelah Q1 2027 berakhir

**Relevansi untuk tokenisasi:**
SEOJK ini memperkuat prinsip kehati-hatian dan perencanaan usaha terukur. Platform tokenisasi harus memiliki business plan yang jelas dan akuntabel — bukan sekadar teknologi, tapi model bisnis yang sustainable.

---

### 7.12 PMK No. 50 Tahun 2025 — Pajak Pertambahan Nilai dan Pajak Penghasilan atas Transaksi Perdagangan Aset Kripto

**Tanggal ditetapkan:** 25 Juli 2025
**Tanggal berlaku:** **1 Agustus 2025**
**Mencabut:** PMK 68/2022 (regulasi pajak kripto sebelumnya)

**Dasar hukum:** UU P2SK, PP 49/2024, dan berbagai UU perpajakan

**Perubahan fundamental:**
Sejak UU P2SK, aset kripto berubah status dari **komoditas** menjadi **aset keuangan yang dipersamakan dengan surat berharga**. Implikasi pajak:

| Jenis | Perlakuan |
|---|---|
| **Penyerahan aset kripto** | **TIDAK dikenai PPN** (karena dipersamakan dengan surat berharga — Pasal 4A UU PPN) |
| **Jasa platform/exchanger** | Dikenai **PPN** atas nilai lain = 11/12 × komisi/imbalan |
| **Jasa mining/verifikasi** | Dikenai **PPN** dengan besaran tertentu = 20% × 11/12 × tarif PPN × penggantian |

**Tarif PPh:**

| Kondisi | Tarif |
|---|---|
| Transaksi melalui **PPMSE Dalam Negeri** (exchanger terdaftar OJK) | **PPh Pasal 22 final: 0,21%** dari nilai transaksi |
| Transaksi melalui **PPMSE Luar Negeri** | **PPh Pasal 22: 1%** dari nilai transaksi |
| Transaksi di luar PPMSE yang belum ditunjuk | **PPh Pasal 22: 1%** dari nilai transaksi |

**Transaksi yang dikenai PPh:**
- Jual beli dengan mata uang fiat
- Tukar-menukar (swap) aset kripto dengan aset kripto lainnya
- Transaksi lainnya

**Relevansi untuk tokenisasi:**
PMK 50/2025 memberikan **kepastian pajak** yang sangat penting bagi issuer dan investor:
- **Penghapusan PPN** atas penyerahan tokenized assets (karena dipersamakan dengan surat berharga) membuat tokenisasi lebih efisien secara pajak
- **PPh final 0,21%** yang flat dan rendah memberikan kepastian biaya transaksi
- **Pungutan oleh platform** (bukan self-assessment) memudahkan kepatuhan
- Bagi tokenisasi RWA, penghapusan PPN adalah **insentif besar** — transaksi properti/emas yang biasanya dikenai PPN 11% kini bisa lebih efisien melalui tokenisasi

---

### 7.13 Peta Jalan IAKD 2024-2028 — Inovasi Teknologi Sektor Keuangan, Aset Keuangan Digital, dan Aset Kripto

**Diluncurkan:** 2024

**Visi:** Mewujudkan industri IAKD yang inovatif, berintegritas, terus berkembang, memprioritaskan inklusi keuangan dan pelindungan konsumen, berkontribusi signifikan pada pertumbuhan ekonomi nasional.

**Tiga fase:**

| Fase | Periode | Fokus |
|---|---|---|
| **Fase 1: Penguatan Fondasi** | 2024-2025 | Pengaturan dan pengawasan dasar |
| **Fase 2: Akselerasi Pengembangan** | 2026-2027 | Pengembangan dan penguatan ekosistem |
| **Fase 3: Pendalaman & Pertumbuhan** | 2027-2028 | Pendalaman pasar dan pertumbuhan berkelanjutan |

**Empat pilar strategis:**
1. **Pengaturan dan Pengembangan** — menerbitkan regulasi yang diperlukan
2. **Pengawasan dan Penegakan Hukum** — memastikan kepatuhan
3. **Perizinan dan Informasi** — mempermudah akses izin
4. **Inovasi** — mendorong pengembangan produk baru

**Tiga agenda besar industri kripto nasional (per Komisi XI DPR, Juni 2026):**
1. **Stablecoin Rupiah** — kajian melalui sandbox, koordinasi dengan Bank Indonesia
2. **Tokenisasi Real World Asset (RWA)** — aturan target Q3 2026
3. **Crypto Repo** — instrumen repo berbasis aset kripto

**Relevansi untuk tokenisasi:**
Peta Jalan IAKD memberikan **roadmap regulasi** yang jelas. TokenForge dan issuer lain bisa mengantisipasi regulasi apa yang akan datang dan mempersiapkan diri. Fase 2 (2026-2027) adalah periode akselerasi — di mana tokenisasi RWA diproyeksikan meledak.

---

### 7.14 Peran Bank Indonesia

**Kebijakan kunci:**
- **Crypto BUKAN alat pembayaran** — Rupiah adalah satu-satunya legal tender di Indonesia (UU Bank Indonesia)
- **Digital Rupiah (CBDC)** — sedang dikembangkan sebagai infrastruktur settlement digital
- Platform tokenisasi harus terintegrasi dengan **rupiah settlement infrastructure**
- Kajian **stablecoin Rupiah** melalui sandbox, harus coexist dengan Digital Rupiah

**Implikasi:**
Setiap transaksi tokenisasi di Indonesia **harus diselesaikan dalam Rupiah** atau melalui infrastruktur Digital Rupiah ketika tersedia. Ini berbeda dari pasar internasional yang menggunakan stablecoin USD (USDC, USDT) sebagai settlement.

---

### 7.15 Aspek Syariah

**Status saat ini:**
- OJK bekerja sama dengan **DSN-MUI** untuk klasifikasi crypto yang shariah-compliant
- Fatwa MUI saat ini: crypto **tidak boleh sebagai alat pembayaran**; crypto tanpa underlying **tidak boleh diperdagangkan**
- Token dengan **underlying aset riil** (RWA) dipandang memiliki **keselarasan dengan prinsip keadilan ekonomi Islam**
- Daftar shariah token **memungkinkan** untuk ditetapkan di masa depan

**Model bisnis sandbox yang sudah lulus:**
- Gold Tokenisasi — emas sebagai underlying (shariah-compliant)
- Property Tokenisasi — properti sebagai underlying
- Government securities Tokenisasi — SBN sebagai underlying

**Relevansi:**
Tokenisasi RWA memiliki **potensi besar** di Indonesia sebagai negara dengan populasi Muslim terbesar di dunia. Tokenized assets dengan underlying riil (emas, properti, komoditas halal) bisa memenuhi prinsip syariah dan membuka akses ke **pasar Islamic finance** yang bernilai triliunan rupiah.

---

### 7.16 Ringkasan Hirarki Regulasi Tokenisasi Indonesia

```
UU No. 4/2023 (UU P2SK)
├── Revisi RUU P2SK (Oktober 2025) — Pasal 215A, 216
│
├── PP 49/2024 — Peralihan Bappebti → OJK
│
├── POJK 3/2024 — ITSK & Sandbox
│   └── SEOJK 5/2024 — Mekanisme Sandbox
│
├── POJK 7/2024 — BPR/BPR Syariah (akses pasar modal)
│
├── POJK 27/2024 — Perdagangan AKD (secondary market)
│   ├── POJK 23/2025 — Perubahan POJK 27/2024
│   ├── SEOJK 20/2024 — Pelaksanaan POJK 27/2024
│   └── SEOJK 34/2025 — Rencana Bisnis
│
├── POJK 30/2025 — Tata Kelola & Manajemen Risiko ITSK (berlaku 1 Juli 2026)
│
├── POJK 17/2025 — Securities Crowdfunding (digital securities)
│
├── Draft POJK Penawaran DFA — Primary Market ICO/ITO (target Q3 2026)
│
├── PMK 50/2025 — Perpajakan (PPN dihapus, PPh 0,21% final)
│
└── Peta Jalan IAKD 2024-2028
    ├── Fase 1 (2024-2025): Fondasi
    ├── Fase 2 (2026-2027): Akselerasi ← KITA DI SINI
    └── Fase 3 (2027-2028): Pendalaman
```

---

### 7.17 Implikasi bagi Issuer dan Platform Tokenisasi

**Untuk Issuer (calon penerbit token):**

| Langkah | Regulasi Acuan | Timeline |
|---|---|---|
| 1. Masuk OJK Sandbox | POJK 3/2024 + SEOJK 5/2024 | 8-12 minggu setup |
| 2. Lulus Sandbox → Izin Usaha | POJK 3/2024 | 6 bulan setelah lulus |
| 3. Tata Kelola & Manajemen Risiko | POJK 30/2025 | Berlaku 1 Juli 2026 |
| 4. Penawaran Token (Primary Market) | Draft POJK DFA (Q3 2026) | OJK approval jika ≥ IDR 1B |
| 5. Perdagangan Token (Secondary Market) | POJK 27/2024 + POJK 23/2025 | Melalui Bursa AKD berizin |
| 6. Perpajakan | PMK 50/2025 | PPh 0,21% final, PPN dihapus |
| 7. Rencana Bisnis | SEOJK 34/2025 | Submit pertama Nov 2026 |

**Untuk BPR yang ingin tokenisasi loan portfolio:**
1. POJK 7/2024 membuka akses permodalan pasar modal
2. Tokenisasi loan pool → terbitkan tokenized securities
3. Masuk sandbox → lulus → izin usaha
4. Tawarkan ke investor melalui platform berizin
5. Perdagangan sekunder melalui Bursa AKD

**Window of Opportunity:**
- **Q3 2026:** Target finalisasi POJK Penawaran DFA — primary market regulation
- **1 Juli 2026:** POJK 30/2025 berlaku — tata kelola wajib
- **30 November 2026:** Deadline rencana bisnis pertama
- **2026-2027:** Fase Akselerasi Peta Jalan IAKD

**Issuer yang bergerak sekarang (masuk sandbox, mempersiapkan infrastruktur) akan memiliki first-mover advantage** ketika regulasi final di Q3-Q4 2026.

---

## Source Links

### Global Tokenisasi Landscape & Platforms
- RedStone — Tokenisasi & RWA Standards Report 2026: https://blog.redstone.finance/2026/03/26/Tokenisasi-rwa-report-2026/
- GlobalTokenize — How to Choose a Tokenisasi Platform (2026): https://globaltokenize.com/how-to-choose-a-Tokenisasi-platform-7-key-criteria-2026/
- Commodara — Tokenisasi Platforms Compared (2026): https://commodara.com/Tokenisasi-platforms-compared/
- ONINO — Top White-Label Tokenisasi Platforms in EU (2026): https://onino.io/blog/top-white-label-Tokenisasi-platforms-in-the-eu-(2026-guide)
- Tokensoft — Tokenisasi Platform: https://tokensoft.com/blog/Tokenisasi-platform.html
- Polymath — Capital Platform: https://polymath.network/capital-platform
- TokenizeStartup — Securitize Review 2026: https://tokenizestartup.com/platforms/securitize-review/
- TokenizeStartup — Best Tokenisasi Platforms Compared: https://tokenizestartup.com/guide/best-Tokenisasi-platforms/
- OWNR — RWA Tokenisasi Platforms Compared (2026): https://ownr.finance/resources/rwa-Tokenisasi-platforms-compared
- IntelMarketResearch — STO Platform Market Outlook 2026-2034: https://www.intelmarketresearch.com/security-token-offering-platform-market-44502

### Regulation & Policy
- Astraea Counsel — Token Launch Legal Checklist (2025): https://astraea.law/insights/token-launch-legal-checklist-sec-compliance-2025
- Pedex — Tokenisasi Regulation, Tax & Compliance Guide (2025): https://pedex.org/blog/Tokenisasi-regulation-compliance-guide
- Raetzer Law — Raising Capital with Reg D and Reg S: https://raetzerlaw.com/raising-capital-how-regulation-d-and-regulation-s-work-together-for-u-s-and-international-investors/
- Terms.Law — Cross-Border Token Offerings: https://terms.law/Trading-Legal/guides/cross-border-token-offerings.html
- Terms.Law — Fundraising Compliance Playbook: https://terms.law/Trading-Legal/guides/fundraising-compliance-playbook.html
- Wojcik Law Firm — Reg S vs Reg D: https://www.wojciklawfirm.com/reg-s-vs-reg-d-offerings-key-differences-and-considerations
- Market Edge (DLA Piper) — SEC Updates Guidance on Exempt Offerings (March 2025): https://marketedge.dlapiper.com/2025/03/exempt-offerings/
- Fensory — RWA Regulation Guide: https://fensory.com/insights/learn/regulatory-landscape-rwa
- JemHS — Token Tactician's Legal Guide to Reg S: https://jemhs.substack.com/p/the-token-tacticians-legal-guide
- ChainUp — What Is a Security Token Offering: https://www.chainup.com/blog/what-is-security-token-offering-sto/

### Private Equity Tokenisasi Prerequisites & Steps
- Starke Finance — How to Tokenize a Private Equity Fund (2026): https://starke.finance/blog/tokenize-private-equity-fund
- VCII Institute — Tokenizing Private Equity (2025): https://www.vciinstitute.com/blog/tokenizing-private-equity-the-next-leap-in-liquidity-and-global-access
- Debut Infotech — How Private Equity Tokenisasi Works: https://www.debutinfotech.com/blog/private-equity-Tokenisasi-process
- InvestaX — Private Equity Tokenisasi Explained: https://blog.investax.io/blog/private-equity-Tokenisasi-explained
- ONINO — How to Tokenize Investment Funds: https://onino.io/blog/how-to-tokenize-investment-funds
- CoinPaprika — Tokenized Private Equity (2026): https://coinpaprika.com/education/tokenized-private-equity-how-blockchain-opens-alternative-assets
- Starke Finance — How to Tokenize a Fund (2026): https://starke.finance/blog/how-to-tokenize-a-fund
- SettleMint — How to Issue an Equity Token: https://console.settlemint.com/documentation/asset-Tokenisasi-kit/user-guides/asset-issuance/issue-equity
- ChainTerms — Tokenizing VC and PE: https://www.chainterms.com/digital-assets/tokenizing-venture-capital-and-private-equity-unlocking-liquidity-illiquid-markets
- SPV.co — SPVs and Tokenisasi for PE Secondaries: https://spv.co/blog/spvs-and-Tokenisasi-for-private-equity-secondaries

### Secondary Markets & Trading
- ONINO — Secondary Markets in Tokenisasi Explained: https://onino.io/blog/blog-secondary-markets-Tokenisasi
- Greeks.live — What Are Security Token Exchanges: https://learn.greeks.live/path/what-are-security-token-exchanges-and-how-they-operate/
- GlobalTokenize — From SPV to Secondary Market: https://globaltokenize.com/from-spv-to-secondary-market-lifecycle-of-a-tokenized-asset/
- Liquid Mercury — Tokenized Securities Marketplace (2026): https://www.liquidmercury.com/resources/tokenized-securities-marketplace
- Restifi — How to Trade on Secondary Market: https://docs.resti.fi/getting-started-for-investors/how-to-trade-on-the-secondary-market
- Chaintech Network — Secondary Market Trading in STOs: https://www.chaintech.network/security-token-offerings-stos/exploring-secondary-market-trading-in-stos
- Aktionariat — Secondary Trading in Private Equity: https://www.aktionariat.com/resources/insights/secondary-trading-private-equity
- Plume — Primary Offering & Secondary Trading: https://docs.plume.org/plume/arc/primary-offering-and-secondary-trading
- Securities.io — RWA Liquidity & Market Structure (2026): https://www.securities.io/rwa-liquidity-market-structure-tokenized-assets/
- Allocations — Secondary Market Problem in PE: https://www.allocations.com/blog/the-secondary-market-problem-in-private-equity-how-Tokenisasi-is-fixing-it

### Overlooked Details, Costs, NAV
- Reuters — Asset Tokenisasi in US: Practical Guide (2026): https://www.reuters.com/practical-law-the-journal/transactional/asset-Tokenisasi-us-practical-guide-2026-05-01
- SEC — Statement on Tokenized Securities (Jan 28, 2026): https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826-statement-tokenized-securities
- Fenwick — Tokenized Securities Under the Microscope (2026): https://www.fenwick.com/insights/publications/tokenized-securities-under-the-microscope-what-companies-should-know-after-the-secs-clarification
- Lexology — SEC Guidance on Custody of Crypto Asset Securities (2025): https://www.lexology.com/library/detail.aspx?g=f6cc2cfe-46cf-44ea-aab2-1b9f9b24d51c
- Cleary Securities Watch — SEC Staff Issues Guidance on Tokenized Security Taxonomies: https://www.clearysecuritieswatch.com/2026/02/sec-staff-issues-guidance-on-tokenized-security-taxonomies/
- Market Edge (DLA Piper) — SEC Issues Guidance on Tokenized Securities (2026): https://marketedge.dlapiper.com/2026/02/sec-issues-guidance-on-tokenized-securities-and-related-developments
- Toku — Token Management for Lawyers (2026): https://www.toku.com/resources/token-management-for-lawyers
- SettleMint — How to Issue a Fund Token: https://console.settlemint.com/documentation/asset-Tokenisasi-kit/user-guides/asset-issuance/issue-fund
- Chainlink — Onchain NAV Calculation: https://chain.link/article/onchain-nav-calculation
- Tokenizer.Estate — Single Asset vs Fund Guide (2026): https://blog.tokenizer.estate/tokenized-real-estate-a-decision-framework-for-single-asset-vs-diversified-fund-Tokenisasi/
- Tokeny — Managing NAV: https://docs.tokeny.com/docs/how-to-manage-the-net-asset-value-nav
- Ondo Finance — Token & Quote Pricing: https://docs.ondo.finance/ondo-global-markets/token-and-quote-pricing
- GlobalTokenize — How to Tokenize Real Estate: https://globaltokenize.com/guides/how-to-tokenize-real-estate/
- Autheo — RWA Tokenisasi Hit $30 Billion (2026): https://www.autheo.com/blog/rwa-Tokenisasi-30-billion-reality-check
- Tokenizer.Estate — How Tokenized Property Is Valued: https://blog.tokenizer.estate/how-tokenized-property-is-valued-appraisals-nav-and-the-lag-nobody-warns-you-about/

### Indonesia Specific — Regulasi & Kebijakan
- OJK — POJK 3/2024 (ITSK): https://ojk.go.id/id/regulasi/Pages/POJK-3-2024-Penyelenggaraan-Inovasi-Teknologi-Sektor-Keuangan.aspx
- OJK — Siaran Pers POJK 3/2024: https://www.ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-Terbitkan-Aturan-Penyelenggaraan-Inovasi-Teknologi-Sektor-Keuangan-POJK-3-Tahun-2024.aspx
- OJK — POJK 7/2024 (BPR/BPR Syariah): https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-Terbitkan-Peraturan-Perkuat-Kelembagaan-BPR-BPR-Syariah.aspx
- Pasal.id — POJK 7/2024: https://pasal.id/peraturan/pojk/peraturan-ojk-no-7-tahun-2024
- OJK — POJK 27/2024 (AKD): https://ojk.go.id/id/regulasi/Pages/POJK-27-2024-AKD-AK.aspx
- OJK — Siaran Pers POJK 27/2024: https://www.ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/POJK-27-Tahun-2024-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-Termasuk-Aset-Kripto-AKD-AK.aspx
- BPK — POJK 23/2025: https://peraturan.bpk.go.id/Details/343935/peraturan-ojk-no-23-tahun-2025
- OJK — POJK 30/2025 (Tata Kelola ITSK): https://ojk.go.id/id/regulasi/Pages/POJK-Nomor-30-Tahun-2025-Penerapan-Tata-Kelola-dan-Manajemen-Risiko-Bagi-Penyelenggara-Inovasi-Teknologi-Sektor-Keuangan.aspx
- OJK — Siaran Pers POJK 30/2025: https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-Terbitkan-Aturan-Perkuat-Tata-Kelola-dan-Manajemen-Risiko-Inovasi-Teknologi-Sektor-Keuangan-Serta-Aset-Keuangan-Digital.aspx
- OJK — POJK 17/2025 (Securities Crowdfunding): https://www.ojk.go.id/id/regulasi/Documents/Pages/POJK-17-Tahun-2025-Penawaran-Efek-Melalui-Layanan-Urun-Dana-Berbasis-Teknologi-Informasi/Abstrak%20POJK%2017%20Tahun%202025%20Penawaran%20Efek%20Melalui%20Layanan%20Urun%20Dana%20Berbasis%20Teknologi%20Informasi.pdf
- OJK — SEOJK 20/SEOJK.07/2024: https://www.ojk.go.id/id/regulasi/Pages/SEOJK-20-SEOJK07-2024-Penyelenggaraan-Perdagangan-Aset-Keuangan-Digital-Termasuk-Aset-Kripto.aspx
- OJK — SEOJK 5/SEOJK.07/2024 (Mekanisme Sandbox): https://ojk.go.id/id/regulasi/Pages/Mekanisme-Ruang-Uji-Coba-dan-Pengembangan-Inovasi.aspx
- OJK — SEOJK 34/SEOJK.07/2025 (Rencana Bisnis): https://ojk.go.id/id/regulasi/Pages/SEOJK-Nomor-34-SEOJK07-2025-Rencana-Bisnis-Penyelenggara-Perdagangan-Aset-Keuangan-Digital.aspx
- OJK — Regulatory Sandbox: https://ojk.go.id/id/fungsi-utama/itsk/regulatory-sandbox/default.aspx
- OJK — Perizinan ITSK: http://www.ojk.go.id/id/Fungsi-Utama/ITSK/Perizinan-ITSK-Aset-Keuangan-Digital-Aset-Kripto/Default.aspx
- OJK — Peta Jalan IAKD 2024-2028: https://ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/ITSK/Pages/Peta-Jalan-Pengembangan-dan-Penguatan-ITSK-IAKD-2024-2028.aspx
- JDIH Kemenkeu — PMK 50/2025: https://jdih.kemenkeu.go.id/dok/pmk-50-tahun-2025
- DJP — PMK 50/2025 Babak Baru: https://www.pajak.go.id/id/artikel/pmk-502025-babak-baru-pemajakan-aset-kripto
- UU P2SK — DDTC: https://perpajakan.ddtc.co.id/sumber-hukum/peraturan-pusat/undang-undang-4-tahun-2023
- Hukumonline — POJK 30/2025 Analysis: https://www.hukumonline.com/berita/a/aturan-baru-ojk--penyelenggara-itsk-dan-aset-digital-wajib-perkuat-tata-kelola-lt698967eaebb5e/
- Lexology — POJK 3/2024 Analysis: https://www.lexology.com/library/detail.aspx?g=c9b1b715-6eeb-4f4e-9e22-37242b60aa9c
- SSEK — Draft POJK Penawaran DFA: https://www.ssek.com/blog/indonesia-issues-draft-ojk-regulation-on-digital-financial-asset-offerings/
- Mondaq — Draft POJK Penawaran DFA: https://www.mondaq.com/financial-services/1708816/indonesia-issues-draft-ojk-regulation-on-digital-financial-asset-offerings
- AHP — Indonesia's Push to Regulate DFA Offerings: https://www.ahp.id/indonesias-push-to-regulate-digital-financial-asset-offerings-a-framework-for-crypto-and-token-issuers/
- CNBC Indonesia — RUU P2SK Revisi: https://www.cnbcindonesia.com/market/20251002064516-17-672136/ruu-p2sk-atur-khusus-aset-kripto-ini-ketentuan-lengkapnya
- CNBC Indonesia — Tokenisasi RWA & Kripto Halal: https://www.cnbcindonesia.com/market/20260522212039-17-737256/ojk-godok-tokenisasi-rwa-hadirkan-kripto-halal-di-ri
- ANTARA — OJK Perkuat Tokenisasi Aset Riil Syariah: https://www.antaranews.com/berita/5450771/ojk-perkuat-tokenisasi-aset-riil-agar-bisa-penuhi-prinsip-syariah
- AKURAT — Tokenisasi RWA & Stablecoin Rupiah: https://www.akurat.co/keuangan/863460/usai-uu-p2sk-tokenisasi-rwa-dan-stablecoin-rupiah-jadi-agenda-utama-industri-kripto
- Scoot — OJK Target Aturan Tokenisasi Q3 2026: https://scoot.co.id/ojk-targetkan-aturan-tokenisasi-aset-nyata-terbit-pada-kuartal-iii-2026
- Kontan — ICO Listing Regulation: https://investasi.kontan.co.id/news/ojk-godok-aturan-listing-koin-kripto-di-indonesia-targetnya-rampung-tahun-ini
- Fortune Indonesia — Tokenisasi RWA: https://www.fortuneidn.com/market/bersiap-kembangkan-tokenisasi-rwa-sebagai-aset-keuangan-digital-00-3dhnm-5j02xv

### Indonesia Specific — Market & Players
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
- TNGlobal — GORO First in Indonesia Regulatory Sandbox: https://technode.global/2024/12/05/goro-becomes-first-participant-in-indonesias-regulatory-sandbox-for-property-Tokenisasi/
- D3 Labs — Project Wira ($88B by 2030): https://d3labs.io/blog/detail/project-wira-indonesias-asset-Tokenisasi-market-to-reach-88-billion-by-2030/
- Mondaq — Indonesia Strengthens Framework Under OJK Reg 23/2025: https://www.mondaq.com/commoditiesderivativesstock-exchanges/1734852/indonesia-strengthens-regulatory-framework-for-digital-financial-asset-trading-key-updates-under-ojk-regulation-no-23-of-2025
- SQMU — Tokenising Indonesian Property: https://sqmu.net/guide/2026/04/tokenising-indonesian-property-with-sqmus-open-source-stack/
- Tokenizer.Estate — Indonesia: https://tokenizer.estate/indonesia
- D3 Labs — Indonesia's First Property Asset Tokenisasi: https://d3labs.io/blog/detail/indonesias-first-property-asset-Tokenisasi/
- SQMU — Transforming Indonesia's Real Estate Market: https://sqmu.net/market-analysis/2025/08/indonesia-case-study-tokenising-real-estate-with-sqmu/
- Bahori Ahoen Institute — Tokenisasi in Real Estate Markets (2026): https://bahoriahoeninstitute.com/journal-Tokenisasi-real-estate-multidisciplinary-analysis/

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

*Akhir Laporan*
