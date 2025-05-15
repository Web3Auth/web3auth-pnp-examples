import { useSwitchChain } from "wagmi";

export function SwitchChain() {
  const { chains, switchChain } = useSwitchChain();
  
  return (
    <div className="flex-container">
      {chains.map((chain) => (
        <div key={chain.id}>
          <button
            onClick={() => switchChain({ chainId: chain.id })}
            className="card"
          >
            Switch to {chain.name}
          </button>
        </div>
      ))}
    </div>
  );
} 