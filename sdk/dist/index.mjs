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
import {
  containsBytes,
  getU8Encoder
} from "@solana/kit";
var SECURITY_TOKEN_PROGRAM_PROGRAM_ADDRESS = "SSTS8Qk2bW3aVaBEsY1Ras95YdbaaYQQx21JWHxvjap";

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeMint.ts
import {
  combineCodec as combineCodec24,
  getStructDecoder as getStructDecoder23,
  getStructEncoder as getStructEncoder23,
  getU8Decoder as getU8Decoder7,
  getU8Encoder as getU8Encoder8,
  transformEncoder
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/shared/index.ts
import {
  AccountRole,
  isProgramDerivedAddress,
  isTransactionSigner as kitIsTransactionSigner,
  upgradeRoleToSigner
} from "@solana/kit";
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
        role: AccountRole.READONLY
      });
    }
    const writableRole = account.isWritable ? AccountRole.WRITABLE : AccountRole.READONLY;
    return Object.freeze({
      address: expectAddress(account.value),
      role: isTransactionSigner(account.value) ? upgradeRoleToSigner(writableRole) : writableRole,
      ...isTransactionSigner(account.value) ? { signer: account.value } : {}
    });
  };
}
function isTransactionSigner(value) {
  return !!value && typeof value === "object" && "address" in value && kitIsTransactionSigner(value);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/claimDistributionArgs.ts
import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getArrayDecoder,
  getArrayEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getOptionDecoder,
  getOptionEncoder,
  getStructDecoder,
  getStructEncoder,
  getU32Decoder,
  getU32Encoder,
  getU64Decoder,
  getU64Encoder
} from "@solana/kit";
function getClaimDistributionArgsEncoder() {
  return getStructEncoder([
    ["actionId", getU64Encoder()],
    ["amount", getU64Encoder()],
    ["merkleRoot", fixEncoderSize(getBytesEncoder(), 32)],
    ["leafIndex", getU32Encoder()],
    [
      "merkleProof",
      getOptionEncoder(getArrayEncoder(fixEncoderSize(getBytesEncoder(), 32)))
    ]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/closeActionReceiptArgs.ts
import {
  combineCodec as combineCodec2,
  getStructDecoder as getStructDecoder2,
  getStructEncoder as getStructEncoder2,
  getU64Decoder as getU64Decoder2,
  getU64Encoder as getU64Encoder2
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/closeClaimReceiptArgs.ts
import {
  combineCodec as combineCodec3,
  fixDecoderSize as fixDecoderSize2,
  fixEncoderSize as fixEncoderSize2,
  getArrayDecoder as getArrayDecoder2,
  getArrayEncoder as getArrayEncoder2,
  getBytesDecoder as getBytesDecoder2,
  getBytesEncoder as getBytesEncoder2,
  getOptionDecoder as getOptionDecoder2,
  getOptionEncoder as getOptionEncoder2,
  getStructDecoder as getStructDecoder3,
  getStructEncoder as getStructEncoder3,
  getU64Decoder as getU64Decoder3,
  getU64Encoder as getU64Encoder3
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/closeRateArgs.ts
import {
  combineCodec as combineCodec4,
  getStructDecoder as getStructDecoder4,
  getStructEncoder as getStructEncoder4,
  getU64Decoder as getU64Decoder4,
  getU64Encoder as getU64Encoder4
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/convertArgs.ts
import {
  combineCodec as combineCodec5,
  getStructDecoder as getStructDecoder5,
  getStructEncoder as getStructEncoder5,
  getU64Decoder as getU64Decoder5,
  getU64Encoder as getU64Encoder5
} from "@solana/kit";
function getConvertArgsEncoder() {
  return getStructEncoder5([
    ["actionId", getU64Encoder5()],
    ["amountToConvert", getU64Encoder5()]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/createDistributionEscrowArgs.ts
import {
  combineCodec as combineCodec6,
  fixDecoderSize as fixDecoderSize3,
  fixEncoderSize as fixEncoderSize3,
  getBytesDecoder as getBytesDecoder3,
  getBytesEncoder as getBytesEncoder3,
  getStructDecoder as getStructDecoder6,
  getStructEncoder as getStructEncoder6,
  getU64Decoder as getU64Decoder6,
  getU64Encoder as getU64Encoder6
} from "@solana/kit";
function getCreateDistributionEscrowArgsEncoder() {
  return getStructEncoder6([
    ["actionId", getU64Encoder6()],
    ["merkleRoot", fixEncoderSize3(getBytesEncoder3(), 32)]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/createProofArgs.ts
import {
  combineCodec as combineCodec7,
  fixDecoderSize as fixDecoderSize4,
  fixEncoderSize as fixEncoderSize4,
  getArrayDecoder as getArrayDecoder3,
  getArrayEncoder as getArrayEncoder3,
  getBytesDecoder as getBytesDecoder4,
  getBytesEncoder as getBytesEncoder4,
  getStructDecoder as getStructDecoder7,
  getStructEncoder as getStructEncoder7,
  getU64Decoder as getU64Decoder7,
  getU64Encoder as getU64Encoder7
} from "@solana/kit";
function getCreateProofArgsEncoder() {
  return getStructEncoder7([
    ["actionId", getU64Encoder7()],
    ["data", getArrayEncoder3(fixEncoderSize4(getBytesEncoder4(), 32))]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/createRateArgs.ts
import {
  combineCodec as combineCodec8,
  getStructDecoder as getStructDecoder8,
  getStructEncoder as getStructEncoder8,
  getU64Decoder as getU64Decoder8,
  getU64Encoder as getU64Encoder8
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/initializeMintArgs.ts
import {
  combineCodec as combineCodec9,
  getOptionDecoder as getOptionDecoder3,
  getOptionEncoder as getOptionEncoder3,
  getStructDecoder as getStructDecoder9,
  getStructEncoder as getStructEncoder9
} from "@solana/kit";
function getInitializeMintArgsEncoder() {
  return getStructEncoder9([
    ["ixMint", getMintArgsEncoder()],
    ["ixMetadataPointer", getOptionEncoder3(getMetadataPointerArgsEncoder())],
    ["ixMetadata", getOptionEncoder3(getTokenMetadataArgsEncoder())],
    [
      "ixScaledUiAmount",
      getOptionEncoder3(getScaledUiAmountConfigArgsEncoder())
    ]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/initializeVerificationConfigArgs.ts
import {
  combineCodec as combineCodec10,
  getAddressDecoder,
  getAddressEncoder,
  getArrayDecoder as getArrayDecoder4,
  getArrayEncoder as getArrayEncoder4,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder as getStructDecoder10,
  getStructEncoder as getStructEncoder10,
  getU8Decoder,
  getU8Encoder as getU8Encoder2
} from "@solana/kit";
function getInitializeVerificationConfigArgsEncoder() {
  return getStructEncoder10([
    ["instructionDiscriminator", getU8Encoder2()],
    ["cpiMode", getBooleanEncoder()],
    ["programAddresses", getArrayEncoder4(getAddressEncoder())]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/metadataPointerArgs.ts
import {
  combineCodec as combineCodec11,
  getAddressDecoder as getAddressDecoder2,
  getAddressEncoder as getAddressEncoder2,
  getStructDecoder as getStructDecoder11,
  getStructEncoder as getStructEncoder11
} from "@solana/kit";
function getMetadataPointerArgsEncoder() {
  return getStructEncoder11([
    ["authority", getAddressEncoder2()],
    ["metadataAddress", getAddressEncoder2()]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/mintArgs.ts
import {
  combineCodec as combineCodec12,
  getAddressDecoder as getAddressDecoder3,
  getAddressEncoder as getAddressEncoder3,
  getStructDecoder as getStructDecoder12,
  getStructEncoder as getStructEncoder12,
  getU8Decoder as getU8Decoder2,
  getU8Encoder as getU8Encoder3
} from "@solana/kit";
function getMintArgsEncoder() {
  return getStructEncoder12([
    ["decimals", getU8Encoder3()],
    ["mintAuthority", getAddressEncoder3()],
    ["freezeAuthority", getAddressEncoder3()]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/rateConfig.ts
import {
  combineCodec as combineCodec13,
  getStructDecoder as getStructDecoder13,
  getStructEncoder as getStructEncoder13,
  getU8Decoder as getU8Decoder3,
  getU8Encoder as getU8Encoder4
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/rounding.ts
import {
  combineCodec as combineCodec14,
  getEnumDecoder,
  getEnumEncoder
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/scaledUiAmountConfigArgs.ts
import {
  combineCodec as combineCodec15,
  fixDecoderSize as fixDecoderSize5,
  fixEncoderSize as fixEncoderSize5,
  getAddressDecoder as getAddressDecoder4,
  getAddressEncoder as getAddressEncoder4,
  getBytesDecoder as getBytesDecoder5,
  getBytesEncoder as getBytesEncoder5,
  getI64Decoder,
  getI64Encoder,
  getStructDecoder as getStructDecoder14,
  getStructEncoder as getStructEncoder14
} from "@solana/kit";
function getScaledUiAmountConfigArgsEncoder() {
  return getStructEncoder14([
    ["authority", getAddressEncoder4()],
    ["multiplier", fixEncoderSize5(getBytesEncoder5(), 8)],
    ["newMultiplierEffectiveTimestamp", getI64Encoder()],
    ["newMultiplier", fixEncoderSize5(getBytesEncoder5(), 8)]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/splitArgs.ts
import {
  combineCodec as combineCodec16,
  getStructDecoder as getStructDecoder15,
  getStructEncoder as getStructEncoder15,
  getU64Decoder as getU64Decoder9,
  getU64Encoder as getU64Encoder9
} from "@solana/kit";
function getSplitArgsEncoder() {
  return getStructEncoder15([["actionId", getU64Encoder9()]]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/tokenMetadataArgs.ts
import {
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  combineCodec as combineCodec17,
  getBytesDecoder as getBytesDecoder6,
  getBytesEncoder as getBytesEncoder6,
  getStructDecoder as getStructDecoder16,
  getStructEncoder as getStructEncoder16,
  getU32Decoder as getU32Decoder2,
  getU32Encoder as getU32Encoder2,
  getUtf8Decoder,
  getUtf8Encoder
} from "@solana/kit";
function getTokenMetadataArgsEncoder() {
  return getStructEncoder16([
    ["name", addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder2())],
    ["symbol", addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder2())],
    ["uri", addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder2())],
    [
      "additionalMetadata",
      addEncoderSizePrefix(getBytesEncoder6(), getU32Encoder2())
    ]
  ]);
}

// ../lib/canonical-ssts/clients/typescript/src/generated/types/trimVerificationConfigArgs.ts
import {
  combineCodec as combineCodec18,
  getBooleanDecoder as getBooleanDecoder2,
  getBooleanEncoder as getBooleanEncoder2,
  getStructDecoder as getStructDecoder17,
  getStructEncoder as getStructEncoder17,
  getU8Decoder as getU8Decoder4,
  getU8Encoder as getU8Encoder5
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateMetadataArgs.ts
import {
  combineCodec as combineCodec19,
  getStructDecoder as getStructDecoder18,
  getStructEncoder as getStructEncoder18
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateProofArgs.ts
import {
  combineCodec as combineCodec20,
  fixDecoderSize as fixDecoderSize6,
  fixEncoderSize as fixEncoderSize6,
  getBytesDecoder as getBytesDecoder7,
  getBytesEncoder as getBytesEncoder7,
  getStructDecoder as getStructDecoder19,
  getStructEncoder as getStructEncoder19,
  getU32Decoder as getU32Decoder3,
  getU32Encoder as getU32Encoder3,
  getU64Decoder as getU64Decoder10,
  getU64Encoder as getU64Encoder10
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateRateArgs.ts
import {
  combineCodec as combineCodec21,
  getStructDecoder as getStructDecoder20,
  getStructEncoder as getStructEncoder20,
  getU64Decoder as getU64Decoder11,
  getU64Encoder as getU64Encoder11
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/updateVerificationConfigArgs.ts
import {
  combineCodec as combineCodec22,
  getAddressDecoder as getAddressDecoder5,
  getAddressEncoder as getAddressEncoder5,
  getArrayDecoder as getArrayDecoder5,
  getArrayEncoder as getArrayEncoder5,
  getBooleanDecoder as getBooleanDecoder3,
  getBooleanEncoder as getBooleanEncoder3,
  getStructDecoder as getStructDecoder21,
  getStructEncoder as getStructEncoder21,
  getU8Decoder as getU8Decoder5,
  getU8Encoder as getU8Encoder6
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/types/verifyArgs.ts
import {
  addDecoderSizePrefix as addDecoderSizePrefix2,
  addEncoderSizePrefix as addEncoderSizePrefix2,
  combineCodec as combineCodec23,
  getBytesDecoder as getBytesDecoder8,
  getBytesEncoder as getBytesEncoder8,
  getStructDecoder as getStructDecoder22,
  getStructEncoder as getStructEncoder22,
  getU32Decoder as getU32Decoder4,
  getU32Encoder as getU32Encoder4,
  getU8Decoder as getU8Decoder6,
  getU8Encoder as getU8Encoder7
} from "@solana/kit";

// ../lib/canonical-ssts/clients/typescript/src/generated/instructions/initializeMint.ts
var INITIALIZE_MINT_DISCRIMINATOR = 0;
function getInitializeMintInstructionDataEncoder() {
  return transformEncoder(
    getStructEncoder23([
      ["discriminator", getU8Encoder8()],
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
import {
  combineCodec as combineCodec25,
  getStructDecoder as getStructDecoder24,
  getStructEncoder as getStructEncoder24,
  getU8Decoder as getU8Decoder8,
  getU8Encoder as getU8Encoder9,
  transformEncoder as transformEncoder2
} from "@solana/kit";
var INITIALIZE_VERIFICATION_CONFIG_DISCRIMINATOR = 2;
function getInitializeVerificationConfigInstructionDataEncoder() {
  return transformEncoder2(
    getStructEncoder24([
      ["discriminator", getU8Encoder9()],
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
import {
  combineCodec as combineCodec26,
  getStructDecoder as getStructDecoder25,
  getStructEncoder as getStructEncoder25,
  getU64Decoder as getU64Decoder12,
  getU64Encoder as getU64Encoder12,
  getU8Decoder as getU8Decoder9,
  getU8Encoder as getU8Encoder10,
  transformEncoder as transformEncoder3
} from "@solana/kit";
var MINT_DISCRIMINATOR = 6;
function getMintInstructionDataEncoder() {
  return transformEncoder3(
    getStructEncoder25([
      ["discriminator", getU8Encoder10()],
      ["amount", getU64Encoder12()]
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
import {
  combineCodec as combineCodec27,
  getStructDecoder as getStructDecoder26,
  getStructEncoder as getStructEncoder26,
  getU64Decoder as getU64Decoder13,
  getU64Encoder as getU64Encoder13,
  getU8Decoder as getU8Decoder10,
  getU8Encoder as getU8Encoder11,
  transformEncoder as transformEncoder4
} from "@solana/kit";
var TRANSFER_DISCRIMINATOR = 12;
function getTransferInstructionDataEncoder() {
  return transformEncoder4(
    getStructEncoder26([
      ["discriminator", getU8Encoder11()],
      ["amount", getU64Encoder13()]
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
import {
  combineCodec as combineCodec28,
  getStructDecoder as getStructDecoder27,
  getStructEncoder as getStructEncoder27,
  getU8Decoder as getU8Decoder11,
  getU8Encoder as getU8Encoder12,
  transformEncoder as transformEncoder5
} from "@solana/kit";
var PAUSE_DISCRIMINATOR = 8;
function getPauseInstructionDataEncoder() {
  return transformEncoder5(
    getStructEncoder27([["discriminator", getU8Encoder12()]]),
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
import {
  combineCodec as combineCodec29,
  getStructDecoder as getStructDecoder28,
  getStructEncoder as getStructEncoder28,
  getU8Decoder as getU8Decoder12,
  getU8Encoder as getU8Encoder13,
  transformEncoder as transformEncoder6
} from "@solana/kit";
var RESUME_DISCRIMINATOR = 9;
function getResumeInstructionDataEncoder() {
  return transformEncoder6(
    getStructEncoder28([["discriminator", getU8Encoder13()]]),
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
import {
  combineCodec as combineCodec30,
  getStructDecoder as getStructDecoder29,
  getStructEncoder as getStructEncoder29,
  getU8Decoder as getU8Decoder13,
  getU8Encoder as getU8Encoder14,
  transformEncoder as transformEncoder7
} from "@solana/kit";
var FREEZE_DISCRIMINATOR = 10;
function getFreezeInstructionDataEncoder() {
  return transformEncoder7(
    getStructEncoder29([["discriminator", getU8Encoder14()]]),
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
import {
  combineCodec as combineCodec31,
  getStructDecoder as getStructDecoder30,
  getStructEncoder as getStructEncoder30,
  getU8Decoder as getU8Decoder14,
  getU8Encoder as getU8Encoder15,
  transformEncoder as transformEncoder8
} from "@solana/kit";
var THAW_DISCRIMINATOR = 11;
function getThawInstructionDataEncoder() {
  return transformEncoder8(
    getStructEncoder30([["discriminator", getU8Encoder15()]]),
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
import {
  combineCodec as combineCodec32,
  getStructDecoder as getStructDecoder31,
  getStructEncoder as getStructEncoder31,
  getU8Decoder as getU8Decoder15,
  getU8Encoder as getU8Encoder16,
  transformEncoder as transformEncoder9
} from "@solana/kit";
var CREATE_DISTRIBUTION_ESCROW_DISCRIMINATOR = 20;
function getCreateDistributionEscrowInstructionDataEncoder() {
  return transformEncoder9(
    getStructEncoder31([
      ["discriminator", getU8Encoder16()],
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
import {
  combineCodec as combineCodec33,
  getStructDecoder as getStructDecoder32,
  getStructEncoder as getStructEncoder32,
  getU8Decoder as getU8Decoder16,
  getU8Encoder as getU8Encoder17,
  transformEncoder as transformEncoder10
} from "@solana/kit";
var CLAIM_DISTRIBUTION_DISCRIMINATOR = 21;
function getClaimDistributionInstructionDataEncoder() {
  return transformEncoder10(
    getStructEncoder32([
      ["discriminator", getU8Encoder17()],
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
import {
  combineCodec as combineCodec34,
  getStructDecoder as getStructDecoder33,
  getStructEncoder as getStructEncoder33,
  getU8Decoder as getU8Decoder17,
  getU8Encoder as getU8Encoder18,
  transformEncoder as transformEncoder11
} from "@solana/kit";
var CREATE_PROOF_ACCOUNT_DISCRIMINATOR = 18;
function getCreateProofAccountInstructionDataEncoder() {
  return transformEncoder11(
    getStructEncoder33([
      ["discriminator", getU8Encoder18()],
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
import {
  combineCodec as combineCodec35,
  getStructDecoder as getStructDecoder34,
  getStructEncoder as getStructEncoder34,
  getU8Decoder as getU8Decoder18,
  getU8Encoder as getU8Encoder19,
  transformEncoder as transformEncoder12
} from "@solana/kit";
var SPLIT_DISCRIMINATOR = 16;
function getSplitInstructionDataEncoder() {
  return transformEncoder12(
    getStructEncoder34([
      ["discriminator", getU8Encoder19()],
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
import {
  combineCodec as combineCodec36,
  getStructDecoder as getStructDecoder35,
  getStructEncoder as getStructEncoder35,
  getU8Decoder as getU8Decoder19,
  getU8Encoder as getU8Encoder20,
  transformEncoder as transformEncoder13
} from "@solana/kit";
var CONVERT_DISCRIMINATOR = 17;
function getConvertInstructionDataEncoder() {
  return transformEncoder13(
    getStructEncoder35([
      ["discriminator", getU8Encoder20()],
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
import {
  getProgramDerivedAddress
} from "@solana/kit";

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
  return getProgramDerivedAddress({
    programAddress,
    seeds: [
      VERIFICATION_CONFIG_SEED,
      mint,
      new Uint8Array([instructionDiscriminator])
    ]
  });
}
async function deriveMintAuthorityPda(mint, creator, programAddress = SSTS_PROGRAM_ID) {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ["mint_authority", mint, creator]
  });
}
async function deriveRateAccountPda(mint, actionId, programAddress = SSTS_PROGRAM_ID) {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ["rate", mint, actionId]
  });
}
async function deriveProofAccountPda(mint, claimant, programAddress = SSTS_PROGRAM_ID) {
  return getProgramDerivedAddress({
    programAddress,
    seeds: ["proof", mint, claimant]
  });
}
async function deriveFampPolicyPda(mint, programAddress = FAMP_PROGRAM_ID) {
  return getProgramDerivedAddress({
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
import {
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signAndSendTransactionMessageWithSigners,
  assertIsBlockhash,
  getBase58Codec
} from "@solana/kit";
function buildTransaction(feePayer, instructions, latestBlockhash) {
  assertIsBlockhash(latestBlockhash.blockhash);
  const blockhashObj = {
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
  };
  return setTransactionMessageFeePayerSigner(
    feePayer,
    setTransactionMessageLifetimeUsingBlockhash(
      blockhashObj,
      appendTransactionMessageInstructions(
        instructions,
        createTransactionMessage({ version: 0 })
      )
    )
  );
}
async function sendSstsTransaction(rpc, rpcSubscriptions, feePayer, instructions, workflow) {
  try {
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    const transactionMessage = setTransactionMessageFeePayerSigner(
      feePayer,
      setTransactionMessageLifetimeUsingBlockhash(
        latestBlockhash,
        appendTransactionMessageInstructions(
          instructions,
          createTransactionMessage({ version: 0 })
        )
      )
    );
    const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage);
    const base58 = getBase58Codec();
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
export {
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
};
