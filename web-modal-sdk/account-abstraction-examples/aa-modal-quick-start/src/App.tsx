import "./App.css";

import { IProvider, Web3Auth, WEB3AUTH_NETWORK, Web3AuthOptions } from "@web3auth/modal";
import { useEffect, useState } from "react";


import RPC from "./ethersRPC";
import { parseAbi } from "viem";

const clientId = "BJGOPAjv_1yJTYfmZfmHZqge71eHId9B1H6RXNNPznkw5Gu9AAamCxioL2ZN04_uZuIAZfFYMOSz4URX46OibJM"; // get from https://dashboard.web3auth.io

const pimlicoAPIKey = import.meta.env.VITE_API_KEY;

// Pimlico's ERC-20 Paymaster address
const pimlicoPaymasterAddress = "0x777777777777AeC03fd955926DbF81597e66834C";
// USDC address on Ethereum Sepolia
const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  authBuildEnv: 'testing',
  defaultChainId: "0x14a34",
  accountAbstractionConfig: {
    smartAccountType: "metamask",
    chains: [
      {
        chainId: "0x14a34",
        bundlerConfig: {
          url: `https://api.pimlico.io/v2/84532/rpc?apikey=${pimlicoAPIKey}`,
          paymasterContext: {
            token: usdcAddress,
          }
        },
        paymasterConfig: {
          url: `https://api.pimlico.io/v2/84532/rpc?apikey=${pimlicoAPIKey}`,
        }
      },
    ],
  },
}

const web3auth = new Web3Auth(web3AuthOptions);

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const init = async () => {
      try {
        await web3auth.initModal({ signal: controller.signal });
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();

    return () => {
      controller.abort();
    };
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };


  const getAccounts = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const { smartAccount } = web3auth.accountAbstractionProvider || {};
    if (!smartAccount) {
      const address = await RPC.getAccounts(provider);
      uiConsole(address);
      return;
    }
    const address = await smartAccount?.getAddress();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const { smartAccount } = web3auth.accountAbstractionProvider || {};
    const signedMessage = await smartAccount?.signMessage({ message: "YOUR_MESSAGE" });
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const amount = 10000000000000n;
    const { smartAccount, bundlerClient } = web3auth.accountAbstractionProvider || {};
    if (!smartAccount || !bundlerClient) {
      uiConsole("Smart account or bundler client is not initialized yet");
      return;
    }
    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [
        {
          to: smartAccount.address,
          value: amount,
          data: "0x",
        },
      ],
    });

    // Retrieve user operation receipt
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    const transactionHash = receipt.receipt.transactionHash;
    uiConsole(transactionHash);
  };

  const sendBatchTransaction = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const amount = 10000000000000n;
    const { smartAccount, bundlerClient } = web3auth.accountAbstractionProvider || {};
    if (!smartAccount || !bundlerClient) {
      uiConsole("Smart account or bundler client is not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [
        {
          to: smartAccount.address,
          value: amount,
          data: "0x",
        },
        {
          to: smartAccount.address,
          value: amount,
          data: "0x",
        },
      ],
    });

    // Retrieve user operation receipt
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    const transactionHash = receipt.receipt.transactionHash;
    uiConsole(transactionHash);
  };

  const sendERC20PaymasterSponsoredTransaction = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const { smartAccount, bundlerClient } = web3auth.accountAbstractionProvider || {};
    if (!smartAccount || !bundlerClient) {
      uiConsole("Smart account or bundler client is not initialized yet");
      return;
    }

    uiConsole("Sending Transaction...");
    // const amount = 10000000000000n;
    // 10 USDC in WEI format. Since USDC has 6 decimals, 10 * 10^6
    const approvalAmount = 10000000n;

    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [
        {
          to: usdcAddress,
          abi: parseAbi(["function approve(address,uint)"]),
          functionName: "approve",
          args: [pimlicoPaymasterAddress, approvalAmount],
        },
        {
          to: "0xFd9FD1E47D4371595bC2705c6Fcea6a1b146c583",
          // value: amount,
          data: "0x",
        },
        {
          to: "0xFd9FD1E47D4371595bC2705c6Fcea6a1b146c583",
          // value: amount,
          data: "0x",
        },
      ],
    });

    // Retrieve user operation receipt
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    const transactionHash = receipt.receipt.transactionHash;
    uiConsole(transactionHash);
  };

  const signTransaction = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const { smartAccount, bundlerClient } = web3auth.accountAbstractionProvider || {};
    if (!smartAccount || !bundlerClient) {
      uiConsole("Smart account or bundler client is not initialized yet");
      return;
    }

    uiConsole("Signing Transaction...");

    // Sign the transaction
    const request = await bundlerClient.prepareUserOperation({
      account: smartAccount,
      calls: [
        {
          to: "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56",
          value: BigInt(1000n),
          data: "0x",
        },
      ],
    });
    const signature = await smartAccount.signUserOperation({
      callData: request.callData,
      callGasLimit: request.callGasLimit,
      maxFeePerGas: request.maxFeePerGas,
      maxPriorityFeePerGas: request.maxPriorityFeePerGas,
      nonce: request.nonce,
      preVerificationGas: request.preVerificationGas,
      verificationGasLimit: request.verificationGasLimit,
      signature: request.signature,
    });
    uiConsole(signature);
  };

  function uiConsole(...args: unknown[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={signTransaction} className="card">
            Sign Transaction
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={sendBatchTransaction} className="card">
            Send Batch Transaction
          </button>
        </div>
        <div>
          <button onClick={sendERC20PaymasterSponsoredTransaction} className="card">
            Send ERC20-paymaster-sponsored Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & AA React Quick Start
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/account-abstraction/aa-modal-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
