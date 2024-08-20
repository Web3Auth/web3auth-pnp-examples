import React, { useCallback } from "react";
import { MessageInput } from "./MessageInput";
import { useStartConversation } from "@xmtp/react-sdk"; // import the required SDK hooks

export const NewConversation = ({ selectConversation, peerAddress }) => {
  const { startConversation } = useStartConversation();
  const styles = {
    messagesContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: "100%",
    },
  };

  const handleSendMessage = useCallback(
    async (message) => {
      if (!message.trim()) {
        alert("Empty message");
        return;
      }
      if (!peerAddress) {
        alert("No peer address provided");
        return;
      }
      const newConversation = await startConversation(peerAddress, message);
      selectConversation(newConversation?.cachedConversation);
    },
    [peerAddress, startConversation, selectConversation]
  );

  return (
    <div style={styles.messagesContainer}>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};
