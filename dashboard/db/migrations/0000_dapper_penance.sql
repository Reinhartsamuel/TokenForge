CREATE TABLE "distribution_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"distribution_id" uuid NOT NULL,
	"claimant_address" varchar(44) NOT NULL,
	"amount" numeric(30, 9) NOT NULL,
	"leaf_index" integer,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"signature" varchar(88),
	"claimed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid,
	"escrow_ata" varchar(44),
	"merkle_root" varchar(66) NOT NULL,
	"action_id" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"total_claimed" numeric(30, 9) DEFAULT '0',
	"total_claimants" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "famp_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid,
	"policy_address" varchar(44),
	"allowlist_mode" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "famp_policies_token_id_unique" UNIQUE("token_id"),
	CONSTRAINT "famp_policies_policy_address_unique" UNIQUE("policy_address")
);
--> statement-breakpoint
CREATE TABLE "famp_policy_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" uuid NOT NULL,
	"wallet_address" varchar(44) NOT NULL,
	"list_type" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mint_address" varchar(44) NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"decimals" integer DEFAULT 6 NOT NULL,
	"uri" text,
	"description" text,
	"image_url" text,
	"mint_authority_pda" varchar(44),
	"freeze_authority_pda" varchar(44),
	"verification_config_pda" varchar(44),
	"creator_address" varchar(44) NOT NULL,
	"network" varchar(10) DEFAULT 'devnet' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_mint_address_unique" UNIQUE("mint_address")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid,
	"signature" varchar(88) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(20) NOT NULL,
	"from_address" varchar(44),
	"to_address" varchar(44),
	"amount" numeric(30, 9),
	"metadata" jsonb,
	"explorer_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "distribution_claims" ADD CONSTRAINT "distribution_claims_distribution_id_distributions_id_fk" FOREIGN KEY ("distribution_id") REFERENCES "public"."distributions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "famp_policies" ADD CONSTRAINT "famp_policies_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "famp_policy_entries" ADD CONSTRAINT "famp_policy_entries_policy_id_famp_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."famp_policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;