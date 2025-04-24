import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function Balance() {
  const { address } = useAccount();
  const { data, isLoading, error } = useBalance({
    address,
  });

  return (
    <div className="flex-container">
      <div>
        <button className="card">
          Get Balance: {data?.value !== undefined && `${formatUnits(data.value, data.decimals)} ${data.symbol}`}
          {isLoading && <span className="loading"> Loading...</span>}
          {error && <span className="error"> Error: {error.message}</span>}
        </button>
      </div>
    </div>
  );
} 