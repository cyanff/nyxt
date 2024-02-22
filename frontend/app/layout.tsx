import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--poppins",
});
const atkinson_hyperlegible = Atkinson_Hyperlegible({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--atkinson",
});

export const metadata: Metadata = {
  title: "nyxt.ai",
  description: "The accessible summarizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/moon.svg" sizes="any" />
      <body
        className={`${inter.className} ${poppins.variable} ${atkinson_hyperlegible.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
