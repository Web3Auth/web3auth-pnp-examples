import 'dart:math';

import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/chain_provider.dart';
import 'package:solana/encoder.dart';
import 'package:solana/solana.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class SolanaProvider extends ChainProvider {
  final SolanaClient solanaClient;

  SolanaProvider({required String rpcTarget, required String wss})
      : solanaClient = SolanaClient(
          rpcUrl: Uri.parse(rpcTarget),
          websocketUrl: Uri.parse(wss),
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
  Future<String> sendTransaction(String to, double amount) async {
    final Ed25519HDKeyPair ed25519hdKeyPair = await _generateKeyPair();

    /// Converting user input to the lamports, which are smallest value
    /// in Solana.
    final num lamports = amount * pow(10, 9);
    final transactionHash = await solanaClient.transferLamports(
      source: ed25519hdKeyPair,
      destination: Ed25519HDPublicKey.fromBase58(to),
      lamports: lamports.toInt(),
    );

    return transactionHash;
  }

  @override
  Future<String> signMessage(String messsage) async {
    final Ed25519HDKeyPair ed25519hdKeyPair = await _generateKeyPair();

    final signatrure = await ed25519hdKeyPair.sign(
      ByteArray.fromString(messsage),
    );
    return signatrure.toBase58();
  }

  Future<Ed25519HDKeyPair> _generateKeyPair() async {
    final privateKey = await Web3AuthFlutter.getEd25519PrivKey();
    return await Ed25519HDKeyPair.fromPrivateKeyBytes(
      privateKey: privateKey.hexToBytes.take(32).toList(),
    );
  }
}
