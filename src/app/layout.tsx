import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/header";
import StoreProvider from "./StoreProvider";
import { Montserrat } from "next/font/google";
export const metadata: Metadata = {
  title: "Undoubt",
  description: "Undoubt a QnA forum",
};
const prata = Montserrat({
  // weight: "400",
  subsets: ["latin"],
  // style: ["normal"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={prata.className}>
        <StoreProvider>
          <div className="h-screen flex flex-col">
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
