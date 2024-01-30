import 'package:flutter_solana_example/core/solana/solana_provider.dart';
import 'package:get_it/get_it.dart';
import 'package:solana/solana.dart';

class ServiceLocator {
  ServiceLocator._();

  static GetIt get getIt => GetIt.instance;

  static Future<void> init() async {
    final solanaClient = SolanaClient(
      rpcUrl: Uri.parse('https://api.devnet.solana.com'),
      websocketUrl: Uri.parse('ws://api.devnet.solana.com'),
    );

    getIt.registerLazySingleton<SolanaClient>(() => solanaClient);
    getIt.registerLazySingleton(() => SolanaProvider(getIt()));
  }
}