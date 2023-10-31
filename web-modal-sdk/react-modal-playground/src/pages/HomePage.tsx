import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function HomePage() {
  const { provider, address, balance, chainDetails } = useWeb3Auth();
  const formDetails = [
    {
      label: "Address",
      input: address as string,
      readOnly: true,
    },
    {
      label: "Balance",
      input: `${balance} ETH`,
      readOnly: true,
    },
    {
      label: "Chain details",
      input: chainDetails,
      readOnly: true,
    },
  ];
  const faucetDetails = (
    <span>
      To use this playground, you need to have some Goerli ETH in your account. You can get some from the following Faucets:
      <ul>
        <li>
          <a href="https://faucet.quicknode.com/ethereum/goerli" target="_blank" className="text-primary">
            Quicknode Faucet
          </a>
        </li>
        <li>
          <a href="https://goerlifaucet.com/" target="_blank" className="text-primary">
            Alchemy Faucet
          </a>
        </li>
        <li>
          <a href="https://faucet.goerli.starknet.io/" target="_blank" className="text-primary">
            Starknet Faucet (For L2 Goerli)
          </a>
        </li>
      </ul>
    </span>
  );

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start ">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">
              Welcome to Web3Auth StarkEx Playground
            </h1>
            <div className="py-16 w-11/12 ">
              <Form heading="Your Account Details" formDetails={formDetails} children={faucetDetails} />
            </div>
          </div>
        ) : (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
            <h1 className="text-2xl font-bold text-center sm:text-3xl">Welcome to Web3Auth StarkEx Playground</h1>
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please connect to Web3Auth to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
