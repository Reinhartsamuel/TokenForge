"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CANONICAL_COMMIT: () => CANONICAL_COMMIT,
  CANONICAL_IDL_VERSION: () => CANONICAL_IDL_VERSION,
  FAMP_PROGRAM_ID: () => FAMP_PROGRAM_ID,
  FampError: () => FampError,
  INSTRUCTIONS_SYSVAR_ID: () => INSTRUCTIONS_SYSVAR_ID,
  NOOP_VERIFICATION_PROGRAM_ID: () => NOOP_VERIFICATION_PROGRAM_ID,
  RENT_SYSVAR_ID: () => RENT_SYSVAR_ID,
  SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS: () => SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS,
  SSTS_PROGRAM_ID: () => SSTS_PROGRAM_ID,
  SYSTEM_PROGRAM_ID: () => SYSTEM_PROGRAM_ID,
  SstsError: () => SstsError,
  SstsInstruction: () => SstsInstruction,
  TOKEN_2022_PROGRAM_ID: () => TOKEN_2022_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID: () => TRANSFER_HOOK_PROGRAM_ID,
  TokenForgeError: () => TokenForgeError,
  addToAllowlist: () => addToAllowlist,
  addToBlocklist: () => addToBlocklist,
  assert: () => assert,
  batchInstructions: () => batchInstructions,
  buildTransaction: () => buildTransaction,
  claimDistribution: () => claimDistribution,
  configureVerification: () => configureVerification,
  createAssociatedTokenAccountInstruction: () => createAssociatedTokenAccountInstruction,
  createDistribution: () => createDistribution,
  createFampPolicy: () => createFampPolicy,
  createSecurityToken: () => createSecurityToken,
  deriveAllTokenPdas: () => deriveAllTokenPdas,
  deriveFampPolicyPda: () => deriveFampPolicyPda,
  deriveMintAuthorityPda: () => deriveMintAuthorityPda,
  deriveProofAccountPda: () => deriveProofAccountPda,
  deriveRateAccountPda: () => deriveRateAccountPda,
  deriveVerificationConfigPda: () => deriveVerificationConfigPda,
  enrichError: () => enrichError,
  executeConvert: () => executeConvert,
  executeSplit: () => executeSplit,
  freezeAccount: () => freezeAccount,
  getClaimDistributionInstruction: () => getClaimDistributionInstruction,
  getConvertInstruction: () => getConvertInstruction,
  getCreateDistributionEscrowInstruction: () => getCreateDistributionEscrowInstruction,
  getCreateProofAccountInstruction: () => getCreateProofAccountInstruction,
  getFreezeInstruction: () => getFreezeInstruction,
  getInitializeMintInstruction: () => getInitializeMintInstruction,
  getInitializeVerificationConfigInstruction: () => getInitializeVerificationConfigInstruction,
  getMintInstruction: () => getMintInstruction,
  getPauseInstruction: () => getPauseInstruction,
  getResumeInstruction: () => getResumeInstruction,
  getSplitInstruction: () => getSplitInstruction,
  getThawInstruction: () => getThawInstruction,
  getTransferInstruction: () => getTransferInstruction,
  mintTokens: () => mintTokens,
  pauseToken: () => pauseToken,
  removeFromAllowlist: () => removeFromAllowlist,
  removeFromBlocklist: () => removeFromBlocklist,
  resumeToken: () => resumeToken,
  sendSstsTransaction: () => sendSstsTransaction,
  thawAccount: () => thawAccount,
  transferTokens: () => transferTokens
});
module.exports = __toCommonJS(index_exports);

// src/utils/constants.ts
var SSTS_PROGRAM_ID = "SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap";
var TRANSFER_HOOK_PROGRAM_ID = "HookXqLKgPaNrHBJ9Jui7oQZz93vMbtA88JjsLa8bmfL";
var FAMP_PROGRAM_ID = "99frBpGJFhSx1qMt64T8HSfZMLUiy5YhZVmnG7X4pk2K";
var NOOP_VERIFICATION_PROGRAM_ID = "5gPMypQiHYVmx3jFJAGr72wrB7f1bgmud3mHtpHUGyLd";
var TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
var SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
var RENT_SYSVAR_ID = "SysvarRent111111111111111111111111111111111";
var INSTRUCTIONS_SYSVAR_ID = "Sysvar1nstructions1111111111111111111111111";
var CANONICAL_COMMIT = "1ab607e";
var CANONICAL_IDL_VERSION = "0.1.0";
var SstsInstruction = /* @__PURE__ */ ((SstsInstruction2) => {
  SstsInstruction2[SstsInstruction2["InitializeMint"] = 0] = "InitializeMint";
  SstsInstruction2[SstsInstruction2["UpdateMetadata"] = 1] = "UpdateMetadata";
  SstsInstruction2[SstsInstruction2["InitializeVerificationConfig"] = 2] = "InitializeVerificationConfig";
  SstsInstruction2[SstsInstruction2["UpdateVerificationConfig"] = 3] = "UpdateVerificationConfig";
  SstsInstruction2[SstsInstruction2["TrimVerificationConfig"] = 4] = "TrimVerificationConfig";
  SstsInstruction2[SstsInstruction2["Verify"] = 5] = "Verify";
  SstsInstruction2[SstsInstruction2["Mint"] = 6] = "Mint";
  SstsInstruction2[SstsInstruction2["Burn"] = 7] = "Burn";
  SstsInstruction2[SstsInstruction2["Pause"] = 8] = "Pause";
  SstsInstruction2[SstsInstruction2["Resume"] = 9] = "Resume";
  SstsInstruction2[SstsInstruction2["Freeze"] = 10] = "Freeze";
  SstsInstruction2[SstsInstruction2["Thaw"] = 11] = "Thaw";
  SstsInstruction2[SstsInstruction2["Transfer"] = 12] = "Transfer";
  SstsInstruction2[SstsInstruction2["CreateRateAccount"] = 13] = "CreateRateAccount";
  SstsInstruction2[SstsInstruction2["UpdateRateAccount"] = 14] = "UpdateRateAccount";
  SstsInstruction2[SstsInstruction2["CloseRateAccount"] = 15] = "CloseRateAccount";
  SstsInstruction2[SstsInstruction2["Split"] = 16] = "Split";
  SstsInstruction2[SstsInstruction2["Convert"] = 17] = "Convert";
  SstsInstruction2[SstsInstruction2["CreateProofAccount"] = 18] = "CreateProofAccount";
  SstsInstruction2[SstsInstruction2["UpdateProofAccount"] = 19] = "UpdateProofAccount";
  SstsInstruction2[SstsInstruction2["CreateDistributionEscrow"] = 20] = "CreateDistributionEscrow";
  SstsInstruction2[SstsInstruction2["ClaimDistribution"] = 21] = "ClaimDistribution";
  SstsInstruction2[SstsInstruction2["CloseActionReceiptAccount"] = 22] = "CloseActionReceiptAccount";
  SstsInstruction2[SstsInstruction2["CloseClaimReceiptAccount"] = 23] = "CloseClaimReceiptAccount";
  return SstsInstruction2;
})(SstsInstruction || {});

