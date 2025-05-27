import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    const idToken = authHeader?.split(" ")[1];
    
    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Get public key from request body
    const { appPubKey } = await req.json();
    
    if (!appPubKey) {
      return NextResponse.json({ error: "No appPubKey provided" }, { status: 400 });
    }

    // Verify JWT using Web3Auth JWKS
    const jwks = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks"));
    const { payload } = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

    // Find matching wallet in JWT
    const wallets = (payload as any).wallets || [];
    const normalizedAppKey = appPubKey.toLowerCase().replace(/^0x/, '');
    
    const isValid = wallets.some((wallet: any) => {
      if (wallet.type !== "web3auth_app_key") return false;
      
      const walletKey = wallet.public_key.toLowerCase();
      
      // Direct key comparison for ed25519 keys
      if (walletKey === normalizedAppKey) return true;
      
      // Handle compressed secp256k1 keys
      if (wallet.curve === "secp256k1" && walletKey.length === 66 && normalizedAppKey.length === 128) {
        const compressedWithoutPrefix = walletKey.substring(2);
        return normalizedAppKey.startsWith(compressedWithoutPrefix);
      }
      
      return false;
    });

    if (isValid) {
      return NextResponse.json({ name: "Verification Successful" }, { status: 200 });
    } else {
      return NextResponse.json({ name: "Verification Failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Social login verification error:", error);
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }
} 