import { FormEvent } from "react";
import { useSolanaWallet, useSignAndSendTransaction } from "@web3auth/no-modal/react/solana";
import { CustomChainConfig } from "@web3auth/no-modal";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SendTransaction() {
  const { data: hash, error, loading: isPending, signAndSendTransaction } = useSignAndSendTransaction();
  const { accounts, solanaWallet } = useSolanaWallet();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const to = formData.get('address') as string
    const value = formData.get('value') as string

    const connectionConfig = await solanaWallet!.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
    const conn = new Connection(connectionConfig.rpcTarget);
    const block = await conn.getLatestBlockhash("finalized");
    const TransactionInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(accounts![0]),
      toPubkey: new PublicKey(to),
      lamports: Number(value) * LAMPORTS_PER_SOL,
    });

    const transaction = new Transaction({
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
      feePayer: new PublicKey(accounts![0]),
    }).add(TransactionInstruction);
    
    signAndSendTransaction(transaction);
  }


  return (
    <div>
      <h2>Send Transaction</h2>
      <form onSubmit={submit}>
        <input name="address" placeholder="Address" required />
        <input
          name="value"
          placeholder="Amount (SOL)"
          type="number"
          step="0.01"
          required
        />
        <button disabled={isPending} type="submit" className="card">
          {isPending ? 'Confirming...' : 'Send'}
        </button>
      </form>
      {hash && <div>Transaction Hash: {hash}</div>}
      {error && (
        <div>Error: {error.message}</div>
      )}
    </div>
  )
}