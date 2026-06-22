CREATE TABLE "compliance_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid NOT NULL,
	"rule_type" varchar(50) NOT NULL,
	"rule_config" jsonb NOT NULL,
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corporate_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'pending',
	"execution_date" timestamp,
	"snapshot_date" timestamp,
	"total_amount" numeric(30, 9),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investor_holdings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investor_id" uuid NOT NULL,
	"token_id" uuid NOT NULL,
	"token_account_address" varchar(44),
	"balance" numeric(30, 9) DEFAULT '0',
	"ownership_percentage" numeric(5, 4),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "investor_holdings_token_account_address_unique" UNIQUE("token_account_address")
);
--> statement-breakpoint
CREATE TABLE "investors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" varchar(44),
	"name" varchar(255),
	"email" varchar(255),
	"entity_type" varchar(50),
	"jurisdiction" varchar(10),
	"kyc_status" varchar(20) DEFAULT 'pending',
	"accreditation_status" varchar(20),
	"accreditation_expiry" timestamp,
	"aml_status" varchar(20) DEFAULT 'pending',
	"pep_status" boolean DEFAULT false,
	"sanctions_status" varchar(20) DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "investors_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "nav_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid NOT NULL,
	"nav_per_token" numeric(30, 9) NOT NULL,
	"total_assets" numeric(30, 9),
	"total_liabilities" numeric(30, 9),
	"outstanding_tokens" numeric(30, 9),
	"valuation_date" timestamp NOT NULL,
	"source" varchar(50),
	"verified_by" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tranches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spv_token_id" uuid NOT NULL,
	"tranche_token_id" uuid,
	"tranche_type" varchar(20) NOT NULL,
	"priority" integer NOT NULL,
	"target_allocation" numeric(5, 4),
	"coupon_rate" numeric(5, 4),
	"min_subscription" numeric(30, 9),
	"max_subscription" numeric(30, 9),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "compliance_rules" ADD CONSTRAINT "compliance_rules_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corporate_actions" ADD CONSTRAINT "corporate_actions_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_holdings" ADD CONSTRAINT "investor_holdings_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_holdings" ADD CONSTRAINT "investor_holdings_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_records" ADD CONSTRAINT "nav_records_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tranches" ADD CONSTRAINT "tranches_spv_token_id_tokens_id_fk" FOREIGN KEY ("spv_token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tranches" ADD CONSTRAINT "tranches_tranche_token_id_tokens_id_fk" FOREIGN KEY ("tranche_token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;