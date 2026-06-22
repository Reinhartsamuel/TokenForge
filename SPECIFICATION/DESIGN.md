1. Investor Onboarding & Compliance Setup
Before any asset is created or distributed, issuers utilize Tokenforge's SSTS (Solana Security Token Standard) compliance framework to structure the regulatory rules.

The Dashboard View: The issuer dashboard features a Compliance Module where administrators set up country-specific whitelisting rules, investor caps, and jurisdictional restrictions (e.g., qualifying EU professional investors vs. retail limits).

The Investor Experience: Investors log into a white-labeled Investor Portal. Here they go through integrated KYC/AML and KYB (for corporate entities) onboarding. The system connects to automated compliance providers to verify identities and scan sanctions lists. Once verified, Tokenforge’s Identity Registry automatically issues an on-chain identity claim to the investor’s wallet, acting as an automated "passport" for future transactions.

2. Token Creation & Asset Structuring
Once the legal and compliance guardrails are set on-chain, the issuer initiates the actual tokenization process.

The Dashboard View: In the Asset/Token Management module, issuers are presented with form fields to enrich the token data. Instead of raw coding, the interface allows users to fill in fields such as Asset Name, Token Symbol, Total Supply, Fractionalization Decimals, and underlying ISIN/CUSIP numbers if applicable.

Once submitted, the platform leverages its pre-configured factory contracts to deploy the ERC-3643 smart contract onto the chosen blockchain network (such as Polygon or Ethereum) seamlessly behind the scenes.

3. Minting, Distribution, & Issuance
With the token live on the blockchain network, the issuance phase allocates the assets to eligible participants.

The Dashboard View: Under the Minting/Issuance Control Panel, authorized institutional users (often requiring multi-sig or maker-checker approvals) execute the "Mint" command. The system generates the specified volume of security tokens directly into the issuer's primary smart contract vault.

Distribution Rail: The dashboard includes an Allocation/Distribution section where issuers upload investor subscription lists or process primary market subscriptions. The system cross-references the destination wallets with the on-chain Identity Registry. If an investor's wallet is approved, the transfer executes instantly. If someone tries to distribute tokens to a wallet that hasn't cleared EU onboarding, the smart contract blocks the transfer at the protocol level, displaying a "Transfer Rejected" alert on the dashboard.

4. Reporting, Cap Table Management, & Auditing
Post-issuance servicing handles day-to-day operations and provides absolute transparency for regulators and fund administrators.

The Dashboard View: The Cap Table Management screen gives a real-time, aggregated overview of all token holders, their wallet addresses, jurisdictions, and precise ownership percentages. Because every movement is written to a public or permissioned blockchain ledger, there is no manual reconciliation required.

Report Auditing: Through the Analytics and Reporting tab, issuers and auditors can generate immutable audit trails. From this portal, users export historical transaction reports, compliance event logs (including blocked transfer attempts), and proof-of-holding data. Financial auditors can cross-verify the data on the Tokenforge dashboard directly against blockchain explorers, utilizing the public ledger as a single, tamper-proof source of truth.