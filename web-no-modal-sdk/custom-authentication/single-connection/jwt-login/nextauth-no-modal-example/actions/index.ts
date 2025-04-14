"use server";

import { signIn, signOut } from "@/auth";
import { web3auth } from "@/lib/web3auth";

export async function handleSignIn() {
  await signIn("google");
}

export async function handleSignOut() {
  try {
    if (web3auth.status === "connected") {
      await web3auth.logout();
    }
  } catch (error) {
    console.error("Error during Web3Auth logout:", error);
  } finally {
    await signOut({ redirect: false });
  }
}
