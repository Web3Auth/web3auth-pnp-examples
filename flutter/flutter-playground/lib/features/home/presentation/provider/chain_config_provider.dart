import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';

class ChainConfigProvider with ChangeNotifier {
  late ChainConfig _selectedChain;
  late List<ChainConfig> _chains;

  ChainConfig get selectedChain => _selectedChain;
  List<ChainConfig> get chains => _chains;

  ChainConfigProvider(List<ChainConfig> chains) {
    _selectedChain = chains.first;
    _chains = List.from(chains);
  }

  void updateSelectedChain(ChainConfig chain) {
    _selectedChain = chain;
    notifyListeners();
  }

  void addNewChain(ChainConfig newChain) {
    _chains.add(newChain);
    notifyListeners();
  }
}
