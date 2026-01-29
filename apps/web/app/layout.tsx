import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/header";
import StoreProvider from "./StoreProvider";
import { PrefetchUser } from "@/components/common/prefetchUser";
import { Montserrat, Righteous } from "next/font/google";
export const metadata: Metadata = {
  title: "Undoubt",
  description: "Undoubt a QnA forum",
  robots: "index,follow",
};
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${righteous.variable}`}>
      <body>
        <StoreProvider>
          <PrefetchUser />
          <div className="min-h-svh flex flex-col items-center font-montserrat">
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
