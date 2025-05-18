import { useSolanaWallet } from "@web3auth/modal/react/solana";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

export function Balance() {
  const { accounts, connection } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (connection && accounts && accounts.length > 0) {
      try {
        setIsLoading(true);
        setError(null);
        const publicKey = new PublicKey(accounts[0]);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [connection, accounts]);

  return (
    <div>
      <h2>Balance</h2>
      <div>
        {balance !== null && `${balance / LAMPORTS_PER_SOL} SOL`} 
      </div>
        {isLoading && <span className="loading">Loading...</span>}
        {error && <span className="error">Error: {error}</span>}
      <button onClick={fetchBalance} type="submit" className="card">
          Fetch Balance
      </button>
    </div>
  )
}