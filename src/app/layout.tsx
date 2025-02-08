import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/header";
import StoreProvider from "./StoreProvider";
import { Montserrat, Righteous } from "next/font/google";
export const metadata: Metadata = {
  title: "Undoubt",
  description: "Undoubt a QnA forum",
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
          <div className="h-screen flex flex-col font-montserrat">
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
