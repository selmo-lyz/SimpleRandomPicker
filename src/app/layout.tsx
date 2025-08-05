import type { Metadata } from "next";
import { notoSansTC, notoSansMono } from "@/app/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Random Picker",
  description: "A simple random picker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${notoSansTC.className} ${notoSansMono.className} antialiased md:py-50 md:px-1`}
      >
        {children}
      </body>
    </html>
  );
}
