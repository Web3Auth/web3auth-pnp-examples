import { useWeb3Auth } from "@web3auth/modal-react-hooks";

const DisconnectWeb3AuthButton = () => {
  const { isConnected, logout } = useWeb3Auth();

  if (isConnected) {
    return (
      <div
        className="flex flex-row rounded-full px-6 py-3 bg-primary text-black justify-center align-center cursor-pointer hover:bg-secondary"
        onClick={() => logout()}
      >
        Disconnect
      </div>
    );
  }
  return null;
};
export default DisconnectWeb3AuthButton;
