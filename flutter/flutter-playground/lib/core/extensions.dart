import 'package:flutter_playground/core/chain_provider.dart';
import 'package:flutter_playground/core/evm/ethereum_provider.dart';
import 'package:flutter_playground/core/solana/solana_provider.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:hex/hex.dart';

extension StringExtension on String {
  List<int> get hexToBytes => HEX.decode(this);

  String get addressAbbreviation =>
      "${substring(0, 8)}...${substring(length - 8, length)}";

  bool get isValidEmail {
    final regex = RegExp(
      r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$",
    );
    return regex.hasMatch(this);
  }
}

extension ChainConfigExtension on ChainConfig {
  ChainProvider prepareChainProvider() {
    if (isEVMChain) {
      return EthereumProvider(rpcTarget: rpcTarget);
    } else {
      return SolanaProvider(rpcTarget: rpcTarget, wss: wss);
    }
  }
}
