import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { CustomChainConfig, IProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
// import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

export default class SolanaRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  getAccounts = async (): Promise<string[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const acc = await solanaWallet.requestAccounts();
      return acc;
    } catch (error) {
      return error as string[];
    }
  };

  getBalance = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const accounts = await solanaWallet.requestAccounts();
      const balance = await conn.getBalance(new PublicKey(accounts[0]));
      return balance.toString();
    } catch (error) {
      return error as string;
    }
  };

  signMessage = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const msg = Buffer.from("Test Signing Message ", "hex");
      const res = await solanaWallet.signMessage(msg);
      return res.toString();
    } catch (error) {
      return error as string;
    }
  };

  sendTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);

      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const connection = new Connection(connectionConfig.rpcTarget);

      const block = await connection.getLatestBlockhash("finalized");

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(accounts[0]),
        toPubkey: new PublicKey(accounts[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transaction = new Transaction({
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
        feePayer: new PublicKey(accounts[0]),
      }).add(TransactionInstruction);

      const { signature } = await solanaWallet.signAndSendTransaction(
        transaction
      );

      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(pubKey[0]),
      }).add(TransactionInstruction);
      const signedTx = await solanaWallet.signTransaction(transaction);
      return signedTx.signature?.toString() || "";
    } catch (error) {
      return error as string;
    }
  };

  sendVersionTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getLatestBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transactionMessage = new TransactionMessage({
        recentBlockhash: blockhash,
        instructions: [TransactionInstruction],
        payerKey: new PublicKey(pubKey[0]),
      });
      const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());
      const { signature } = await solanaWallet.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signVersionedTransaction = async (): Promise<VersionedTransaction> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transactionMessage = new TransactionMessage({
        recentBlockhash: blockhash,
        instructions: [TransactionInstruction],
        payerKey: new PublicKey(pubKey[0]),
      });
      const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());

      const signedTx = await solanaWallet.signTransaction<VersionedTransaction>(transaction);
      return signedTx;
    } catch (error) {
      throw error;
    }
  };
  signAllTransaction = async (): Promise<Transaction[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const TransactionInstruction1 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.02 * LAMPORTS_PER_SOL,
      });
      const TransactionInstruction2 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.03 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(TransactionInstruction);
      const transaction1 = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(TransactionInstruction1);
      const transaction2 = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(TransactionInstruction2);

      const signedTx = await solanaWallet.signAllTransactions([transaction, transaction1, transaction2]);
      return signedTx;
    } catch (error) {
      throw error;
      // return error as string;
    }
  };


  signAllVersionedTransaction = async (): Promise<VersionedTransaction[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");


      const transactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transactionInstruction1 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.02 * LAMPORTS_PER_SOL,
      });
      const transactionInstruction2 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.03 * LAMPORTS_PER_SOL,
      });
      const transactionMessage = new TransactionMessage({ recentBlockhash: blockhash, payerKey: new PublicKey(pubKey[0]), instructions: [transactionInstruction] })
      const transactionMessage1 = new TransactionMessage({ recentBlockhash: blockhash, payerKey: new PublicKey(pubKey[0]), instructions: [transactionInstruction] })
      const transactionMessage2 = new TransactionMessage({ recentBlockhash: blockhash, payerKey: new PublicKey(pubKey[0]), instructions: [transactionInstruction] })
      const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());
      const transaction1 = new VersionedTransaction(transactionMessage1.compileToV0Message());
      const transaction2 = new VersionedTransaction(transactionMessage2.compileToV0Message());
      const signedTx = await solanaWallet.signAllTransactions([transaction, transaction1, transaction2]);
      console.log(signedTx);
      return signedTx;
    } catch (error) {
      throw error;
      // return error as string;
    }
  };

  // mintNFT = async (): Promise<string> => {
  //   const solanaWallet = new SolanaWallet(this.provider);
  //   const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
  //     method: "solana_provider_config",
  //     params: [],
  //   });
  //   const pubKey = await solanaWallet.requestAccounts();

  //   const connection = new Connection(connectionConfig.rpcTarget);
  //   const privateKey = await this.provider.request({
  //     method: "solanaPrivateKey",
  //   });
  //   const keypair = Keypair.fromSecretKey(Buffer.from(privateKey as string, "hex"));

  //   const metaplex = Metaplex.make(connection)
  //   .use(keypairIdentity(keypair));

  //   const imageBlob = await fetch("../public/image.png").then((response) => response.blob());
  //   const reader = new FileReader();
  //   reader.readAsDataURL(imageBlob);
  //   const metadataURI = await metaplex.nfts().uploadMetadata({
  //     name: "Helius NFT",
  //     description: "Helius NFT created in the SolanaDev 101 course",
  
  //     // Image: await uploadIMG(imageName),
  //     image: await new Promise<string>((resolve) => {
  //       reader.onloadend = () => {
  //         const base64data = reader.result?.toString().split(",")[1];
  //         resolve(base64data as string);
  //       };
  //     }),
  //     attributes: [
  //       { trait_type: "Test", value: "Yes" },
  //       { trait_type: "Logo", value: "Helius" },
  //     ],
  //   });

  //   const nft = await metaplex.nfts().create({
  //     uri: metadataURI as any,
  //     name: "Helius NFT",
  //     sellerFeeBasisPoints: 500, // 5%
  //     creators: [{ address: pubKey[0] as any, share: 100 }],
  //   });

  //   return("NFT:"+ nft.mintAddress.toBase58());
  // };

  getPrivateKey = async (): Promise<string> => {
    const privateKey = await this.provider.request({
      method: "solanaPrivateKey",
    });

    return privateKey as string;
  };
}
