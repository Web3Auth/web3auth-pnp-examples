import React, { useState, KeyboardEvent, ChangeEvent } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  replyingToMessage?: any; // Replace 'any' with the actual type of replyingToMessage if known
  isPWA?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  replyingToMessage,
  isPWA = false,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");

  const styles: { [key: string]: React.CSSProperties } = {
    newMessageContainer: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px",
      flexWrap: "wrap",
      paddingBottom: "10px",
    },
    messageInputField: {
      flexGrow: 1,
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: isPWA ? "1.2em" : ".9em",
      width: isPWA ? "82%" : undefined,
      outline: "none",
    },
    sendButton: {
      padding: "5px 10px",
      marginLeft: "5px",
      border: "1px solid #ccc",
      cursor: "pointer",
      borderRadius: "5px",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: isPWA ? "1.0em" : ".6em",
      width: isPWA ? "12%" : undefined,
    },
  };

  const handleInputChange = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
    if ('key' in event && event.key === "Enter") {
      onSendMessage(newMessage);
      setNewMessage("");
    } else if ('target' in event) {
      setNewMessage((event.target as HTMLInputElement).value);
    }
  };

  return (
    <div style={styles.newMessageContainer}>
      <input
        style={styles.messageInputField}
        type="text"
        value={newMessage}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleInputChange(e)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
        placeholder="Type your message..."
      />
      <button
        style={styles.sendButton}
        onClick={() => {
          onSendMessage(newMessage);
          setNewMessage("");
        }}>
        {isPWA ? "📤" : "Send"}
      </button>
    </div>
  );
};
