import React from "react";
import { useClient, ContentTypeId, DecodedMessage } from "@xmtp/react-sdk";

interface MessageItemProps {
  message: DecodedMessage;
  senderAddress: string;
  isPWA?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, senderAddress, isPWA = false }) => {
  const { client } = useClient();
  const styles: { [key: string]: React.CSSProperties } = {
    messageContent: {
      backgroundColor: "lightblue",
      padding: isPWA ? "10px 20px" : "5px 10px",
      alignSelf: "flex-start",
      textAlign: "left",
      display: "inline-block",
      margin: isPWA ? "10px" : "5px",
      borderRadius: isPWA ? "10px" : "5px",
      maxWidth: "80%",
      wordBreak: "break-word",
      cursor: "pointer",
      listStyle: "none",
    },
    renderedMessage: {
      fontSize: isPWA ? "16px" : "12px",
      wordBreak: "break-word",
      padding: "0px",
    },
    senderMessage: {
      alignSelf: "flex-start",
      textAlign: "left",
      listStyle: "none",
      width: "100%",
    },
    receiverMessage: {
      alignSelf: "flex-end",
      listStyle: "none",
      textAlign: "right",
      width: "100%",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    timeStamp: {
      fontSize: isPWA ? "12px" : "8px",
      color: "grey",
    },
  };

  const renderFooter = (timestamp: Date) => {
    return (
      <div style={styles.footer}>
        <span style={styles.timeStamp}>
          {`${timestamp.getHours()}:${String(
            timestamp.getMinutes()
          ).padStart(2, "0")}`}
        </span>
      </div>
    );
  };

  const renderMessage = (message: DecodedMessage) => {
    const contentType = message.contentType;
    const codec = client?.codecFor(contentType);
    console.log("codec", codec);
    let content: string | undefined = message.content as string;
    if (!codec) {
      /*Not supported content type*/
      if (message?.contentFallback !== undefined)
        content = message?.contentFallback;
      else return null;
    }
    return (
      <div style={styles.messageContent}>
        <div style={styles.renderedMessage}>{content}</div>
        {renderFooter(message.sent)}
      </div>
    );
  };

  const isSender = senderAddress === client?.address;

  const MessageComponent = isSender ? "li" : "li";

  return (
    <MessageComponent
      style={isSender ? styles.senderMessage : styles.receiverMessage}
      key={message.id}
    >
      {renderMessage(message)}
    </MessageComponent>
  );
};

export default MessageItem;
