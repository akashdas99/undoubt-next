import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/header";

export const metadata: Metadata = {
  title: "Undoubt",
  description: "Undoubt a QnA forum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
