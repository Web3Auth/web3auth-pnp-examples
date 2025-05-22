import { FormEvent } from "react";
import { useSolanaWallet, useSignTransaction } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SignTransaction() {
  const { data: signedTransaction, error, loading: isPending, signTransaction,
  } = useSignTransaction();
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

    const transaction = new Transaction({
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
      feePayer: new PublicKey(accounts![0]),
    }).add(TransactionInstruction);
    
    signTransaction(transaction);
  }


  return (
    <div>
      <h2>Sign Transaction</h2>
      <form onSubmit={submit}>
        <input name="address" placeholder="Address" required />
        <input
          name="value"
          placeholder="Amount (SOL)"
          type="number"
          step="0.01"
          required
        />
        <button disabled={isPending} type="submit" >
          {isPending ? 'Signing...' : 'Sign'}
        </button>
      </form>
      {signedTransaction && <div>Signed Trasaction: {signedTransaction}</div>}
      {error && (
        <div>Error: {error.message}</div>
      )}
    </div>
  )
}