package org.example;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import net.andreinc.mockneat.MockNeat;

import java.util.Date;

public class JwtUtils {
    public static String generateIdToken(String email, Algorithm alg) {
        return JWT.create()
                .withSubject("email|" + email.split("@")[0])
                .withAudience("torus-key-test")
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600 * 1000))
                .withIssuedAt(new Date())
                .withIssuer("torus-key-test")
                .withClaim("email", email)
                .withClaim("nickname", email.split("@")[0])
                .withClaim("name", email)
                .withClaim("picture", "")
                .withClaim("email_verified", true)
                .sign(alg);
    }

    public static String getRandomEmail() {
        MockNeat mock = MockNeat.threadLocal();
        return mock.emails().val();
    }
}
