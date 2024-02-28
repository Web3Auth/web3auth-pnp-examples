import 'package:flutter_playground/features/home/data/datasource/chain_datasource.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';

class EthereumDataSource extends ChainDataSource {
  final Web3Client web3client;

  EthereumDataSource({required String rpcTarget})
      : web3client = Web3Client(
          rpcTarget,
          Client(),
        );

  @override
  Future<String> getBalance(String address) async {
    final balance = await web3client.getBalance(
      EthereumAddress.fromHex(address),
    );

    return balance.getValueInUnit(EtherUnit.ether).toString();
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
