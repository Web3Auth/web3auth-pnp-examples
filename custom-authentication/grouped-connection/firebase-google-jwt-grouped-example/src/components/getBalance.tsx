import { useAccount, useBalance } from "wagmi";

export function Balance() {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
  });

  return (
    <div className="flex-container">
      <div>
        <button className="card">
          Get Balance: {data?.formatted} {data?.symbol}
        </button>
      </div>
    </div>
  );
} 