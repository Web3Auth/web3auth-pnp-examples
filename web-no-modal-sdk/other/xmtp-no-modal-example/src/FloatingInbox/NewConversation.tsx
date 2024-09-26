import React, { useCallback } from "react";
import { MessageInput } from "./MessageInput";
import { useStartConversation, CachedConversation } from "@xmtp/react-sdk";

interface NewConversationProps {
  selectConversation: (conversation: CachedConversation) => void;
  peerAddress: string;
  isPWA?: boolean;
}

export const NewConversation: React.FC<NewConversationProps> = ({ selectConversation, peerAddress, isPWA = false }) => {
  const { startConversation } = useStartConversation();

  const styles: { [key: string]: React.CSSProperties } = {
    messagesContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: "100%",
    },
  };

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) {
        alert("Empty message");
        return;
      }
      if (!peerAddress) {
        alert("No peer address provided");
        return;
      }
      const newConversation = await startConversation(peerAddress, message);
      if (newConversation?.cachedConversation) {
        selectConversation(newConversation.cachedConversation);
      }
    },
    [peerAddress, startConversation, selectConversation]
  );

  return (
    <div style={styles.messagesContainer}>
      <MessageInput onSendMessage={handleSendMessage} isPWA={isPWA} />
    </div>
  );
};
