import Home from "./Home";
import { XMTPProvider } from "@xmtp/react-sdk";
import { Signer } from "ethers";

interface FloatingInboxProps {
  isPWA?: boolean;
  wallet: Signer;
  onLogout: () => void;
  isContained?: boolean;
  isConsent?: boolean;
}

export function FloatingInbox({
  isPWA = false,
  wallet,
  onLogout,
  isContained = false,
  isConsent = false,
}: FloatingInboxProps): JSX.Element {
  return (
    <XMTPProvider>
      <Home
        isPWA={isPWA}
        wallet={wallet}
        onLogout={onLogout}
        isConsent={isConsent}
        isContained={isContained}
      />
    </XMTPProvider>
  );
}
