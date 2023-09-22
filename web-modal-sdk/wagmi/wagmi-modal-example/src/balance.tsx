import { useState } from 'react'
import { useAccount, useBalance, Address } from "wagmi";

const AccountBalance = () => {
  const { address } = useAccount()
  const { data, refetch } = useBalance({
    address,
    watch: true,
  })

  return (
    <div>
      {data?.formatted}
      <button className="card" onClick={() => refetch()}>fetch</button>
    </div>
  )
}

const FindBalance = () => {
  const [address, setAddress] = useState('')
  const { data, isLoading, refetch } = useBalance({
    address: address as Address,
  })

  const [value, setValue] = useState('')

  return (
    <div>
      Find balance:{' '}
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        value={value}
      />
      <button
        className="card" 
        onClick={() => (value === address ? refetch() : setAddress(value))}
      >
        {isLoading ? 'fetching...' : 'fetch'}
      </button>
      <div>{data?.formatted}</div>
    </div>
  )
}

export const Balance = () => {
  return (
    <div>
      <div>
        <AccountBalance />
      </div>
      <div>
        <FindBalance />
      </div>
    </div>
  )
}