abstract class ChainProvider {
  Future<String> getBalance(String address);
  Future<String> sendTransaction(String to, double amount);
  Future<String> signMessage(String messsage);
  Future<dynamic> readContract(
    String address,
    String function,
    List<dynamic> params,
  );

  Future<dynamic> writeContract(
    String address,
    String function,
    List<dynamic> params,
  );
}
