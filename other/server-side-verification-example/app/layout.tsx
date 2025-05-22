import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Web3Auth Server Side Verification Example",
  description: "Web3Auth NextJS Server Side Verification Example",
};

// eslint-disable-next-line no-undef
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
