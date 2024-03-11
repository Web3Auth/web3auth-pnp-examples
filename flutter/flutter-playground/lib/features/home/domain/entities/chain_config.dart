import 'package:web3auth_flutter/enums.dart';

class ChainConfig {
  final ChainNamespace chainNamespace;
  final String displayName;
  final String ticker;
  final String rpcTarget;
  final String blockExplorerUrl;
  final String chainId;
  final String? logo;
  final bool isEVMChain;
  final String wss;

  ChainConfig({
    required this.isEVMChain,
    required this.chainNamespace,
    required this.displayName,
    required this.ticker,
    required this.rpcTarget,
    required this.blockExplorerUrl,
    required this.logo,
    required this.chainId,
    required this.wss,
  });
}
