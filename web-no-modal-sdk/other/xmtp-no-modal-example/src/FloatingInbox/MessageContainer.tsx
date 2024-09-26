import React, { useRef, useEffect } from "react";
import { MessageInput } from "./MessageInput";
import {
  useMessages,
  useSendMessage,
  useStreamMessages,
  useClient,
  Conversation,
  DecodedMessage,
  Client,
} from "@xmtp/react-sdk";
import MessageItem from "./MessageItem";

interface MessageContainerProps {
  conversation: Conversation;
  isPWA?: boolean;
  isContained?: boolean;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  conversation,
  isPWA = false,
  isContained = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { client } = useClient();
  const { messages, isLoading } = useMessages(conversation as any);

  const styles: { [key: string]: React.CSSProperties } = {
    messagesContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      fontSize: isPWA ? "1.2em" : ".9em",
    },
    loadingText: {
      textAlign: "center",
    },
    messagesList: {
      paddingLeft: "5px",
      paddingRight: "5px",
      margin: "0px",
      alignItems: "flex-start",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    },
  };

  useStreamMessages(conversation as any);
  const { sendMessage } = useSendMessage();

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim()) {
      alert("empty message");
      return;
    }
    if (conversation && conversation.peerAddress) {
      await sendMessage(conversation as any, newMessage);
    }
  };

  useEffect(() => {
    if (!isContained)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.messagesContainer}>
      {isLoading ? (
        <small style={styles.loadingText}>Loading messages...</small>
      ) : (
        <>
          <ul style={styles.messagesList}>
            {messages.slice().map((message: any) => {
              return (
                <MessageItem
                  isPWA={isPWA}
                  key={message.id}
                  message={message}
                  senderAddress={message.senderAddress}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </ul>
          <MessageInput
            isPWA={isPWA}
            onSendMessage={(msg: string) => {
              handleSendMessage(msg);
            }}
          />
        </>
      )}
    </div>
  );
};
