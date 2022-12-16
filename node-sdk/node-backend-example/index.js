const { Web3Auth } = require("@web3auth/node-sdk");

const web3auth = new Web3Auth({
  clientId: "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk", // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
  },
});

web3auth.init({ network: "cyan" });

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
