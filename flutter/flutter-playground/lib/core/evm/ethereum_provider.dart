import 'dart:math';
import 'dart:typed_data';

import 'package:flutter_playground/core/chain_provider.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3dart/crypto.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';

class EthereumProvider extends ChainProvider {
  final Web3Client web3client;

  EthereumProvider({required String rpcTarget})
      : web3client = Web3Client(
          rpcTarget,
          Client(),
        );

  @override
  Future<String> getBalance(String address) async {
    final balance = await web3client.getBalance(
      EthereumAddress.fromHex(address),
    );

    return balance.getValueInUnit(EtherUnit.ether).toStringAsFixed(4);
  }

  @override
  Future<String> sendTransaction(String to, double amount) async {
    final Credentials credentials = await _prepareCredentials();
    final amountInWei = amount * pow(10, 18);
    final Transaction transaction = Transaction(
      to: EthereumAddress.fromHex(to),
      value: EtherAmount.fromBigInt(
        EtherUnit.wei,
        BigInt.from(amountInWei),
      ),
    );

    final hash = await web3client.sendTransaction(
      credentials,
      transaction,
      chainId: null,
      fetchChainIdFromNetworkId: true,
    );
    return hash;
  }

  @override
  Future<String> signMessage(String messsage) async {
    final Credentials credentials = await _prepareCredentials();
    final signBytes = credentials.signPersonalMessageToUint8List(
      Uint8List.fromList(messsage.codeUnits),
    );

    return bytesToHex(signBytes);
  }

  Future<Credentials> _prepareCredentials() async {
    final privateKey = await Web3AuthFlutter.getPrivKey();
    final Credentials credentials = EthPrivateKey.fromHex(privateKey);
    return credentials;
  }
}
