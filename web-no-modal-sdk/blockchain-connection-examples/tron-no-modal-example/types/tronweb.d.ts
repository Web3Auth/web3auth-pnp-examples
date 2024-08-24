// File: tronweb.d.ts
declare module 'tronweb' {
    class TronWeb {
      constructor(options: {
        fullHost: string;
        privateKey?: string;
      });
  
      defaultAddress: {
        base58: string;
        hex: string;
      };
  
      trx: {
        getBalance(address: string): Promise<number>;
        sign(transaction: any): Promise<any>;
        sendRawTransaction(signedTransaction: any): Promise<any>;
      };
  
      transactionBuilder: {
        sendTrx(to: string, amount: number, from: string): Promise<any>;
      };
  
      fromSun(sun: number): string;
      toHex(message: string): string;
    }
  
    export default TronWeb;
  }