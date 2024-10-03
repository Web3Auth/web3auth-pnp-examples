import 'dart:math';

import 'package:solana/dto.dart';
import 'package:solana/solana.dart';

const int tokenDecimals = 9;

class SolanaProvider {
  final SolanaClient solanaClient;

  SolanaProvider(this.solanaClient);

  Future<double> getBalance(String address) async {
    final balanceResponse = await solanaClient.rpcClient.getBalance(
      address,
    );

    /// We are dividing the balance by 10^9, because Solana's
    /// token decimals is set to be 9;
    return balanceResponse.value / pow(10, tokenDecimals);
  }

  Future<String> sendSol({
    required Ed25519HDKeyPair keyPair,
    required String destination,
    required double value,
  }) async {
    /// Converting user input to the lamports, which are smallest value
    /// in Solana.
    final num lamports = value * pow(10, tokenDecimals);
    final transactionHash = await solanaClient.transferLamports(
      source: keyPair,
      destination: Ed25519HDPublicKey.fromBase58(destination),
      lamports: lamports.toInt(),
    );

    return transactionHash;
  }

  Future<String> signSendTransaction({
    required Ed25519HDKeyPair keyPair,
    required String destination,
    required double value,
  }) async {
    /// Converting user input to the lamports, which are smallest value
    /// in Solana.
    final num lamports = value * pow(10, tokenDecimals);

    final message = Message(instructions: [
      SystemInstruction.transfer(
        fundingAccount: keyPair.publicKey,
        recipientAccount: Ed25519HDPublicKey.fromBase58(destination),
        lamports: lamports.toInt(),
      ),
    ]);

    final recentBlockHash = await getRecentBlockhash();

    final signedTx = await signTransaction(recentBlockHash, message, [keyPair]);
    return signedTx.signatures.first.toBase58();
  }

  Future<LatestBlockhash> getRecentBlockhash() async {
    return await solanaClient.rpcClient
        .getLatestBlockhash(commitment: Commitment.finalized)
        .value;
  }
}
