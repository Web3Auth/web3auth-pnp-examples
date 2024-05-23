import 'package:web3auth_flutter/enums.dart';

final chainConfigs = [
  {
    "chainNamespace": ChainNamespace.eip155.name,
    "chainId": "0xaa36a7",
    "displayName": "Ethereum Sepolia",
    "ticker": "ETH",
    "rpcTarget": "https://rpc.ankr.com/eth_sepolia",
    "blockExplorerUrl": "https://sepolia.etherscan.io",
    "logo": "https://web3auth.io/images/web3authlog.png",
    "wss": '',
  },
  {
    "chainNamespace": ChainNamespace.eip155.name,
    "chainId": "0x1",
    "displayName": "Ethereum Mainnet",
    "rpcTarget": "https://rpc.ankr.com/eth",
    "blockExplorerUrl": "https://etherscan.io",
    "ticker": "ETH",
    "logo": "https://web3auth.io/images/web3authlog.png",
    "wss": '',
  },
  {
    "chainNamespace": ChainNamespace.eip155.name,
    "chainId": "0x89",
    "rpcTarget": "https://rpc.ankr.com/polygon",
    "displayName": "Polygon Mainnet",
    "blockExplorerUrl": "https://polygonscan.com",
    "ticker": "MATIC",
    "logo": "https://web3auth.io/images/web3authlog.png",
    "wss": '',
  },
  {
    "chainNamespace": ChainNamespace.eip155.name,
    "chainId": "0x13882",
    "rpcTarget": "https://rpc.ankr.com/polygon_amoy",
    "displayName": "Polygon Amoy Testnet",
    "blockExplorerUrl": "https://amoy.polygonscan.com",
    "ticker": "MATIC",
    "logo": "https://web3auth.io/images/web3authlog.png",
    "wss": '',
  },
  {
    "chainNamespace": ChainNamespace.solana.name,
    "chainId": "devnet",
    "rpcTarget": "https://api.devnet.solana.com",
    "displayName": "Solana Devnet",
    "blockExplorerUrl": "https://explorer.solana.com/?cluster=devnet/",
    "ticker": "SOL",
    "logo": "https://web3auth.io/images/web3authlog.png",
    "wss": "ws://api.devnet.solana.com"
  },
];
