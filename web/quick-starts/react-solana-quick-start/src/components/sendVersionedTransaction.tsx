import { FormEvent } from "react";
import { useSolanaWallet, useSignAndSendTransaction } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

export function SendVersionedTransaction() {
  const { data: hash, error, loading: isPending, signAndSendTransaction } = useSignAndSendTransaction();
  const { accounts, connection } = useSolanaWallet();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const to = formData.get('address') as string
    const value = formData.get('value') as string

    const block = await connection!.getLatestBlockhash();
    const TransactionInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(accounts![0]),
      toPubkey: new PublicKey(to),
      lamports: Number(value) * LAMPORTS_PER_SOL,
    });

    const transactionMessage = new TransactionMessage({
      recentBlockhash: block.blockhash,
      instructions: [TransactionInstruction],
      payerKey: new PublicKey(accounts![0]),
    });

    const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());
    signAndSendTransaction(transaction);
  }


  return (
    <div>
      <h2>Send Versioned Transaction</h2>
      <form onSubmit={submit}>
        <input name="address" placeholder="Address" required />
        <input
          name="value"
          placeholder="Amount (SOL)"
          type="number"
          step="0.01"
          required
        />
        <button disabled={isPending} type="submit">
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