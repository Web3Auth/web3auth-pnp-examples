import 'package:flutter_playground/features/home/data/datasource/chain_config_datasource.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/domain/repositories/chain_config_repostiory.dart';

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
}
