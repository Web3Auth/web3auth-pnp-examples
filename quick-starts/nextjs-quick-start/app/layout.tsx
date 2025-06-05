import React from "react";
// IMP START - Quick Start
import Provider from "../components/provider";
// IMP END - Quick Start
// IMP START - SSR
import { cookieToWeb3AuthState } from "@web3auth/modal";
// IMP END - SSR
import "./globals.css";

import { Inter } from "next/font/google";
// IMP START - SSR
import { headers } from "next/headers";
// IMP END - SSR
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Web3Auth NextJS Quick Start",
  description: "Web3Auth NextJS Quick Start",
};

// eslint-disable-next-line no-undef
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMP START - SSR
  const headersList = await headers();
  const web3authInitialState = cookieToWeb3AuthState(headersList.get("cookie"));
  // IMP END - SSR
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* // IMP START - SSR */}
        <Provider web3authInitialState={web3authInitialState}>
          {children}
        </Provider>
        {/* // IMP END - SSR */}
      </body>
    </html>
  );
}
