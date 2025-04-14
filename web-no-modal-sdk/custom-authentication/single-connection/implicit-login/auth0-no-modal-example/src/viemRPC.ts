import { createWalletClient, createPublicClient, custom, formatEther, parseEther} from 'viem'
import { mainnet, polygonAmoy, sepolia } from 'viem/chains'

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";


export default class EthereumRpc {
    private provider: IProvider;
    
    private contractABI = [
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  getViewChain() {
    switch (this.provider.chainId) {
        case "1":
            return mainnet;
        case "0x13882":
            return polygonAmoy;
        case "0xaa36a7":
          return sepolia;
        default:
            return mainnet;
    }
  }

async getChainId(): Promise<any> {
    try {
        const walletClient = createWalletClient({
            transport: custom(this.provider)
          })
           
          const address = await walletClient.getAddresses()
          console.log(address)
          
        const chainId = await walletClient.getChainId()
        return chainId.toString();
    } catch (error) {
        return error;
    }
}

async getAddresses(): Promise<any> {
    try {
        const walletClient = createWalletClient({
            chain: this.getViewChain(),
            transport: custom(this.provider)
          });
           
        return  await walletClient.getAddresses();
    } catch (error) {
        return error;
    }
}
  async getAccounts(): Promise<any> {
    try {
        
        const address = this.getAddresses();
          
        return address;
    } catch (error) {
        return error;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const publicClient = createPublicClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        })
        
      const address = await this.getAccounts();
      const balance = await publicClient.getBalance({address: address[0]});
      console.log(balance)
      return formatEther(balance);
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const publicClient = createPublicClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        })

      const walletClient = createWalletClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        });
      
      // data for the transaction
      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
      const amount = parseEther("0.0001");
      const address =  await this.getAccounts();

      // Submit transaction to the blockchain
      const hash = await walletClient.sendTransaction({
          account: address[0],
          to: destination,
          value: amount,
        });
      console.log(hash)
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      

      return this.toObject(receipt); 
    } catch (error) {
      return error;
    }
  }

  async signMessage() {
    try {
      const walletClient = createWalletClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        });
      
      // data for signing
      const address =  await this.getAccounts();
      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const hash = await walletClient.signMessage({
          account: address[0],
          message: originalMessage
        });

      console.log(hash)

      return hash.toString(); 
    } catch (error) {
      return error;
    }
  }

  async readContract() {
    try {
      const publicClient = createPublicClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        })

      const number = await publicClient.readContract({ 
          address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
          abi: this.contractABI, 
          functionName: 'retrieve'
        }) 
        
      return this.toObject(number);
    } catch (error) {
      return error;
    }
  }

  async writeContract() {
    try {
      const publicClient = createPublicClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        })

      const walletClient = createWalletClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        });
      
      // data for writing to the contract
      const address =  await this.getAccounts();
      const randomNumber = Math.floor(Math.random() * 9000) + 1000;

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
          {
              account: address[0],
              address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
              abi: this.contractABI,
              functionName: 'store',
              args: [randomNumber]
          }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      

      return this.toObject(receipt); 
    } catch (error) {
      return error;
    }
  }

  toObject(data: any) {
    // can't serialize a BigInt so this hack
    return JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
  }

}