// ../lib/canonical-ssts/clients/typescript/src/generated/programs/securityTokenProgram.ts
var import_kit = require("@solana/kit");
var SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS = "SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap";

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeMint.ts
var import_kit26 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/shared/index.ts
var import_kit2 = require("@solana/kit");
function expectAddress(value) {
  if (!value) {
    throw new Error("Expected a Address.");
  }
  if (typeof value === "object" && "address" in value) {
    return value.address;
  }
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
function getAccountMetaFactory(programAddress, optionalAccountStrategy) {
  return (account) => {
    if (!account.value) {
      if (optionalAccountStrategy === "omitted") return;
      return Object.freeze({
        address: programAddress,
        role: import_kit2.AccountRole.READONLY
      });
    }
    const writableRole = account.isWritable ? import_kit2.AccountRole.WRITABLE : import_kit2.AccountRole.READONLY;
    return Object.freeze({
      address: expectAddress(account.value),
      role: isTransactionSigner(account.value) ? (0, import_kit2.upgradeRoleToSigner)(writableRole) : writableRole,
      ...isTransactionSigner(account.value) ? { signer: account.value } : {}
    });
  };
}
function isTransactionSigner(value) {
  return !!value && typeof value === "object" && "address" in value && (0, import_kit2.isTransactionSigner)(value);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/claimDistributionArgs.ts
var import_kit3 = require("@solana/kit");
function getClaimDistributionArgsEncoder() {
  return (0, import_kit3.getStructEncoder)([
    ["actionId", (0, import_kit3.getU64Encoder)()],
    ["amount", (0, import_kit3.getU64Encoder)()],
    ["merkleRoot", (0, import_kit3.fixEncoderSize)((0, import_kit3.getBytesEncoder)(), 32)],
    ["leafIndex", (0, import_kit3.getU32Encoder)()],
    [
      "merkleProof",
      (0, import_kit3.getOptionEncoder)((0, import_kit3.getArrayEncoder)((0, import_kit3.fixEncoderSize)((0, import_kit3.getBytesEncoder)(), 32)))
    ]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/closeActionReceiptArgs.ts
var import_kit4 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/closeClaimReceiptArgs.ts
var import_kit5 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/closeRateArgs.ts
var import_kit6 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/convertArgs.ts
var import_kit7 = require("@solana/kit");
function getConvertArgsEncoder() {
  return (0, import_kit7.getStructEncoder)([
    ["actionId", (0, import_kit7.getU64Encoder)()],
    ["amountToConvert", (0, import_kit7.getU64Encoder)()]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/createDistributionEscrowArgs.ts
var import_kit8 = require("@solana/kit");
function getCreateDistributionEscrowArgsEncoder() {
  return (0, import_kit8.getStructEncoder)([
    ["actionId", (0, import_kit8.getU64Encoder)()],
    ["merkleRoot", (0, import_kit8.fixEncoderSize)((0, import_kit8.getBytesEncoder)(), 32)]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/createProofArgs.ts
var import_kit9 = require("@solana/kit");
function getCreateProofArgsEncoder() {
  return (0, import_kit9.getStructEncoder)([
    ["actionId", (0, import_kit9.getU64Encoder)()],
    ["data", (0, import_kit9.getArrayEncoder)((0, import_kit9.fixEncoderSize)((0, import_kit9.getBytesEncoder)(), 32))]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/createRateArgs.ts
var import_kit10 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/initializeMintArgs.ts
var import_kit11 = require("@solana/kit");
function getInitializeMintArgsEncoder() {
  return (0, import_kit11.getStructEncoder)([
    ["ixMint", getMintArgsEncoder()],
    ["ixMetadataPointer", (0, import_kit11.getOptionEncoder)(getMetadataPointerArgsEncoder())],
    ["ixMetadata", (0, import_kit11.getOptionEncoder)(getTokenMetadataArgsEncoder())],
    [
      "ixScaledUiAmount",
      (0, import_kit11.getOptionEncoder)(getScaledUiAmountConfigArgsEncoder())
    ]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/initializeVerificationConfigArgs.ts
var import_kit12 = require("@solana/kit");
function getInitializeVerificationConfigArgsEncoder() {
  return (0, import_kit12.getStructEncoder)([
    ["instructionDiscriminator", (0, import_kit12.getU8Encoder)()],
    ["cpiMode", (0, import_kit12.getBooleanEncoder)()],
    ["programAddresses", (0, import_kit12.getArrayEncoder)((0, import_kit12.getAddressEncoder)())]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/metadataPointerArgs.ts
var import_kit13 = require("@solana/kit");
function getMetadataPointerArgsEncoder() {
  return (0, import_kit13.getStructEncoder)([
    ["authority", (0, import_kit13.getAddressEncoder)()],
    ["metadataAddress", (0, import_kit13.getAddressEncoder)()]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/mintArgs.ts
var import_kit14 = require("@solana/kit");
function getMintArgsEncoder() {
  return (0, import_kit14.getStructEncoder)([
    ["decimals", (0, import_kit14.getU8Encoder)()],
    ["mintAuthority", (0, import_kit14.getAddressEncoder)()],
    ["freezeAuthority", (0, import_kit14.getAddressEncoder)()]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/rateConfig.ts
var import_kit15 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/rounding.ts
var import_kit16 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/scaledUiAmountConfigArgs.ts
var import_kit17 = require("@solana/kit");
function getScaledUiAmountConfigArgsEncoder() {
  return (0, import_kit17.getStructEncoder)([
    ["authority", (0, import_kit17.getAddressEncoder)()],
    ["multiplier", (0, import_kit17.fixEncoderSize)((0, import_kit17.getBytesEncoder)(), 8)],
    ["newMultiplierEffectiveTimestamp", (0, import_kit17.getI64Encoder)()],
    ["newMultiplier", (0, import_kit17.fixEncoderSize)((0, import_kit17.getBytesEncoder)(), 8)]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/splitArgs.ts
var import_kit18 = require("@solana/kit");
function getSplitArgsEncoder() {
  return (0, import_kit18.getStructEncoder)([["actionId", (0, import_kit18.getU64Encoder)()]]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/tokenMetadataArgs.ts
var import_kit19 = require("@solana/kit");
function getTokenMetadataArgsEncoder() {
  return (0, import_kit19.getStructEncoder)([
    ["name", (0, import_kit19.addEncoderSizePrefix)((0, import_kit19.getUtf8Encoder)(), (0, import_kit19.getU32Encoder)())],
    ["symbol", (0, import_kit19.addEncoderSizePrefix)((0, import_kit19.getUtf8Encoder)(), (0, import_kit19.getU32Encoder)())],
    ["uri", (0, import_kit19.addEncoderSizePrefix)((0, import_kit19.getUtf8Encoder)(), (0, import_kit19.getU32Encoder)())],
    [
      "additionalMetadata",
      (0, import_kit19.addEncoderSizePrefix)((0, import_kit19.getBytesEncoder)(), (0, import_kit19.getU32Encoder)())
    ]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/trimVerificationConfigArgs.ts
var import_kit20 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateMetadataArgs.ts
var import_kit21 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateProofArgs.ts
var import_kit22 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateRateArgs.ts
var import_kit23 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateVerificationConfigArgs.ts
var import_kit24 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/types/verifyArgs.ts
var import_kit25 = require("@solana/kit");

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeMint.ts
var INITIALIZE_MINT_DISCRIMINATOR = 0;
function getInitializeMintInstructionDataEncoder() {
  return (0, import_kit26.transformEncoder)(
    (0, import_kit26.getStructEncoder)([
      ["discriminator", (0, import_kit26.getU8Encoder)()],
      ["initializeMintArgs", getInitializeMintArgsEncoder()]
    ]),
    (value) => ({ ...value, discriminator: INITIALIZE_MINT_DISCRIMINATOR })
  );
}
function getInitializeMintInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: true },
    authority: { value: input.authority ?? null, isWritable: true },
    payer: { value: input.payer ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    rentSysvar: { value: input.rentSysvar ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  if (!accounts.rentSysvar.value) {
    accounts.rentSysvar.value = "SysvarRent111111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.authority),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.systemProgram),
      getAccountMeta(accounts.rentSysvar)
    ],
    data: getInitializeMintInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeVerificationConfig.ts
var import_kit27 = require("@solana/kit");
var INITIALIZE_VERIFICATION_CONFIG_DISCRIMINATOR = 2;
function getInitializeVerificationConfigInstructionDataEncoder() {
  return (0, import_kit27.transformEncoder)(
    (0, import_kit27.getStructEncoder)([
      ["discriminator", (0, import_kit27.getU8Encoder)()],
      [
        "initializeVerificationConfigArgs",
        getInitializeVerificationConfigArgsEncoder()
      ]
    ]),
    (value) => ({
      ...value,
      discriminator: INITIALIZE_VERIFICATION_CONFIG_DISCRIMINATOR
    })
  );
}
function getInitializeVerificationConfigInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfigOrMintAuthority: {
      value: input.verificationConfigOrMintAuthority ?? null,
      isWritable: false
    },
    instructionsSysvarOrCreator: {
      value: input.instructionsSysvarOrCreator ?? null,
      isWritable: false
    },
    payer: { value: input.payer ?? null, isWritable: true },
    mintAccount: { value: input.mintAccount ?? null, isWritable: false },
    configAccount: { value: input.configAccount ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    accountMetasPda: { value: input.accountMetasPda ?? null, isWritable: true },
    transferHookPda: {
      value: input.transferHookPda ?? null,
      isWritable: false
    },
    transferHookProgram: {
      value: input.transferHookProgram ?? null,
      isWritable: false
    }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfigOrMintAuthority),
      getAccountMeta(accounts.instructionsSysvarOrCreator),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.configAccount),
      getAccountMeta(accounts.systemProgram),
      getAccountMeta(accounts.accountMetasPda),
      getAccountMeta(accounts.transferHookPda),
      getAccountMeta(accounts.transferHookProgram)
    ],
    data: getInitializeVerificationConfigInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/mint.ts
var import_kit28 = require("@solana/kit");
var MINT_DISCRIMINATOR = 6;
function getMintInstructionDataEncoder() {
  return (0, import_kit28.transformEncoder)(
    (0, import_kit28.getStructEncoder)([
      ["discriminator", (0, import_kit28.getU8Encoder)()],
      ["amount", (0, import_kit28.getU64Encoder)()]
    ]),
    (value) => ({ ...value, discriminator: MINT_DISCRIMINATOR })
  );
}
function getMintInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    mintAuthority: { value: input.mintAuthority ?? null, isWritable: false },
    mintAccount: { value: input.mintAccount ?? null, isWritable: true },
    destination: { value: input.destination ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.mintAuthority),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.destination),
      getAccountMeta(accounts.tokenProgram)
    ],
    data: getMintInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/transfer.ts
var import_kit29 = require("@solana/kit");
var TRANSFER_DISCRIMINATOR = 12;
function getTransferInstructionDataEncoder() {
  return (0, import_kit29.transformEncoder)(
    (0, import_kit29.getStructEncoder)([
      ["discriminator", (0, import_kit29.getU8Encoder)()],
      ["amount", (0, import_kit29.getU64Encoder)()]
    ]),
    (value) => ({ ...value, discriminator: TRANSFER_DISCRIMINATOR })
  );
}
function getTransferInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    permanentDelegateAuthority: {
      value: input.permanentDelegateAuthority ?? null,
      isWritable: false
    },
    mintAccount: { value: input.mintAccount ?? null, isWritable: false },
    fromTokenAccount: {
      value: input.fromTokenAccount ?? null,
      isWritable: true
    },
    toTokenAccount: { value: input.toTokenAccount ?? null, isWritable: true },
    transferHookProgram: {
      value: input.transferHookProgram ?? null,
      isWritable: false
    },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.permanentDelegateAuthority),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.fromTokenAccount),
      getAccountMeta(accounts.toTokenAccount),
      getAccountMeta(accounts.transferHookProgram),
      getAccountMeta(accounts.tokenProgram)
    ],
    data: getTransferInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/pause.ts
var import_kit30 = require("@solana/kit");
var PAUSE_DISCRIMINATOR = 8;
function getPauseInstructionDataEncoder() {
  return (0, import_kit30.transformEncoder)(
    (0, import_kit30.getStructEncoder)([["discriminator", (0, import_kit30.getU8Encoder)()]]),
    (value) => ({ ...value, discriminator: PAUSE_DISCRIMINATOR })
  );
}
function getPauseInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    pauseAuthority: { value: input.pauseAuthority ?? null, isWritable: false },
    mintAccount: { value: input.mintAccount ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.pauseAuthority),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.tokenProgram)
    ],
    data: getPauseInstructionDataEncoder().encode({}),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/resume.ts
var import_kit31 = require("@solana/kit");
var RESUME_DISCRIMINATOR = 9;
function getResumeInstructionDataEncoder() {
  return (0, import_kit31.transformEncoder)(
    (0, import_kit31.getStructEncoder)([["discriminator", (0, import_kit31.getU8Encoder)()]]),
    (value) => ({ ...value, discriminator: RESUME_DISCRIMINATOR })
  );
}
function getResumeInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    pauseAuthority: { value: input.pauseAuthority ?? null, isWritable: false },
    mintAccount: { value: input.mintAccount ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.pauseAuthority),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.tokenProgram)
    ],
    data: getResumeInstructionDataEncoder().encode({}),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/freeze.ts
var import_kit32 = require("@solana/kit");
var FREEZE_DISCRIMINATOR = 10;
function getFreezeInstructionDataEncoder() {
  return (0, import_kit32.transformEncoder)(
    (0, import_kit32.getStructEncoder)([["discriminator", (0, import_kit32.getU8Encoder)()]]),
    (value) => ({ ...value, discriminator: FREEZE_DISCRIMINATOR })
  );
}
function getFreezeInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    freezeAuthority: {
      value: input.freezeAuthority ?? null,
      isWritable: false
    },
    mintAccount: { value: input.mintAccount ?? null, isWritable: false },
    tokenAccount: { value: input.tokenAccount ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.freezeAuthority),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.tokenAccount),
      getAccountMeta(accounts.tokenProgram)
    ],
    data: getFreezeInstructionDataEncoder().encode({}),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/thaw.ts
var import_kit33 = require("@solana/kit");
var THAW_DISCRIMINATOR = 11;
function getThawInstructionDataEncoder() {
  return (0, import_kit33.transformEncoder)(
    (0, import_kit33.getStructEncoder)([["discriminator", (0, import_kit33.getU8Encoder)()]]),
    (value) => ({ ...value, discriminator: THAW_DISCRIMINATOR })
  );
}
function getThawInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    freezeAuthority: {
      value: input.freezeAuthority ?? null,
      isWritable: false
    },
    mintAccount: { value: input.mintAccount ?? null, isWritable: false },
    tokenAccount: { value: input.tokenAccount ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.freezeAuthority),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.tokenAccount),
      getAccountMeta(accounts.tokenProgram)
    ],
    data: getThawInstructionDataEncoder().encode({}),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/createDistributionEscrow.ts
var import_kit34 = require("@solana/kit");
var CREATE_DISTRIBUTION_ESCROW_DISCRIMINATOR = 20;
function getCreateDistributionEscrowInstructionDataEncoder() {
  return (0, import_kit34.transformEncoder)(
    (0, import_kit34.getStructEncoder)([
      ["discriminator", (0, import_kit34.getU8Encoder)()],
      [
        "createDistributionEscrowArgs",
        getCreateDistributionEscrowArgsEncoder()
      ]
    ]),
    (value) => ({
      ...value,
      discriminator: CREATE_DISTRIBUTION_ESCROW_DISCRIMINATOR
    })
  );
}
function getCreateDistributionEscrowInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfigOrMintAuthority: {
      value: input.verificationConfigOrMintAuthority ?? null,
      isWritable: false
    },
    instructionsSysvarOrCreator: {
      value: input.instructionsSysvarOrCreator ?? null,
      isWritable: false
    },
    distributionEscrowAuthority: {
      value: input.distributionEscrowAuthority ?? null,
      isWritable: false
    },
    payer: { value: input.payer ?? null, isWritable: true },
    distributionTokenAccount: {
      value: input.distributionTokenAccount ?? null,
      isWritable: true
    },
    distributionMint: {
      value: input.distributionMint ?? null,
      isWritable: false
    },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    associatedTokenAccountProgram: {
      value: input.associatedTokenAccountProgram ?? null,
      isWritable: false
    },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfigOrMintAuthority),
      getAccountMeta(accounts.instructionsSysvarOrCreator),
      getAccountMeta(accounts.distributionEscrowAuthority),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.distributionTokenAccount),
      getAccountMeta(accounts.distributionMint),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.associatedTokenAccountProgram),
      getAccountMeta(accounts.systemProgram)
    ],
    data: getCreateDistributionEscrowInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/claimDistribution.ts
var import_kit35 = require("@solana/kit");
var CLAIM_DISTRIBUTION_DISCRIMINATOR = 21;
function getClaimDistributionInstructionDataEncoder() {
  return (0, import_kit35.transformEncoder)(
    (0, import_kit35.getStructEncoder)([
      ["discriminator", (0, import_kit35.getU8Encoder)()],
      ["claimDistributionArgs", getClaimDistributionArgsEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CLAIM_DISTRIBUTION_DISCRIMINATOR })
  );
}
function getClaimDistributionInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    permanentDelegateAuthority: {
      value: input.permanentDelegateAuthority ?? null,
      isWritable: false
    },
    payer: { value: input.payer ?? null, isWritable: true },
    mintAccount: { value: input.mintAccount ?? null, isWritable: false },
    eligibleTokenAccount: {
      value: input.eligibleTokenAccount ?? null,
      isWritable: true
    },
    escrowTokenAccount: {
      value: input.escrowTokenAccount ?? null,
      isWritable: true
    },
    receiptAccount: { value: input.receiptAccount ?? null, isWritable: true },
    proofAccount: { value: input.proofAccount ?? null, isWritable: false },
    transferHookProgram: {
      value: input.transferHookProgram ?? null,
      isWritable: false
    },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.permanentDelegateAuthority),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.eligibleTokenAccount),
      getAccountMeta(accounts.escrowTokenAccount),
      getAccountMeta(accounts.receiptAccount),
      getAccountMeta(accounts.proofAccount),
      getAccountMeta(accounts.transferHookProgram),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.systemProgram)
    ],
    data: getClaimDistributionInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/createProofAccount.ts
var import_kit36 = require("@solana/kit");
var CREATE_PROOF_ACCOUNT_DISCRIMINATOR = 18;
function getCreateProofAccountInstructionDataEncoder() {
  return (0, import_kit36.transformEncoder)(
    (0, import_kit36.getStructEncoder)([
      ["discriminator", (0, import_kit36.getU8Encoder)()],
      ["createProofArgs", getCreateProofArgsEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_PROOF_ACCOUNT_DISCRIMINATOR })
  );
}
function getCreateProofAccountInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    payer: { value: input.payer ?? null, isWritable: true },
    mintAccount: { value: input.mintAccount ?? null, isWritable: false },
    proofAccount: { value: input.proofAccount ?? null, isWritable: true },
    tokenAccount: { value: input.tokenAccount ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.proofAccount),
      getAccountMeta(accounts.tokenAccount),
      getAccountMeta(accounts.systemProgram)
    ],
    data: getCreateProofAccountInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/split.ts
var import_kit37 = require("@solana/kit");
var SPLIT_DISCRIMINATOR = 16;
function getSplitInstructionDataEncoder() {
  return (0, import_kit37.transformEncoder)(
    (0, import_kit37.getStructEncoder)([
      ["discriminator", (0, import_kit37.getU8Encoder)()],
      ["splitArgs", getSplitArgsEncoder()]
    ]),
    (value) => ({ ...value, discriminator: SPLIT_DISCRIMINATOR })
  );
}
function getSplitInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    mintAuthority: { value: input.mintAuthority ?? null, isWritable: false },
    permanentDelegate: {
      value: input.permanentDelegate ?? null,
      isWritable: false
    },
    payer: { value: input.payer ?? null, isWritable: true },
    mintAccount: { value: input.mintAccount ?? null, isWritable: true },
    tokenAccount: { value: input.tokenAccount ?? null, isWritable: true },
    rateAccount: { value: input.rateAccount ?? null, isWritable: false },
    receiptAccount: { value: input.receiptAccount ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.mintAuthority),
      getAccountMeta(accounts.permanentDelegate),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.mintAccount),
      getAccountMeta(accounts.tokenAccount),
      getAccountMeta(accounts.rateAccount),
      getAccountMeta(accounts.receiptAccount),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.systemProgram)
    ],
    data: getSplitInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/convert.ts
var import_kit38 = require("@solana/kit");
var CONVERT_DISCRIMINATOR = 17;
function getConvertInstructionDataEncoder() {
  return (0, import_kit38.transformEncoder)(
    (0, import_kit38.getStructEncoder)([
      ["discriminator", (0, import_kit38.getU8Encoder)()],
      ["convertArgs", getConvertArgsEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CONVERT_DISCRIMINATOR })
  );
}
function getConvertInstruction(input, config) {
  const programAddress = config?.programAddress ?? SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS;
  const originalAccounts = {
    mint: { value: input.mint ?? null, isWritable: false },
    verificationConfig: {
      value: input.verificationConfig ?? null,
      isWritable: false
    },
    instructionsSysvar: {
      value: input.instructionsSysvar ?? null,
      isWritable: false
    },
    mintAuthority: { value: input.mintAuthority ?? null, isWritable: false },
    permanentDelegate: {
      value: input.permanentDelegate ?? null,
      isWritable: false
    },
    payer: { value: input.payer ?? null, isWritable: true },
    mintFrom: { value: input.mintFrom ?? null, isWritable: true },
    mintTo: { value: input.mintTo ?? null, isWritable: true },
    tokenAccountFrom: {
      value: input.tokenAccountFrom ?? null,
      isWritable: true
    },
    tokenAccountTo: { value: input.tokenAccountTo ?? null, isWritable: true },
    rateAccount: { value: input.rateAccount ?? null, isWritable: false },
    receiptAccount: { value: input.receiptAccount ?? null, isWritable: true },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.instructionsSysvar.value) {
    accounts.instructionsSysvar.value = "Sysvar1nstructions1111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.verificationConfig),
      getAccountMeta(accounts.instructionsSysvar),
      getAccountMeta(accounts.mintAuthority),
      getAccountMeta(accounts.permanentDelegate),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.mintFrom),
      getAccountMeta(accounts.mintTo),
      getAccountMeta(accounts.tokenAccountFrom),
      getAccountMeta(accounts.tokenAccountTo),
      getAccountMeta(accounts.rateAccount),
      getAccountMeta(accounts.receiptAccount),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.systemProgram)
    ],
    data: getConvertInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}

// src/l1/derive.ts
var import_kit39 = require("@solana/kit");

// src/utils/types.ts
var FAMP_POLICY_SEED = new Uint8Array([
  102,
  97,
  109,
  112,
  95,
  112,
  111,
  108,
  105,
  99,
  121
]);

// src/l1/derive.ts
var VERIFICATION_CONFIG_SEED = "verification_config";
async function deriveVerificationConfigPda(mint, instructionDiscriminator, programAddress = SSTS_PROGRAM_ID) {
  return (0, import_kit39.getProgramDerivedAddress)({
    programAddress,
    seeds: [
      VERIFICATION_CONFIG_SEED,
      mint,
      new Uint8Array([instructionDiscriminator])
    ]
  });
}
async function deriveMintAuthorityPda(mint, creator, programAddress = SSTS_PROGRAM_ID) {
  return (0, import_kit39.getProgramDerivedAddress)({
    programAddress,
    seeds: ["mint_authority", mint, creator]
  });
}
async function deriveRateAccountPda(mint, actionId, programAddress = SSTS_PROGRAM_ID) {
  return (0, import_kit39.getProgramDerivedAddress)({
    programAddress,
    seeds: ["rate", mint, actionId]
  });
}
async function deriveProofAccountPda(mint, claimant, programAddress = SSTS_PROGRAM_ID) {
  return (0, import_kit39.getProgramDerivedAddress)({
    programAddress,
    seeds: ["proof", mint, claimant]
  });
}
async function deriveFampPolicyPda(mint, programAddress = FAMP_PROGRAM_ID) {
  return (0, import_kit39.getProgramDerivedAddress)({
    programAddress,
    seeds: [FAMP_POLICY_SEED, mint]
  });
}
async function deriveAllTokenPdas(mint, creator, programAddress = SSTS_PROGRAM_ID) {
  const mintAuthority = await deriveMintAuthorityPda(
    mint,
    creator,
    programAddress
  );
  const keyInstructions = [
    2,
    // InitializeVerificationConfig
    3,
    // UpdateVerificationConfig
    6,
    // Mint
    12,
    // Transfer
    8,
    // Pause
    9,
    // Resume
    10,
    // Freeze
    11
    // Thaw
  ];
  const verificationConfigs = {};
  for (const disc of keyInstructions) {
    verificationConfigs[disc] = await deriveVerificationConfigPda(
      mint,
      disc,
      programAddress
    );
  }
  return { mintAuthority, verificationConfigs };
}

// src/l1/errors.ts
var SstsError = /* @__PURE__ */ ((SstsError2) => {
  SstsError2["VerificationProgramNotFound"] = "VerificationProgramNotFound";
  SstsError2["VerificationProgramCallFailed"] = "VerificationProgramCallFailed";
  SstsError2["AccountIntersectionMismatch"] = "AccountIntersectionMismatch";
  SstsError2["InvalidVerificationConfigPda"] = "InvalidVerificationConfigPda";
  SstsError2["InternalMetadataRequiresData"] = "InternalMetadataRequiresData";
  SstsError2["ExternalMetadataForbidsData"] = "ExternalMetadataForbidsData";
  SstsError2["CannotModifyExternalMetadataAccount"] = "CannotModifyExternalMetadataAccount";
  SstsError2["DuplicateActionReceipt"] = "DuplicateActionReceipt";
  SstsError2["InvalidRateConfiguration"] = "InvalidRateConfiguration";
  SstsError2["InvalidMintAuthority"] = "InvalidMintAuthority";
  return SstsError2;
})(SstsError || {});
var TokenForgeError = class extends Error {
  constructor(message, code, workflow, cause) {
    super(message);
    this.code = code;
    this.workflow = workflow;
    this.cause = cause;
    this.name = "TokenForgeError";
  }
  code;
  workflow;
  cause;
};
function enrichError(raw, workflow, logs) {
  const logText = logs?.join("\n") ?? "";
  for (const errorName of Object.values(SstsError)) {
    if (logText.includes(errorName) || raw.message.includes(errorName)) {
      return new TokenForgeError(
        `SSTS error in ${workflow ?? "workflow"}: ${errorName}`,
        errorName,
        workflow,
        raw
      );
    }
  }
  return new TokenForgeError(
    raw.message,
    void 0,
    workflow,
    raw
  );
}
function assert(condition, message, workflow) {
  if (!condition) {
    throw new TokenForgeError(message, void 0, workflow);
  }
}
var FampError = /* @__PURE__ */ ((FampError2) => {
  FampError2["Unauthorized"] = "Unauthorized";
  FampError2["AllowlistFull"] = "AllowlistFull";
  FampError2["BlocklistFull"] = "BlocklistFull";
  FampError2["AlreadyInAllowlist"] = "AlreadyInAllowlist";
  FampError2["AlreadyInBlocklist"] = "AlreadyInBlocklist";
  FampError2["WalletNotFound"] = "WalletNotFound";
  FampError2["WalletBlocked"] = "WalletBlocked";
  FampError2["WalletNotAllowlisted"] = "WalletNotAllowlisted";
  FampError2["InvalidTokenAccount"] = "InvalidTokenAccount";
  return FampError2;
})(FampError || {});

// src/l1/transactions.ts
var import_kit40 = require("@solana/kit");
function buildTransaction(feePayer, instructions, latestBlockhash) {
  (0, import_kit40.assertIsBlockhash)(latestBlockhash.blockhash);
  const blockhashObj = {
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
  };
  return (0, import_kit40.setTransactionMessageFeePayerSigner)(
    feePayer,
    (0, import_kit40.setTransactionMessageLifetimeUsingBlockhash)(
      blockhashObj,
      (0, import_kit40.appendTransactionMessageInstructions)(
        instructions,
        (0, import_kit40.createTransactionMessage)({ version: 0 })
      )
    )
  );
}
async function sendSstsTransaction(rpc, rpcSubscriptions, feePayer, instructions, workflow) {
  try {
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    const transactionMessage = (0, import_kit40.setTransactionMessageFeePayerSigner)(
      feePayer,
      (0, import_kit40.setTransactionMessageLifetimeUsingBlockhash)(
        latestBlockhash,
        (0, import_kit40.appendTransactionMessageInstructions)(
          instructions,
          (0, import_kit40.createTransactionMessage)({ version: 0 })
        )
      )
    );
    const signatureBytes = await (0, import_kit40.signAndSendTransactionMessageWithSigners)(transactionMessage);
    const base58 = (0, import_kit40.getBase58Codec)();
    return base58.decode(signatureBytes);
  } catch (raw) {
    const error = raw instanceof Error ? raw : new Error(String(raw));
    throw new TokenForgeError(
      `Transaction failed in ${workflow ?? "workflow"}: ${error.message}`,
      void 0,
      workflow,
      error
    );
  }
}
function batchInstructions(feePayer, instructions, latestBlockhash, maxInstructionsPerTx = 15) {
  const batches = [];
  for (let i = 0; i < instructions.length; i += maxInstructionsPerTx) {
    batches.push(instructions.slice(i, i + maxInstructionsPerTx));
  }
  return batches.map((batch) => buildTransaction(feePayer, batch, latestBlockhash));
}
function createAssociatedTokenAccountInstruction(payer, mint, owner, tokenProgram = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb") {
  return {
    programAddress: tokenProgram,
    accounts: [],
    data: new Uint8Array()
  };
}

// src/l2/token.ts
var TRANSFER_VERIFICATION_DISCRIMINATOR = 12;
async function createSecurityToken(rpc, rpcSubscriptions, creator, mint, input) {
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint.address,
    creator.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const verificationPrograms = input.verificationPrograms ?? [
    NOOP_VERIFICATION_PROGRAM_ID
  ];
  const [transferVerificationConfigPda] = await deriveVerificationConfigPda(
    mint.address,
    TRANSFER_VERIFICATION_DISCRIMINATOR,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const initializeMintInstruction = getInitializeMintInstruction({
    mint,
    authority: mintAuthorityPda,
    payer: creator,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    rentSysvar: "SysvarRent111111111111111111111111111111111",
    initializeMintArgs: {
      ixMint: {
        decimals: input.decimals,
        mintAuthority: creator.address,
        freezeAuthority: mintAuthorityPda
      },
      ixMetadataPointer: {
        authority: creator.address,
        metadataAddress: mint.address
      },
      ixMetadata: {
        name: input.metadata.name,
        symbol: input.metadata.symbol,
        uri: input.metadata.uri,
        additionalMetadata: input.metadata.additional ? new TextEncoder().encode(JSON.stringify(input.metadata.additional)) : new Uint8Array()
      },
      ixScaledUiAmount: null
    }
  });
  const initializeVerificationConfigInstruction = getInitializeVerificationConfigInstruction({
    mint: mint.address,
    verificationConfigOrMintAuthority: mintAuthorityPda,
    instructionsSysvarOrCreator: creator.address,
    payer: creator,
    mintAccount: mint.address,
    configAccount: transferVerificationConfigPda,
    systemProgram: SYSTEM_PROGRAM_ID,
    transferHookPda: TRANSFER_HOOK_PROGRAM_ID,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
    initializeVerificationConfigArgs: {
      instructionDiscriminator: TRANSFER_VERIFICATION_DISCRIMINATOR,
      cpiMode: input.verificationCpiMode ?? false,
      programAddresses: verificationPrograms
    }
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    creator,
    [initializeMintInstruction, initializeVerificationConfigInstruction],
    "createSecurityToken"
  );
  return {
    signatures: [signature],
    addresses: {
      mint: mint.address,
      mintAuthority: mintAuthorityPda,
      transferVerificationConfig: transferVerificationConfigPda
    }
  };
}
async function configureVerification(rpc, rpcSubscriptions, payer, mint, instructionDiscriminator, programs, cpiMode = false) {
  const [configPda] = await deriveVerificationConfigPda(
    mint,
    instructionDiscriminator,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getInitializeVerificationConfigInstruction({
    mint,
    verificationConfigOrMintAuthority: configPda,
    instructionsSysvarOrCreator: payer.address,
    payer,
    mintAccount: mint,
    configAccount: configPda,
    systemProgram: SYSTEM_PROGRAM_ID,
    transferHookPda: TRANSFER_HOOK_PROGRAM_ID,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
    initializeVerificationConfigArgs: {
      instructionDiscriminator,
      cpiMode,
      programAddresses: programs
    }
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    "configureVerification"
  );
  return {
    signatures: [signature],
    addresses: {
      verificationConfig: configPda
    }
  };
}
async function mintTokens(rpc, rpcSubscriptions, authority, mint, input) {
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    6,
    // Mint discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getMintInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    mintAuthority: mintAuthorityPda,
    mintAccount: mint,
    destination: input.destination,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    amount: input.amount
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    "mintTokens"
  );
  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda
    }
  };
}
async function transferTokens(rpc, rpcSubscriptions, authority, mint, input) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    12,
    // Transfer discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getTransferInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    permanentDelegateAuthority: authority.address,
    mintAccount: mint,
    fromTokenAccount: input.from,
    toTokenAccount: input.to,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    amount: input.amount
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    "transferTokens"
  );
  return {
    signatures: [signature],
    addresses: {
      verificationConfig: verificationConfigPda
    }
  };
}
async function pauseToken(rpc, rpcSubscriptions, authority, mint) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    8,
    // Pause discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getPauseInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    pauseAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    "pauseToken"
  );
  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda
    }
  };
}
async function resumeToken(rpc, rpcSubscriptions, authority, mint) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    9,
    // Resume discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getResumeInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    pauseAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    "resumeToken"
  );
  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda
    }
  };
}
async function freezeAccount(rpc, rpcSubscriptions, authority, mint, input) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    10,
    // Freeze discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getFreezeInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    freezeAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenAccount: input.tokenAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    "freezeAccount"
  );
  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda
    }
  };
}
async function thawAccount(rpc, rpcSubscriptions, authority, mint, input) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    11,
    // Thaw discriminator
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const [mintAuthorityPda] = await deriveMintAuthorityPda(
    mint,
    authority.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getThawInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    freezeAuthority: mintAuthorityPda,
    mintAccount: mint,
    tokenAccount: input.tokenAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    authority,
    [instruction],
    "thawAccount"
  );
  return {
    signatures: [signature],
    addresses: {
      mintAuthority: mintAuthorityPda,
      verificationConfig: verificationConfigPda
    }
  };
}

