import 'package:flutter_playground/core/utils/chain_configs.dart';
import 'package:flutter_playground/features/home/data/datasource/chain_config_datasource.dart';
import 'package:flutter_playground/features/home/data/repositories/chain_config_repository_impl.dart';
import 'package:flutter_playground/features/home/domain/repositories/chain_config_repostiory.dart';
import 'package:get_it/get_it.dart';

class ServiceLocator {
  ServiceLocator._();

  static GetIt get getIt => GetIt.instance;

  static void setUp() {
    getIt.registerLazySingleton<ChainConfigDataSource>(
      () => ChainConfigDataSourceImpl(chainConfigs: chainConfigs),
    );

    getIt.registerLazySingleton<ChainConfigRepository>(
      () => ChainConfigRepositoryImp(getIt()),
    );
  }
}
