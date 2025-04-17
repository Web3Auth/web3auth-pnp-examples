import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function Balance() {
  const { address } = useAccount()

  const { data: default_ } = useBalance({ address })

  return (
    <div>
      <h2>Balance</h2>

      <div>Balance: {default_?.value !== undefined ? `${formatUnits(default_.value, default_.decimals)} ${default_.symbol}` : 'Loading...'}</div>
    </div>
  )
}