// src/l2/distribution.ts
var ASSOCIATED_TOKEN_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
async function createDistribution(rpc, rpcSubscriptions, payer, mint, input) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    20,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const distributionEscrowAuthority = mint;
  const instruction = getCreateDistributionEscrowInstruction({
    mint,
    verificationConfigOrMintAuthority: verificationConfigPda,
    instructionsSysvarOrCreator: payer.address,
    distributionEscrowAuthority,
    payer,
    distributionTokenAccount: input.escrowTokenAccount,
    distributionMint: mint,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    associatedTokenAccountProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    createDistributionEscrowArgs: {
      actionId: BigInt(input.actionId ?? 0),
      merkleRoot: input.merkleRoot
    }
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    "createDistribution"
  );
  return {
    signatures: [signature],
    addresses: {
      escrowTokenAccount: input.escrowTokenAccount,
      verificationConfig: verificationConfigPda
    },
    data: { actionId: input.actionId ?? 0 }
  };
}
async function claimDistribution(rpc, rpcSubscriptions, claimant, mint, input) {
  const [proofPda] = await deriveProofAccountPda(
    mint,
    claimant.address,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    21,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instructions = [];
  if (input.proof && input.proof.length > 0) {
    const createProofInstruction = getCreateProofAccountInstruction({
      mint,
      verificationConfig: verificationConfigPda,
      instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
      payer: claimant,
      mintAccount: mint,
      proofAccount: proofPda,
      tokenAccount: input.claimantTokenAccount,
      systemProgram: SYSTEM_PROGRAM_ID,
      createProofArgs: {
        actionId: BigInt(input.actionId ?? 0),
        data: input.proof.map((p) => p)
      }
    });
    instructions.push(createProofInstruction);
  }
  const merkleProof = input.proof && input.proof.length > 0 ? input.proof : null;
  const claimInstruction = getClaimDistributionInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    permanentDelegateAuthority: claimant.address,
    payer: claimant,
    mintAccount: mint,
    eligibleTokenAccount: input.claimantTokenAccount,
    receiptAccount: proofPda,
    proofAccount: proofPda,
    transferHookProgram: TRANSFER_HOOK_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    claimDistributionArgs: {
      actionId: BigInt(input.actionId ?? 0),
      amount: BigInt(input.amount),
      merkleRoot: input.merkleRoot,
      leafIndex: input.leafIndex ?? 0,
      merkleProof
    }
  });
  instructions.push(claimInstruction);
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    claimant,
    instructions,
    "claimDistribution"
  );
  return {
    signatures: [signature],
    addresses: {
      proofAccount: proofPda,
      verificationConfig: verificationConfigPda
    }
  };
}
async function executeSplit(rpc, rpcSubscriptions, payer, mint, rateAccount, actionId, tokenAccount) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    mint,
    16,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getSplitInstruction({
    mint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    mintAuthority: mint,
    permanentDelegate: payer.address,
    payer,
    mintAccount: mint,
    tokenAccount,
    rateAccount,
    receiptAccount: rateAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    splitArgs: {
      actionId
    }
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    "executeSplit"
  );
  return {
    signatures: [signature],
    addresses: { rateAccount, verificationConfig: verificationConfigPda }
  };
}
async function executeConvert(rpc, rpcSubscriptions, payer, sourceMint, targetMint, rateAccount, actionId, amountToConvert, tokenAccountFrom, tokenAccountTo) {
  const [verificationConfigPda] = await deriveVerificationConfigPda(
    sourceMint,
    17,
    SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS
  );
  const instruction = getConvertInstruction({
    mint: sourceMint,
    verificationConfig: verificationConfigPda,
    instructionsSysvar: INSTRUCTIONS_SYSVAR_ID,
    mintAuthority: sourceMint,
    permanentDelegate: payer.address,
    payer,
    mintFrom: sourceMint,
    mintTo: targetMint,
    tokenAccountFrom,
    tokenAccountTo,
    rateAccount,
    receiptAccount: rateAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    convertArgs: {
      actionId,
      amountToConvert
    }
  });
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    payer,
    [instruction],
    "executeConvert"
  );
  return {
    signatures: [signature],
    addresses: {
      rateAccount,
      sourceMint,
      targetMint,
      verificationConfig: verificationConfigPda
    }
  };
}

