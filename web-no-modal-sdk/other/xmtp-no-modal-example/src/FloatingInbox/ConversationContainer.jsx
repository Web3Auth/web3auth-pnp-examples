import React, { useState, useEffect } from "react";
import { MessageContainer } from "./MessageContainer";
import { useCanMessage, useClient } from "@xmtp/react-sdk";
import { ListConversations } from "./ListConversations";
import { ethers } from "ethers";
import { NewConversation } from "./NewConversation";

export const ConversationContainer = ({
  selectedConversation,
  setSelectedConversation,
  isPWA = false,
  isConsent = false,
  isContained = false,
}) => {
  const { client } = useClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [peerAddress, setPeerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResolve, setLoadingResolve] = useState(false);
  const { canMessage } = useCanMessage();
  const [createNew, setCreateNew] = useState(false);
  const [conversationFound, setConversationFound] = useState(false);

  const styles = {
    conversations: {
      height: "100%",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
    },
    conversationList: {
      overflowY: "auto",
      padding: "0px",
      margin: "0",
      listStyle: "none",
      overflowY: "scroll",
    },
    smallLabel: {
      fontSize: isPWA == true ? "1.5em" : ".9em", // Increased font size
    },
    createNewButton: {
      border: "1px",
      padding: "5px",
      borderRadius: "5px",
      marginTop: "10px",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
    },
    peerAddressInput: {
      width: "100%",
      padding: "10px",
      boxSizing: "border-box",
      border: "0px solid #ccc",
      fontSize: isPWA == true ? "1em" : ".9em",
      outline: "none",
    },
  };
  const isValidEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearchChange = async (e) => {
    setCreateNew(false);
    setConversationFound(false);
    setSearchTerm(e.target.value);
    console.log("handleSearchChange", e.target.value);
    setMessage("Searching...");
    const addressInput = e.target.value;
    const isEthDomain = /\.eth$/.test(addressInput);
    let resolvedAddress = addressInput;
    if (isEthDomain) {
      setLoadingResolve(true);
      try {
        const provider = new ethers.providers.CloudflareProvider();
        resolvedAddress = await provider.resolveName(resolvedAddress);
      } catch (error) {
        console.log(error);
        setMessage("Error resolving address");
        setCreateNew(false);
      } finally {
        setLoadingResolve(false);
      }
    }
    if (resolvedAddress && isValidEthereumAddress(resolvedAddress)) {
      processEthereumAddress(resolvedAddress);
      setSearchTerm(resolvedAddress); // <-- Add this line
    } else {
      setMessage("Invalid Ethereum address");
      setPeerAddress(null);
      setCreateNew(false);
      //setCanMessage(false);
    }
  };

  const processEthereumAddress = async (address) => {
    setPeerAddress(address);
    if (address === client.address) {
      setMessage("No self messaging allowed");
      setCreateNew(false);
      // setCanMessage(false);
    } else {
      const canMessageStatus = await client?.canMessage(address);
      if (canMessageStatus) {
        setPeerAddress(address);
        // setCanMessage(true);
        setMessage("Address is on the network ✅");
        setCreateNew(true);
      } else {
        //  setCanMessage(false);
        setMessage("Address is not on the network ❌");
        setCreateNew(false);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", fontSize: "small" }}>Loading...</div>
    );
  }
  return (
    <div style={styles.conversations}>
      {!selectedConversation && (
        <ul style={styles.conversationList}>
          <input
            type="text"
            placeholder="Enter a 0x wallet or ENS address"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.peerAddressInput}
          />
          {loadingResolve && searchTerm && <small>Resolving address...</small>}
          <ListConversations
            isPWA={isPWA}
            isConsent={isConsent}
            searchTerm={searchTerm}
            selectConversation={setSelectedConversation}
            onConversationFound={(state) => {
              setConversationFound(state);
              if (state === true) setCreateNew(false);
            }}
          />
          {message && conversationFound !== true && <small>{message}</small>}
          {peerAddress && createNew && canMessage && !conversationFound && (
            <>
              <button
                style={styles.createNewButton}
                onClick={() => {
                  setSelectedConversation({ messages: [] });
                }}
              >
                Create new conversation
              </button>
            </>
          )}
        </ul>
      )}
      {selectedConversation && (
        <>
          {selectedConversation.id ? (
            <MessageContainer
              isPWA={isPWA}
              isContained={isContained}
              conversation={selectedConversation}
            />
          ) : (
            <NewConversation
              isPWA={isPWA}
              selectConversation={setSelectedConversation}
              peerAddress={peerAddress}
            />
          )}
        </>
      )}
    </div>
  );
};
