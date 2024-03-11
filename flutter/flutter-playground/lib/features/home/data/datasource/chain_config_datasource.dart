import 'dart:developer';

import 'package:flutter_playground/features/home/data/models/chain_config_model.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';

abstract class ChainConfigDataSource {
  List<ChainConfig> prepareChains();
}

class ChainConfigDataSourceImpl implements ChainConfigDataSource {
  final List<Map<String, String>> chainConfigs;

  ChainConfigDataSourceImpl({required this.chainConfigs});

  @override
  List<ChainConfig> prepareChains() {
    try {
      return chainConfigs.map(_convertJsonToChainMode).toList();
    } catch (error, _) {
      log(error.toString(), stackTrace: _);
      rethrow;
    }
  }

  ChainConfigModel _convertJsonToChainMode(Map<String, String> json) {
    return ChainConfigModel.fromJson(json);
  }
}
