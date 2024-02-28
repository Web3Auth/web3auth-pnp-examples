import "package:solana/solana.dart";
import "package:web3dart/credentials.dart";

class Account {
  final Ed25519HDKeyPair? solanaKeyPair;
  final Credentials? ethereumKeyPair;
  final String balance;
  final String publicAddress;

  Account({
    this.solanaKeyPair,
    this.ethereumKeyPair,
    required this.balance,
    required this.publicAddress,
  });
}
