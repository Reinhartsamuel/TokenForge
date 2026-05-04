/**
 * Bridge between @solana/wallet-adapter (web3.js v1) and @tokenforge/sdk (@solana/kit v2)
 */

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  type Rpc,
  type SolanaRpcApi,
  type RpcSubscriptions,
  type SolanaRpcSubscriptionsApi,
  type TransactionSigner,
  type Address,
  generateKeyPairSigner,
} from "@solana/kit";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useMemo } from "react";

/**
 * Hook that provides the SDK-compatible RPC clients from the wallet adapter's connection.
 */
export function useSdkRpc(): {
  rpc: Rpc<SolanaRpcApi>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
} {
  const { connection } = useConnection();

  return useMemo(() => {
    const rpc = createSolanaRpc(connection.rpcEndpoint);
    const rpcSubscriptions = createSolanaRpcSubscriptions(
      connection.rpcEndpoint.replace("http", "ws")
    );
    return { rpc, rpcSubscriptions };
  }, [connection]);
}

/**
 * Hook that converts the wallet adapter's selected wallet
 * into an SDK-compatible TransactionSigner.
 */
export function useSdkSigner(): TransactionSigner | null {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  return useMemo(() => {
    if (!publicKey) return null;

    const address = publicKey.toBase58() as Address;

    return {
      address,
      signTransactions: async (transactions) => {
        if (!signTransaction) {
          throw new Error("Wallet does not support signing");
        }

        const signed = await Promise.all(
          transactions.map(async (tx) => {
            // Convert @solana/kit transaction to web3.js v1 transaction
            const web3Tx = new Transaction();
            web3Tx.recentBlockhash = (tx as any).recentBlockhash || "";
            web3Tx.feePayer = new PublicKey(address);

            const signedWeb3Tx = await signTransaction(web3Tx);
            return {
              ...tx,
              signatures: [
                {
                  publicKey: new PublicKey(address).toBytes(),
                  signature: signedWeb3Tx.signature || new Uint8Array(64),
                },
              ],
            };
          })
        );

        return signed;
      },
    } as TransactionSigner;
  }, [publicKey, signTransaction, signAllTransactions]);
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
