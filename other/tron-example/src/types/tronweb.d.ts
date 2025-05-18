declare module 'tronweb' {
  export default class TronWeb {
    constructor(options: {
      fullHost: string;
      privateKey?: string;
    });
    
    address: {
      fromPrivateKey(privateKey: string): string;
    };
    
    trx: {
      getBalance(address: string): Promise<number>;
      sign(message: string, privateKey?: string): Promise<string>;
      sign(transaction: object, privateKey?: string): Promise<object>;
      sendRawTransaction(signedTransaction: object): Promise<object>;
    };
    
    transactionBuilder: {
      sendTrx(toAddress: string, amount: number, fromAddress: string): Promise<object>;
    };
    
    toHex(message: string): string;
    fromSun(sun: number): string;
  }
} 