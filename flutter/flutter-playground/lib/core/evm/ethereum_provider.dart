import 'dart:math';
import 'dart:typed_data';

import 'package:flutter_playground/core/chain_provider.dart';
import 'package:flutter_playground/core/erc_20.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3dart/crypto.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';

class EthereumProvider extends ChainProvider {
  final Web3Client web3client;

  EthereumProvider({required String rpcTarget})
      : web3client = Web3Client(
          rpcTarget,
          Client(),
        );

  @override
  Future<String> getBalance(String address) async {
    final balance = await web3client.getBalance(
      EthereumAddress.fromHex(address),
    );
    
    // The result we from Web3Client is in wei, the smallest value. To convert
    // the value to ether, you can divide it with 10^18, where 18 denotes the
    // decimals for wei.
    // 
    // For the sample, we'll use a helper function from web3dart package which
    // has the same implementation. 
    return balance.getValueInUnit(EtherUnit.ether).toStringAsFixed(4);
  }

  @override
  Future<String> sendTransaction(String to, double amount) async {
    final Credentials credentials = await _prepareCredentials();
    final amountInWei = amount * pow(10, 18);
    final Transaction transaction = Transaction(
      to: EthereumAddress.fromHex(to),
      value: EtherAmount.fromBigInt(
        EtherUnit.wei,
        BigInt.from(amountInWei),
      ),
    );

    final hash = await web3client.sendTransaction(
      credentials,
      transaction,
      chainId: null,
      fetchChainIdFromNetworkId: true,
    );
    return hash;
  }

  @override
  Future<String> signMessage(String messsage) async {
    final Credentials credentials = await _prepareCredentials();
    final signBytes = credentials.signPersonalMessageToUint8List(
      Uint8List.fromList(messsage.codeUnits),
    );

    return bytesToHex(signBytes);
  }

  // Prepares the Credentials used for signing the message, 
  // and transaction on EVM chains. EVM ecosystem uses the 
  // scep2561k curve. You can use the Web3AuthFlutter.getPrivKey
  // to retrieve the scep2561K compatible private key.
  Future<Credentials> _prepareCredentials() async {
    final privateKey = await Web3AuthFlutter.getPrivKey();
    final Credentials credentials = EthPrivateKey.fromHex(privateKey);
    return credentials;
  }

  @override
  Future<dynamic> readContract(
    String address,
    String function,
    List<dynamic> params,
  ) async {
    // For this sample, we are using the ERC 20 Contract. The same can be
    // used for any of the EVM smart contract.
    final contract = DeployedContract(
      ContractAbi.fromJson(erc20Abi, 'Contract'),
      EthereumAddress.fromHex(address),
    );

    final readFunction = contract.function(function);
    final result = await web3client.call(
      contract: contract,
      function: readFunction,
      params: params,
    );

    return result;
  }

  @override
  Future writeContract(String address, String function, List params) async {
    // For this sample, we are using the ERC 20 Contract. The same can be
    // used for any of the EVM smart contract.
    final contract = DeployedContract(
      ContractAbi.fromJson(erc20Abi, 'Contract'),
      EthereumAddress.fromHex(address),
    );

    final writeFunction = contract.function(function);
    final Credentials credentials = await _prepareCredentials();
    final result = await web3client.sendTransaction(
      credentials,
      Transaction.callContract(
        contract: contract,
        function: writeFunction,
        parameters: params,
      ),
      chainId: null,
      fetchChainIdFromNetworkId: true,
    );

    return result;
  }
}
