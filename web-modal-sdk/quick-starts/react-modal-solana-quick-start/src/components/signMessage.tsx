import { FormEvent } from "react";
import { useSignMessage } from "@web3auth/modal/react/solana";

export function SignMessage() {
  const { data: hash, error, loading: isPending, signMessage } = useSignMessage();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const message = formData.get('message')
    signMessage(message!.toString());
  }

  return (
    <div>
      <h2>Sign Message</h2>
      <form onSubmit={submit}>
        <input name="message" placeholder="Message" required />
        <button disabled={isPending} type="submit">
          {isPending ? 'Signing...' : 'Sign'}
        </button>
      </form>
      {hash && <div className="hash">Message Hash: {hash}</div>}
      {error && (
        <div className="error">Error: {error.message}</div>
      )}
    </div>
  )
}