import { useSolanaWallet } from "@web3auth/no-modal/react/solana";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

export function Balance() {
  const { accounts, connection } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    if (connection && accounts && accounts.length > 0) {
        const publicKey = new PublicKey(accounts[0]);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [connection, accounts]);

  return (
    <div>
      <h2>Balance</h2>

      <div>Balance: {balance !== null ? `${balance / LAMPORTS_PER_SOL} SOL` : 'NULL'}</div>
      <button onClick={fetchBalance} type="submit" className="card">
          Fetch Balance
      </button>
    </div>
  )
}