import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';

abstract class ChainConfigRepository {
  List<ChainConfig> prepareChains();
}
