import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const chain: {
  [key: string]: CustomChainConfig;
} = {
  Ethereum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    displayName: "Ethereum Mainnet",
    rpcTarget: "https://rpc.ankr.com/eth",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://images.toruswallet.io/eth.png",
  },
  Sepolia: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    displayName: "Ethereum Sepolia",
    tickerName: "Ethereum",
    ticker: "ETH",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://images.toruswallet.io/eth.svg",
    isTestnet: true,
  },
  Polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x89", // hex of 137, polygon mainnet
    rpcTarget: "https://rpc.ankr.com/polygon",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Polygon Mainnet",
    blockExplorerUrl: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "Matic",
  },
  "Polygon Mumbai Testnet": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13881", // hex of 80001, polygon testnet
    rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Polygon Mumbai Testnet",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
    ticker: "MATIC",
    tickerName: "Matic",
  },
  "Base Chain (Coinbase)": {
    // https://docs.base.org/using-base/
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x14A34", // hex of 84532
    rpcTarget: "https://sepolia.base.org",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Base Sepolia",
    blockExplorerUrl: "https://sepolia-explorer.base.org/",
    ticker: "ETH",
    tickerName: "ETH",
  },
  "BNB Chain": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38", // hex of 56
    rpcTarget: "https://rpc.ankr.com/bsc",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Binance SmartChain Mainnet",
    blockExplorerUrl: "https://bscscan.com/",
    ticker: "BNB",
    tickerName: "BNB",
  },
  Avalanche: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA86A", // hex of 43114
    rpcTarget: "https://rpc.ankr.com/avalanche-c",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Avalanche C-Chain Mainnet",
    blockExplorerUrl: "https://subnets.avax.network/c-chain",
    ticker: "AVAX",
    tickerName: "AVAX",
  },
  Arbitrum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA4B1", // hex of 42161
    rpcTarget: "https://rpc.ankr.com/arbitrum",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Arbitrum Mainnet",
    blockExplorerUrl: "https://arbiscan.io",
    ticker: "AETH",
    tickerName: "AETH",
  },
  Optimism: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA", // hex of 10
    rpcTarget: "https://rpc.ankr.com/optimism",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Optimism Mainnet",
    blockExplorerUrl: "https://optimistic.etherscan.io",
    ticker: "OP",
    tickerName: "OP",
  },
  Cronos: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x19", // hex of 25, cronos mainnet
    rpcTarget: "https://rpc.cronos.org",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Cronos Mainnet",
    blockExplorerUrl: "https://cronoscan.com/",
    ticker: "CRO",
    tickerName: "CRO",
  },
  Harmony: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x63564c40", // hex of 1666600000, Harmony mainnet
    rpcTarget: "https://rpc.ankr.com/harmony",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Harmony Mainnet",
    blockExplorerUrl: "https://explorer.harmony.one",
    ticker: "ONE",
    tickerName: "ONE",
  },
  Celo: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xa4ec", // hex of 42220, Celo mainnet
    rpcTarget: "https://rpc.ankr.com/celo",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Celo Mainnet",
    blockExplorerUrl: "https://explorer.celo.org",
    ticker: "CELO",
    tickerName: "CELO",
  },
  Moonbeam: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x504", // hex of 1284, moonbeam mainnet
    rpcTarget: "https://rpc.ankr.com/moonbeam",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Moonbeam Mainnet",
    blockExplorerUrl: "https://moonbeam.moonscan.io",
    ticker: "GLMR",
    tickerName: "GLMR",
  },
  Moonriver: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x505", // hex of 1285, moonriver mainnet
    rpcTarget: "https://rpc.api.moonriver.moonbeam.network",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Moonriver Mainnet",
    blockExplorerUrl: "https://moonriver.moonscan.io",
    ticker: "MOVR",
    tickerName: "MOVR",
  },
  Klaytn: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x2019", // hex of 8217, Klaytn mainnet
    rpcTarget: "https://public-node-api.klaytnapi.com/v1/cypress",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Klaytn Mainnet",
    blockExplorerUrl: "https://scope.klaytn.com",
    ticker: "KLAY",
    tickerName: "KLAY",
  },
  Flare: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xE", // hex of 14
    rpcTarget: "https://flare-api.flare.network/ext/C/rpc",
    // Avoid using public rpcTarget in production.
    // Use services provided by Flare or other node providers
    displayName: "Flare Mainnet",
    blockExplorerUrl: "https://flare-explorer.flare.network/",
    ticker: "FLR",
    tickerName: "FLR",
  },
  Songbird: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13", // hex of 19
    rpcTarget: "https://songbird-api.flare.network/ext/C/rpc",
    // Avoid using public rpcTarget in production.
    // Use services provided by Flare or other node providers
    displayName: "Songbird canary network",
    blockExplorerUrl: "https://songbird-explorer.flare.network",
    ticker: "SGB",
    tickerName: "SGB",
  },
  zKatana: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x133E40", // hex of 1261120
    rpcTarget: "https://rpc.zkatana.gelato.digital",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "zKatana Testnet",
    blockExplorerUrl: "https://zkatana.blockscout.com",
    ticker: "ETH",
    tickerName: "ETH",
  },
  // SKALE: {
  //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   chainId: "0x79f99296",
  //   rpcTarget: "https://mainnet.skalenodes.com/v1/elated-tan-skat",
  //   // Avoid using public rpcTarget in production.
  //   // Use services like Infura, Quicknode etc
  //   displayName: "SKALE Europa Hub Mainnet",
  //   blockExplorerUrl: "https://elated-tan-skat.explorer.mainnet.skalenodes.com/",
  //   ticker: "sFUEL",
  //   tickerName: "sFUEL",
  // },
};
