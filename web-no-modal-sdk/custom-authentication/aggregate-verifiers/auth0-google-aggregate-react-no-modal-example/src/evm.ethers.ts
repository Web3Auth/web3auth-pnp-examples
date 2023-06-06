import type {SafeEventEmitterProvider} from '@web3auth/base'
import {ethers} from 'ethers'

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider
  }

  async getAccounts(): Promise<string> {
    try {
      const provider = new ethers.BrowserProvider(this.provider as any)
      const signer = provider.getSigner()
      const { address } = await signer;
      return address
    } catch (error: unknown) {
      return error as string
    }
  }

  async getBalance(): Promise<string> {
    try {
      const provider = new ethers.BrowserProvider(this.provider as any)
      const signer = provider.getSigner()
      const { address } = await signer;
      // Get user's balance in ether
      const balance = ethers.formatEther(
        await provider.getBalance(address), // Balance is in wei
      )
      return balance
    } catch (error) {
      return error as string
    }
  }

  async signMessage(): Promise<string> {
    try {
      const provider = new ethers.BrowserProvider(this.provider as any)
      const signer = provider.getSigner()

      const originalMessage = 'YOUR_MESSAGE'

      const signedMessage = await (await signer).signMessage(originalMessage)
      return signedMessage
    } catch (error) {
      return error as string
    }
  }

  async signAndSendTransaction(): Promise<any> {
    try {
      const provider = new ethers.BrowserProvider(this.provider as any)
      const signer = provider.getSigner()
      const { address } = await signer;

      const tx = await (await signer).sendTransaction({
        to: address,
        value: ethers.parseEther('0.0001'),
      })
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      return error as undefined
    }
  }
}
