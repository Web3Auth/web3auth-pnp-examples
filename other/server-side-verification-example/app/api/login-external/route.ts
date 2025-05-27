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

    // Get address from request body
    const { address } = await req.json();
    
    if (!address) {
      return NextResponse.json({ error: "No address provided" }, { status: 400 });
    }

    // Verify JWT using AuthJS JWKS
    const jwks = jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks"));
    const { payload } = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

    // Find matching wallet in JWT
    const wallets = (payload as any).wallets || [];
    const addressToCheck = Array.isArray(address) ? address[0] : address;
    const normalizedAddress = addressToCheck.toLowerCase();
    
    const isValid = wallets.some((wallet: any) => {
      return wallet.type === "ethereum" && 
             wallet.address && 
             wallet.address.toLowerCase() === normalizedAddress;
    });

    if (isValid) {
      return NextResponse.json({ name: "Verification Successful" }, { status: 200 });
    } else {
      return NextResponse.json({ name: "Verification Failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("External wallet verification error:", error);
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }
} 