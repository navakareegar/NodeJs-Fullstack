import type { Metadata } from "next";
import localFont from "next/font/local";
import "../asset/style/global.css";
import Provider from "../component/Provider";

const geistSans = localFont({
  src: "../asset/font/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../asset/font/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Permissions App",
  description: "Session-based authentication with permissions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
