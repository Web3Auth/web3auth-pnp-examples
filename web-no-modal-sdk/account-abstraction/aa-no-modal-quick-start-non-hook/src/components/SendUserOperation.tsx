import { type FormEvent, useState } from "react";
import { type IProvider } from "@web3auth/no-modal";
import RPC from "../ethersRPC";

interface SendUserOperationProps {
  provider: IProvider | null;
}

export function SendUserOperation({ provider }: SendUserOperationProps) {
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!provider) {
      setError("Provider is not initialized yet");
      return;
    }

    try {
      setIsPending(true);
      setError("");
      const formData = new FormData(e.currentTarget);
      const destination = formData.get("address") as string;
      const amount = formData.get("value") as string;
      const receipt = await RPC.sendTransaction(provider, destination, amount);
      setHash(receipt.hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <h2>Send Transaction</h2>
      <form onSubmit={submit}>
          <input name="address" placeholder="Address" required />
          <input
            name="value"
            placeholder="Amount (ETH)"
            type="number"
            step="0.000000001"
            required
          />
        <button disabled={isPending} type="submit">
          {isPending ? "Confirming..." : "Send"}
        </button>
      </form>
      {hash && <div>Transaction Hash: {hash}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
} 