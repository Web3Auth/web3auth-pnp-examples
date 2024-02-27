import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:web3auth_flutter/enums.dart';

class ChainConfigModel extends ChainConfig {
  ChainConfigModel({
    required super.chainNamespace,
    required super.displayName,
    required super.ticker,
    required super.rpcTarget,
    required super.logo,
    required super.blockExplorerUrl,
    required super.chainId,
  });

  factory ChainConfigModel.fromJson(Map<String, String> json) {
    return ChainConfigModel(
      chainNamespace: ChainNamespace.values.byName(json['chainNamespace']!),
      displayName: json['displayName']!,
      ticker: json['ticker']!,
      rpcTarget: json['rpcTarget']!,
      logo: json['logo'],
      blockExplorerUrl: json['blockExplorerUrl']!,
      chainId: json['chainId']!,
    );
  }
}
