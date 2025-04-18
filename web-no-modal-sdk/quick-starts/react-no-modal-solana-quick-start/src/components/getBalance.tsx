
import { useSolanaWallet } from "@web3auth/no-modal/react/solana";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { CustomChainConfig } from "@web3auth/no-modal/";
import { useEffect, useState } from "react";

export function Balance() {
  const { accounts, solanaWallet } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (solanaWallet) {
        const config = await solanaWallet.request<string[], CustomChainConfig>({
          method: "solana_provider_config",
          params: [],
        });
        const conn = new Connection(config.rpcTarget);
        const balance = await conn.getBalance(new PublicKey(accounts![0]));
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [solanaWallet]);


  return (
    <div>
      <h2>Balance</h2>

      <div>Balance: {balance !== null ? `${balance / LAMPORTS_PER_SOL} SOL` : 'Loading...'}</div>
    </div>
  )
}