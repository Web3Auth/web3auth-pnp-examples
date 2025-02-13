import { useWeb3Auth } from "@web3auth/modal-react-hooks";

const ConnectWeb3AuthButton = () => {
  const { isConnected, connect } = useWeb3Auth();

  if (isConnected) {
    return null;
  }
  return (
    <div
      className="flex flex-row rounded-full px-14 py-4 bg-primary text-black hover:bg-secondary justify-center align-center cursor-pointer"
      onClick={connect}
    >
      Connect to WLFI
    </div>
  );
};
export default ConnectWeb3AuthButton;
