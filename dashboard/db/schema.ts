import { pgTable, uuid, varchar, integer, text, boolean, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tokens = pgTable("tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  mintAddress: varchar("mint_address", { length: 44 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  symbol: varchar("symbol", { length: 10 }).notNull(),
  decimals: integer("decimals").default(6).notNull(),
  uri: text("uri"),
  description: text("description"),
  imageUrl: text("image_url"),
  mintAuthorityPda: varchar("mint_authority_pda", { length: 44 }),
  freezeAuthorityPda: varchar("freeze_authority_pda", { length: 44 }),
  verificationConfigPda: varchar("verification_config_pda", { length: 44 }),
  creatorAddress: varchar("creator_address", { length: 44 }).notNull(),
  network: varchar("network", { length: 10 }).default("devnet").notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").references(() => tokens.id),
  signature: varchar("signature", { length: 88 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  fromAddress: varchar("from_address", { length: 44 }),
  toAddress: varchar("to_address", { length: 44 }),
  amount: numeric("amount", { precision: 30, scale: 9 }),
  metadata: jsonb("metadata"),
  explorerUrl: text("explorer_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fampPolicies = pgTable("famp_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").unique().references(() => tokens.id),
  policyAddress: varchar("policy_address", { length: 44 }).unique(),
  allowlistMode: boolean("allowlist_mode").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fampPolicyEntries = pgTable("famp_policy_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  policyId: uuid("policy_id").references(() => fampPolicies.id).notNull(),
  walletAddress: varchar("wallet_address", { length: 44 }).notNull(),
  listType: varchar("list_type", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const distributions = pgTable("distributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").references(() => tokens.id),
  escrowAta: varchar("escrow_ata", { length: 44 }),
  merkleRoot: varchar("merkle_root", { length: 66 }).notNull(),
  actionId: integer("action_id").default(0).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  totalClaimed: numeric("total_claimed", { precision: 30, scale: 9 }).default("0"),
  totalClaimants: integer("total_claimants").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const distributionClaims = pgTable("distribution_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  distributionId: uuid("distribution_id").references(() => distributions.id).notNull(),
  claimantAddress: varchar("claimant_address", { length: 44 }).notNull(),
  amount: numeric("amount", { precision: 30, scale: 9 }).notNull(),
  leafIndex: integer("leaf_index"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  signature: varchar("signature", { length: 88 }),
  claimedAt: timestamp("claimed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tokensRelations = relations(tokens, ({ many }) => ({
  transactions: many(transactions),
  fampPolicy: many(fampPolicies),
  distributions: many(distributions),
  holdings: many(investorHoldings),
  corporateActions: many(corporateActions),
  navRecords: many(navRecords),
  tranches: many(tranches),
  complianceRules: many(complianceRules),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  token: one(tokens, {
    fields: [transactions.tokenId],
    references: [tokens.id],
  }),
}));

export const fampPoliciesRelations = relations(fampPolicies, ({ one, many }) => ({
  token: one(tokens, {
    fields: [fampPolicies.tokenId],
    references: [tokens.id],
  }),
  entries: many(fampPolicyEntries),
}));

export const fampPolicyEntriesRelations = relations(fampPolicyEntries, ({ one }) => ({
  policy: one(fampPolicies, {
    fields: [fampPolicyEntries.policyId],
    references: [fampPolicies.id],
  }),
}));

export const distributionsRelations = relations(distributions, ({ one, many }) => ({
  token: one(tokens, {
    fields: [distributions.tokenId],
    references: [tokens.id],
  }),
  claims: many(distributionClaims),
}));

export const distributionClaimsRelations = relations(distributionClaims, ({ one }) => ({
  distribution: one(distributions, {
    fields: [distributionClaims.distributionId],
    references: [distributions.id],
  }),
}));

export const investors = pgTable("investors", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: varchar("wallet_address", { length: 44 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  entityType: varchar("entity_type", { length: 50 }),
  jurisdiction: varchar("jurisdiction", { length: 10 }),
  kycStatus: varchar("kyc_status", { length: 20 }).default("pending"),
  accreditationStatus: varchar("accreditation_status", { length: 20 }),
  accreditationExpiry: timestamp("accreditation_expiry"),
  amlStatus: varchar("aml_status", { length: 20 }).default("pending"),
  pepStatus: boolean("pep_status").default(false),
  sanctionsStatus: varchar("sanctions_status", { length: 20 }).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const investorHoldings = pgTable("investor_holdings", {
  id: uuid("id").primaryKey().defaultRandom(),
  investorId: uuid("investor_id").references(() => investors.id).notNull(),
  tokenId: uuid("token_id").references(() => tokens.id).notNull(),
  tokenAccountAddress: varchar("token_account_address", { length: 44 }).unique(),
  balance: numeric("balance", { precision: 30, scale: 9 }).default("0"),
  ownershipPercentage: numeric("ownership_percentage", { precision: 5, scale: 4 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const corporateActions = pgTable("corporate_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").references(() => tokens.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("pending"),
  executionDate: timestamp("execution_date"),
  snapshotDate: timestamp("snapshot_date"),
  totalAmount: numeric("total_amount", { precision: 30, scale: 9 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const navRecords = pgTable("nav_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").references(() => tokens.id).notNull(),
  navPerToken: numeric("nav_per_token", { precision: 30, scale: 9 }).notNull(),
  totalAssets: numeric("total_assets", { precision: 30, scale: 9 }),
  totalLiabilities: numeric("total_liabilities", { precision: 30, scale: 9 }),
  outstandingTokens: numeric("outstanding_tokens", { precision: 30, scale: 9 }),
  valuationDate: timestamp("valuation_date").notNull(),
  source: varchar("source", { length: 50 }),
  verifiedBy: varchar("verified_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tranches = pgTable("tranches", {
  id: uuid("id").primaryKey().defaultRandom(),
  spvTokenId: uuid("spv_token_id").references(() => tokens.id).notNull(),
  trancheTokenId: uuid("tranche_token_id").references(() => tokens.id),
  trancheType: varchar("tranche_type", { length: 20 }).notNull(),
  priority: integer("priority").notNull(),
  targetAllocation: numeric("target_allocation", { precision: 5, scale: 4 }),
  couponRate: numeric("coupon_rate", { precision: 5, scale: 4 }),
  minSubscription: numeric("min_subscription", { precision: 30, scale: 9 }),
  maxSubscription: numeric("max_subscription", { precision: 30, scale: 9 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const complianceRules = pgTable("compliance_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").references(() => tokens.id).notNull(),
  ruleType: varchar("rule_type", { length: 50 }).notNull(),
  ruleConfig: jsonb("rule_config").notNull(),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const investorsRelations = relations(investors, ({ many }) => ({
  holdings: many(investorHoldings),
}));

export const investorHoldingsRelations = relations(investorHoldings, ({ one }) => ({
  investor: one(investors, {
    fields: [investorHoldings.investorId],
    references: [investors.id],
  }),
  token: one(tokens, {
    fields: [investorHoldings.tokenId],
    references: [tokens.id],
  }),
}));

export const corporateActionsRelations = relations(corporateActions, ({ one }) => ({
  token: one(tokens, {
    fields: [corporateActions.tokenId],
    references: [tokens.id],
  }),
}));

export const navRecordsRelations = relations(navRecords, ({ one }) => ({
  token: one(tokens, {
    fields: [navRecords.tokenId],
    references: [tokens.id],
  }),
}));

export const tranchesRelations = relations(tranches, ({ one }) => ({
  spvToken: one(tokens, {
    fields: [tranches.spvTokenId],
    references: [tokens.id],
  }),
  trancheToken: one(tokens, {
    fields: [tranches.trancheTokenId],
    references: [tokens.id],
  }),
}));

export const complianceRulesRelations = relations(complianceRules, ({ one }) => ({
  token: one(tokens, {
    fields: [complianceRules.tokenId],
    references: [tokens.id],
  }),
}));
