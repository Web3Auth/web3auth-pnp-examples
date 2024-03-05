import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/features/home/data/datasource/chain_config_datasource.dart';
import 'package:flutter_playground/features/home/domain/entities/account.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/domain/repositories/chain_config_repostiory.dart';
import 'package:solana/solana.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3dart/credentials.dart';

class ChainConfigRepositoryImp implements ChainConfigRepository {
  final ChainConfigDataSource dataSource;

  ChainConfigRepositoryImp(this.dataSource);

  @override
  List<ChainConfig> prepareChains() {
    try {
      return dataSource.prepareChains();
    } catch (error) {
      rethrow;
    }
  }

  @override
  Future<Account> prepareAccount(ChainConfig chainConfig) async {
    final chainProvider = chainConfig.prepareChainProvider();

    if (chainConfig.isEVMChain) {
      final privateKey = await Web3AuthFlutter.getPrivKey();
      final ethereumKeyPair = EthPrivateKey.fromHex(privateKey);
      final publicAddress = ethereumKeyPair.address.hex;
      final balance = await chainProvider.getBalance(publicAddress);
      return Account(
        balance: balance,
        publicAddress: publicAddress,
        ethereumKeyPair: ethereumKeyPair,
      );
    } else {
      final privateKey = await Web3AuthFlutter.getEd25519PrivKey();
      final solanaKeyPair = await Ed25519HDKeyPair.fromPrivateKeyBytes(
        privateKey: privateKey.hexToBytes.take(32).toList(),
      );
      final publicAddress = solanaKeyPair.address;
      final balance = await chainProvider.getBalance(publicAddress);
      return Account(
        balance: balance,
        publicAddress: publicAddress,
        solanaKeyPair: solanaKeyPair,
      );
    }
  }
}
