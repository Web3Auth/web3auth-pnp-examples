import { useSwitchChain, useWeb3Auth } from '@web3auth/modal/react'

export function SwitchChain() {
  const { web3Auth } = useWeb3Auth();

  const { switchChain, error } = useSwitchChain()

  return (
    <div>
      <h2>Switch Chain</h2>
      <h3>Connected to {web3Auth?.currentChain?.displayName}</h3>
      {web3Auth?.coreOptions.chains?.map((chain) => {
        if (chain.chainId === "0x67" || chain.chainId === "0x66" || chain.chainId === "0x65") {
          return (
            <button
              disabled={web3Auth?.currentChain?.chainId === chain.chainId}
              key={chain.chainId}
              onClick={() => switchChain(chain.chainId)}
              type="button"
              className="card"
            >
              {chain.displayName}
            </button>
          )
        }
      })}

      {error?.message}
    </div>
  )
}