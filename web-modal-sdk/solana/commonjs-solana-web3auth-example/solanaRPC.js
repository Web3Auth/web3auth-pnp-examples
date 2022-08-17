const rpc = (() => {

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */

  const getAccounts = async (provider) => {
      const solanaWallet = new SolanaProvider.SolanaWallet(provider);

      // Get user's Solana public address
      const accounts = await solanaWallet.requestAccounts();

      return accounts;
  };

  const getBalance = async (provider) => {
      const solanaWallet = new SolanaProvider.SolanaWallet(provider);

      // Get user's Solana public address
      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
      });
      const connection = new Connection(connectionConfig.rpcTarget);

      // Fetch the balance for the specified public key
      const balance = await connection.getBalance(new PublicKey(accounts[0]));

      return balance;
  };


  const signTransaction = async (provider) => {
      const solanaWallet = new SolanaProvider.SolanaWallet(provider);

      // Get user's Solana public address
      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
      });
      const connection = new Connection(connectionConfig.rpcTarget);

      const blockhash = (await connection.getRecentBlockhash("finalized")).blockhash;
      const TransactionInstruction = SystemProgram.transfer({
          fromPubkey: new solanaWallet.PublicKey(accounts[0]),
          toPubkey: new solanaWallet.PublicKey("oWvBmHCj6m8ZWtypYko8cRVVnn7jQRpSZjKpYBeESxu"),
          lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(accounts[0]) }).add(TransactionInstruction);

      const signedTx = await solanaWallet.signTransaction(transaction);
      return signedTx.signature;
  };


  const signMessage = async (provider) => {
      const solanaWallet = new SolanaProvider.SolanaWallet(provider);

      const msg = Buffer.from("Test Signing Message ", "utf8");

      const result = await solanaWallet.signMessage(msg);
      return result
  };

  const getPrivateKey = async (provider) => {
      const privateKey = await provider.request({
          method: "solanaPrivateKey"
      });

      return privateKey;
  }

  return {
      getAccounts,
      getBalance,
      signTransaction,
      signMessage,
      signTransaction,
      getPrivateKey
  }
})()