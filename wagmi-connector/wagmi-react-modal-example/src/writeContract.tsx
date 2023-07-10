import { useState } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'


export const WriteContract = () => {
  const [message, setMessage] = useState<string>('')

  //@ts-ignore
  const { config } = usePrepareContractWrite({
    address: '0xD65AF91Bbb4334711A598dFD293596E6dc2d8313',
    abi: [
      {
        name: 'update',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ internalType: 'string', name: 'message', type: 'string' }],
        outputs: [],
      },
    ],
    functionName: 'update',
    args: [message],
    enabled: Boolean(message),
  })

  const { write, data, error, isLoading, isError, isSuccess } =
    useContractWrite(config as any)


  return (
    <div>
      <div>Update Message</div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Updated Message"
          value={message}
        />
        <button
          disabled={isLoading}
          onClick={() =>
            write?.()
          }
        >
          Mint
        </button>
      </div>
      {isError && <div>{error?.message}</div>}
      {isSuccess && <div>Transaction hash: {data?.hash}</div>}
    </div>
  )
}
