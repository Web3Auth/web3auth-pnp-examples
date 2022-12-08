package org.example;

import com.auth0.jwt.algorithms.Algorithm;
import com.github.web3auth.singlefactorauth.SingleFactorAuth;
import com.github.web3auth.singlefactorauth.types.LoginParams;
import com.github.web3auth.singlefactorauth.types.SingleFactorAuthArgs;
import com.github.web3auth.singlefactorauth.types.TorusKey;
import com.github.web3auth.singlefactorauth.types.TorusSubVerifierInfo;
import org.torusresearch.fetchnodedetails.types.TorusNetwork;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.ECPrivateKey;
import java.security.interfaces.ECPublicKey;
import java.security.spec.ECPublicKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.util.concurrent.ExecutionException;

public class AggregateTorusKey {

    static SingleFactorAuth singleFactorAuth;
    static SingleFactorAuthArgs singleFactorAuthArgs;
    static LoginParams loginParams;
    static Algorithm algorithmRs;

    static String TORUS_TEST_VERIFIER = "torus-test-health";
    static String TORUS_TEST_AGGREGATE_VERIFIER = "torus-test-health-aggregate";
    static String TORUS_TEST_EMAIL = "hello@tor.us";

    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeySpecException, IOException {

        singleFactorAuthArgs = new SingleFactorAuthArgs(TorusNetwork.AQUA);
        singleFactorAuth = new SingleFactorAuth(singleFactorAuthArgs);
        ECPrivateKey privateKey = (ECPrivateKey) PemUtils.readPrivateKeyFromFile("src/test/java/keys/key.pem", "EC");
        ECPublicKey publicKey = (ECPublicKey) KeyFactory.getInstance("EC").generatePublic(new ECPublicKeySpec(privateKey.getParams().getGenerator(),
                privateKey.getParams()));
        algorithmRs = Algorithm.ECDSA256(publicKey, privateKey);

        String idToken = JwtUtils.generateIdToken(TORUS_TEST_EMAIL, algorithmRs);
        loginParams = new LoginParams(TORUS_TEST_AGGREGATE_VERIFIER, TORUS_TEST_EMAIL, idToken,
                new TorusSubVerifierInfo[]{new TorusSubVerifierInfo(TORUS_TEST_VERIFIER, idToken)});
        TorusKey torusKey = null;
        try {
            torusKey = singleFactorAuth.getKey(loginParams).get();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Private Key: \n" + torusKey.getPrivateKey().toString(16));
        System.out.println("Public Address: \n" +torusKey.getPublicAddress());
    }
}
