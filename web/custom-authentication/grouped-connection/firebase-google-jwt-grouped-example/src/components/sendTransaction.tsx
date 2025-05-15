import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";

export function SendTransaction() {
  const { address } = useAccount();
  const [to, setTo] = useState<string>(address || "");
  const [amount, setAmount] = useState<string>("0.001");

  const { data: hash, sendTransaction } = useSendTransaction();
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendTransaction({
      to: to,
      value: BigInt(parseFloat(amount) * 10 ** 18),
    });
  }
  
  return (
    <div className="flex-container">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            placeholder="Receiver address"
            onChange={(e) => setTo(e.target.value)}
            value={to}
            className="card"
          />
          <input
            placeholder="Amount in ETH"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            className="card"
          />
          <button type="submit" className="card">
            Send Transaction
          </button>
        </div>
      </form>
      <div>
        {isLoading && <div>Confirming...</div>}
        {isSuccess && (
          <div>
            Successfully sent {amount} ETH to {to}
            <div>
              <a href={`https://polygonscan.com/tx/${hash}`} target="_blank" rel="noreferrer">
                View on Polygonscan
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 