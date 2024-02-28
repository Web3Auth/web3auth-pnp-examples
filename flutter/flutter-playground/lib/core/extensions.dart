import 'package:flutter_playground/core/utils/chain_configs.dart';
import 'package:flutter_playground/features/home/data/datasource/chain_datasource.dart';
import 'package:flutter_playground/features/home/data/datasource/ethereum_datasource.dart';
import 'package:flutter_playground/features/home/data/datasource/solana_datasource.dart';
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
  ChainDataSource prepareDataSource() {
    if (isEVMChain) {
      return EthereumDataSource(rpcTarget: rpcTarget);
    } else {
      return SolanaDataSource(rpcTarget: rpcTarget);
    }
  }
}
