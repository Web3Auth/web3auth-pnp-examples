import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';

class HomeProvider with ChangeNotifier {
  late ChainConfig _selectedChain;
  late List<ChainConfig> _chains;
  late String _chainAddress;

  ChainConfig get selectedChain => _selectedChain;
  List<ChainConfig> get chains => _chains;
  String get chainAddress => _chainAddress;

  HomeProvider(List<ChainConfig> chains) {
    _selectedChain = chains.first;
    _chains = List.from(chains);
  }

  void updateSelectedChain(ChainConfig chain) {
    _selectedChain = chain;
    notifyListeners();
  }

  void updateChainAddress(String address) {
    _chainAddress = address;
  }

  void addNewChain(ChainConfig newChain) {
    _chains.add(newChain);
    notifyListeners();
  }
}
