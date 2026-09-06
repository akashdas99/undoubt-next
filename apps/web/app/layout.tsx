import type { Metadata } from "next";
import "@workspace/ui/globals.css";
import Header from "@/components/common/header";
import { Montserrat, Righteous } from "next/font/google";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Undoubt",
  description: "Undoubt a QnA forum",
  robots: "index,follow",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat-family",
});

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous-family",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${righteous.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div className="flex min-h-svh flex-col items-center font-montserrat">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
