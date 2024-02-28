import 'dart:math';

import 'package:flutter_playground/features/home/data/datasource/chain_datasource.dart';
import 'package:solana/solana.dart';

class SolanaDataSource extends ChainDataSource {
  final SolanaClient solanaClient;

  SolanaDataSource({required String rpcTarget})
      : solanaClient = SolanaClient(
          rpcUrl: Uri.parse(rpcTarget),
          websocketUrl: Uri.parse(""),
        );

  @override
  Future<String> getBalance(String address) async {
    final balanceResponse = await solanaClient.rpcClient.getBalance(
      address,
    );

    /// We are dividing the balance by 10^9, because Solana's
    /// token decimals is set to be 9;
    return (balanceResponse.value / pow(10, 9)).toString();
  }

  @override
  Future<String> sendTransaction(String to, double balance) {
    // TODO: implement sendTransaction
    throw UnimplementedError();
  }

  @override
  Future<String> signMessage(String messsage) {
    // TODO: implement signMessage
    throw UnimplementedError();
  }
}
