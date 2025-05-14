import { useEffect, useState } from "react";
import RPC from "../ethersRPC";
import { IProvider } from "@web3auth/modal";

interface BalanceProps {
  provider: IProvider | null;
}

export function Balance({ provider }: BalanceProps) {
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const getBalance = async () => {
      if (!provider) return;
      const balance = await RPC.getBalance(provider);
      setBalance(balance);
    };
    getBalance();
  }, [provider]);

  return (
    <div>
      <h2>Balance</h2>
      <div>{balance || "Loading..."}</div>
    </div>
  );
} 