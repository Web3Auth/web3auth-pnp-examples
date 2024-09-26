import React, { useState, useEffect } from "react";
import { MessageContainer } from "./MessageContainer";
import { useCanMessage, useClient } from "@xmtp/react-sdk";
import { ListConversations } from "./ListConversations";
import { ethers } from "ethers";
import { NewConversation } from "./NewConversation";

interface ConversationContainerProps {
  selectedConversation: any;
  setSelectedConversation: (conversation: any) => void;
  isPWA?: boolean;
  isConsent?: boolean;
  isContained?: boolean;
}

export const ConversationContainer: React.FC<ConversationContainerProps> = ({
  selectedConversation,
  setSelectedConversation,
  isPWA = false,
  isConsent = false,
  isContained = false,
}) => {
  const { client } = useClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [peerAddress, setPeerAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingResolve, setLoadingResolve] = useState<boolean>(false);
  const { canMessage } = useCanMessage();
  const [createNew, setCreateNew] = useState<boolean>(false);
  const [conversationFound, setConversationFound] = useState<boolean>(false);

  const styles: { [key: string]: React.CSSProperties } = {
    conversations: {
      height: "100%",
      fontSize: isPWA ? "1.2em" : ".9em",
    },
    conversationList: {
      overflowY: "auto",
      padding: "0px",
      margin: "0",
      listStyle: "none",
    },
    smallLabel: {
      fontSize: isPWA ? "1.5em" : ".9em",
    },
    createNewButton: {
      border: "1px",
      padding: "5px",
      borderRadius: "5px",
      marginTop: "10px",
      fontSize: isPWA ? "1.2em" : ".9em",
    },
    peerAddressInput: {
      width: "100%",
      padding: "10px",
      boxSizing: "border-box",
      border: "0px solid #ccc",
      fontSize: isPWA ? "1em" : ".9em",
      outline: "none",
    },
  };

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const provider = new ethers.CloudflareProvider();
        resolvedAddress = await provider.resolveName(resolvedAddress) as string;
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
      setSearchTerm(resolvedAddress);
    } else {
      setMessage("Invalid Ethereum address");
      setPeerAddress("");
      setCreateNew(false);
    }
  };

  const processEthereumAddress = async (address: string) => {
    setPeerAddress(address);
    if (address === client?.address) {
      setMessage("No self messaging allowed");
      setCreateNew(false);
    } else {
      const canMessageStatus = await client?.canMessage(address);
      if (canMessageStatus) {
        setPeerAddress(address);
        setMessage("Address is on the network ✅");
        setCreateNew(true);
      } else {
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
            onConversationFound={(state: boolean) => {
              setConversationFound(state);
              if (state === true) setCreateNew(false);
            }}
          />
          {message && conversationFound !== true && <small>{message}</small>}
          {peerAddress && createNew && !conversationFound && (
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
