import { IAdapter } from "@web3auth/base";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { useEffect, useState, createContext } from "react";

export const Web3AuthContext = createContext<Web3Auth| null>(null);

interface Web3AuthProviderProps  {
  children: React.ReactElement;
  web3AuthOptions: Web3AuthOptions;
  adapters?: IAdapter<unknown>[];
}

export default function Web3AuthProvider({children, web3AuthOptions, adapters = [] }: Web3AuthProviderProps) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  
  useEffect(() => {
      const web3auth = new Web3Auth(web3AuthOptions);
      adapters.map(adapter => web3auth.configureAdapter(adapter))
      setWeb3auth(web3auth)
    }, [])

    return (
      <Web3AuthContext.Provider value={web3auth}>
        {children}
      </Web3AuthContext.Provider>
    )
}
