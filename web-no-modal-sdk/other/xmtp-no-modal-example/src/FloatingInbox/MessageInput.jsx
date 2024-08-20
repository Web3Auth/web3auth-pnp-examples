import React, { useState } from "react";

export const MessageInput = ({
  onSendMessage,
  replyingToMessage,
  isPWA = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const styles = {
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
      fontSize: isPWA == true ? "1.2em" : ".9em",
      width: isPWA == true ? "82%" : "",
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
      fontSize: isPWA == true ? "1.0em" : ".6em",
      width: isPWA == true ? "12%" : "",
    },
  };
  const handleInputChange = (event) => {
    if (event.key === "Enter") {
      onSendMessage(newMessage);
      setNewMessage("");
    } else {
      setNewMessage(event.target.value);
    }
  };

  return (
    <div style={styles.newMessageContainer}>
      <input
        style={styles.messageInputField}
        type="text"
        value={newMessage}
        onKeyPress={handleInputChange}
        onChange={handleInputChange}
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