// src/l2/famp.ts
var FAMP_DISCRIMINATORS = {
  createPolicy: new Uint8Array([
    171,
    214,
    171,
    177,
    172,
    37,
    126,
    189
  ]),
  addToAllowlist: new Uint8Array([
    239,
    163,
    94,
    241,
    244,
    175,
    118,
    189
  ]),
  removeFromAllowlist: new Uint8Array([
    137,
    219,
    148,
    130,
    174,
    186,
    147,
    165
  ]),
  addToBlocklist: new Uint8Array([
    25,
    128,
    165,
    241,
    245,
    242,
    207,
    59
  ]),
  removeFromBlocklist: new Uint8Array([
    69,
    87,
    225,
    218,
    157,
    123,
    220,
    236
  ]),
  verifyTransfer: new Uint8Array([
    51,
    173,
    177,
    219,
    221,
    183,
    29,
    112
  ])
};
function encodePubkey(address) {
  const bytes = new Uint8Array(32);
  const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let num = BigInt(0);
  for (const char of address) {
    num = num * BigInt(58) + BigInt(base58Chars.indexOf(char));
  }
  let i = 31;
  while (num > 0n && i >= 0) {
    bytes[i] = Number(num % 256n);
    num /= 256n;
    i--;
  }
  return bytes;
}
async function createFampPolicy(rpc, rpcSubscriptions, issuer, mint, allowlistMode = false) {
  const [policyPda, policyBump] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID
  );
  const discriminator = FAMP_DISCRIMINATORS.createPolicy;
  const allowlistModeByte = allowlistMode ? new Uint8Array([1]) : new Uint8Array([0]);
  const data = new Uint8Array([...discriminator, ...allowlistModeByte]);
  const instruction = {
    programAddress: FAMP_PROGRAM_ID,
    accounts: [
      {
        address: issuer.address,
        role: 3
        // Writable + Signer
      },
      {
        address: mint,
        role: 0
        // Readonly
      },
      {
        address: policyPda,
        role: 1
        // Writable
      },
      {
        address: "11111111111111111111111111111111",
        role: 0
        // Readonly (system program)
      }
    ],
    data
  };
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction],
    "createFampPolicy"
  );
  return {
    signatures: [signature],
    addresses: {
      policy: policyPda
    },
    data: { allowlistMode, bump: policyBump }
  };
}
async function addToAllowlist(rpc, rpcSubscriptions, issuer, mint, wallet) {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID
  );
  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.addToAllowlist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);
  const instruction = {
    programAddress: FAMP_PROGRAM_ID,
    accounts: [
      { address: issuer.address, role: 2 },
      { address: policyPda, role: 1 }
    ],
    data
  };
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction],
    "addToAllowlist"
  );
  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet }
  };
}
async function removeFromAllowlist(rpc, rpcSubscriptions, issuer, mint, wallet) {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID
  );
  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.removeFromAllowlist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);
  const instruction = {
    programAddress: FAMP_PROGRAM_ID,
    accounts: [
      { address: issuer.address, role: 2 },
      { address: policyPda, role: 1 }
    ],
    data
  };
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction],
    "removeFromAllowlist"
  );
  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet, event: "WalletBlocked" }
  };
}
async function addToBlocklist(rpc, rpcSubscriptions, issuer, mint, wallet) {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID
  );
  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.addToBlocklist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);
  const instruction = {
    programAddress: FAMP_PROGRAM_ID,
    accounts: [
      { address: issuer.address, role: 2 },
      { address: policyPda, role: 1 }
    ],
    data
  };
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction],
    "addToBlocklist"
  );
  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet, event: "WalletBlocked" }
  };
}
async function removeFromBlocklist(rpc, rpcSubscriptions, issuer, mint, wallet) {
  const [policyPda] = await deriveFampPolicyPda(
    mint,
    FAMP_PROGRAM_ID
  );
  const walletBytes = encodePubkey(wallet);
  const discriminator = FAMP_DISCRIMINATORS.removeFromBlocklist;
  const data = new Uint8Array([...discriminator, ...walletBytes]);
  const instruction = {
    programAddress: FAMP_PROGRAM_ID,
    accounts: [
      { address: issuer.address, role: 2 },
      { address: policyPda, role: 1 }
    ],
    data
  };
  const signature = await sendSstsTransaction(
    rpc,
    rpcSubscriptions,
    issuer,
    [instruction],
    "removeFromBlocklist"
  );
  return {
    signatures: [signature],
    addresses: { policy: policyPda },
    data: { wallet, event: "WalletUnblocked" }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CANONICAL_COMMIT,
  CANONICAL_IDL_VERSION,
  FAMP_PROGRAM_ID,
  FampError,
  INSTRUCTIONS_SYSVAR_ID,
  NOOP_VERIFICATION_PROGRAM_ID,
  RENT_SYSVAR_ID,
  SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS,
  SSTS_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  SstsError,
  SstsInstruction,
  TOKEN_2022_PROGRAM_ID,
  TRANSFER_HOOK_PROGRAM_ID,
  TokenForgeError,
  addToAllowlist,
  addToBlocklist,
  assert,
  batchInstructions,
  buildTransaction,
  claimDistribution,
  configureVerification,
  createAssociatedTokenAccountInstruction,
  createDistribution,
  createFampPolicy,
  createSecurityToken,
  deriveAllTokenPdas,
  deriveFampPolicyPda,
  deriveMintAuthorityPda,
  deriveProofAccountPda,
  deriveRateAccountPda,
  deriveVerificationConfigPda,
  enrichError,
  executeConvert,
  executeSplit,
  freezeAccount,
  getClaimDistributionInstruction,
  getConvertInstruction,
  getCreateDistributionEscrowInstruction,
  getCreateProofAccountInstruction,
  getFreezeInstruction,
  getInitializeMintInstruction,
  getInitializeVerificationConfigInstruction,
  getMintInstruction,
  getPauseInstruction,
  getResumeInstruction,
  getSplitInstruction,
  getThawInstruction,
  getTransferInstruction,
  mintTokens,
  pauseToken,
  removeFromAllowlist,
  removeFromBlocklist,
  resumeToken,
  sendSstsTransaction,
  thawAccount,
  transferTokens
});
