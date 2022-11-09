const { Web3Auth } = require("@web3auth/node-sdk");

const web3auth = new Web3Auth({
  clientId: "BHr_dKcxC0ecKn_2dZQmQeNdjPgWykMkcodEHkVvPMo71qzOV6SgtoN8KCvFdLN7bf34JOm89vWQMLFmSfIo84A", // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
  },
});

web3auth.init({ network: "testnet" });

const connect = async () => {
  const provider = await web3auth.connect({
    verifier: "verifier-name", // replace with your verifier name
    verifierId: "verifier-Id", // replace with your verifier id, setup while creating the verifier on Web3Auth's Dashboard
    idToken: "JWT Token", // replace with your newly created unused JWT Token.
  });
  const eth_private_key = await provider.request({ method: "eth_private_key" })
  console.log("ETH Private Key", eth_private_key);
}
connect();
