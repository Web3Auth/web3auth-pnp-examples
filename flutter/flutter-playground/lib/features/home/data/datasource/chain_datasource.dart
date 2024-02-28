abstract class ChainDataSource{
  Future<String> getBalance(String address);
  Future<String> sendTransaction(String to, double amount);
  Future<String> signMessage(String messsage);
}
