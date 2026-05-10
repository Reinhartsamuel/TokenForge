/**
 * Bridge between @solana/wallet-adapter (web3.js v1) and @tokenforge/sdk (@solana/kit v2)
 * Provides RPC clients derived from the wallet adapter's connection.
 */

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createSolanaRpc,
  type Rpc,
  type SolanaRpcApi,
  type Address,
} from "@solana/kit";
import { useMemo } from "react";

/**
 * Hook that provides the SDK-compatible RPC client from the wallet adapter's connection.
 */
export function useSdkRpc(): {
  rpc: Rpc<SolanaRpcApi>;
} {
  const { connection } = useConnection();

  return useMemo(() => {
    const rpc = createSolanaRpc(connection.rpcEndpoint);
    return { rpc };
  }, [connection]);
}

/**
 * Hook that provides the wallet adapter's public key as an SDK Address.
 */
export function useWalletAddress(): Address | null {
  const { publicKey } = useWallet();

  return useMemo(() => {
    if (!publicKey) return null;
    return publicKey.toBase58() as Address;
  }, [publicKey]);
}
