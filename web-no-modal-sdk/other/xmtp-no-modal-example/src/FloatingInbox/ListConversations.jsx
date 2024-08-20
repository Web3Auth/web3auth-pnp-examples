import React, { useState, useEffect, useCallback } from "react";
import {
  useConversations,
  useStreamConversations,
  useClient,
} from "@xmtp/react-sdk";

export const ListConversations = ({
  searchTerm,
  selectConversation,
  onConversationFound,
  isPWA = false,
  isConsent = false,
}) => {
  const { client } = useClient();
  const { conversations } = useConversations();
  const [streamedConversations, setStreamedConversations] = useState([]);

  const styles = {
    conversationListItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "0px",
      border: "0px",
      borderBottom: "1px solid #e0e0e0",
      cursor: "pointer",
      backgroundColor: "#f0f0f0",
      padding: "10px",
      transition: "background-color 0.3s ease",

      padding: isPWA == true ? "15px" : "10px",
    },
    conversationDetails: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "75%",
      marginLeft: isPWA == true ? "15px" : "10px",
      overflow: "hidden",
    },
    conversationName: {
      fontSize: isPWA == true ? "20px" : "16px",
      fontWeight: "bold",
    },
    messagePreview: {
      fontSize: isPWA == true ? "18px" : "14px",
      color: "#666",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    conversationTimestamp: {
      fontSize: isPWA == true ? "16px" : "12px",
      color: "#999",
      width: "25%",
      textAlign: "right",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation?.peerAddress
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      conversation?.peerAddress !== client.address
  );

  useEffect(() => {
    if (filteredConversations.length > 0) {
      onConversationFound(true);
    }
  }, [filteredConversations, onConversationFound]);

  const onConversation = useCallback((conversation) => {
    setStreamedConversations((prev) => [...prev, conversation]);
  }, []);

  const { error } = useStreamConversations(onConversation);

  return (
    <>
      {filteredConversations.map((conversation, index) => (
        <li
          key={index}
          style={styles.conversationListItem}
          onClick={() => {
            selectConversation(conversation);
          }}
        >
          <div style={styles.conversationDetails}>
            <span style={styles.conversationName}>
              {conversation.peerAddress.substring(0, 6) +
                "..." +
                conversation.peerAddress.substring(
                  conversation.peerAddress.length - 4
                )}
            </span>
            <span style={styles.messagePreview}>...</span>
          </div>
          <div style={styles.conversationTimestamp}>
            {getRelativeTimeLabel(conversation.createdAt)}
          </div>
        </li>
      ))}
    </>
  );
};

const getRelativeTimeLabel = (dateString) => {
  const diff = new Date() - new Date(dateString);
  const diffMinutes = Math.floor(diff / 1000 / 60);
  const diffHours = Math.floor(diff / 1000 / 60 / 60);
  const diffDays = Math.floor(diff / 1000 / 60 / 60 / 24);
  const diffWeeks = Math.floor(diff / 1000 / 60 / 60 / 24 / 7);

  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
};
