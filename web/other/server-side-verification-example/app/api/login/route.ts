/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import * as jose from "jose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const idToken = authHeader?.split(" ")[1] || "";
    
    const body = await request.json();
    const app_pub_key = body.appPubKey;

    const jwks = jose.createRemoteJWKSet(new URL("https://api.openlogin.com/jwks"));
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
      algorithms: ["ES256"],
    });
    
    if (
      (jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "web3auth_app_key").public_key.toLowerCase() ===
      app_pub_key.toLowerCase()
    ) {
      // Verified
      return NextResponse.json({ name: "Validation Success" }, { status: 200 });
    } else {
      return NextResponse.json({ name: "Failed" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
} 