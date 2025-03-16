import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreaderSerif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://karledo.github.io/"),
  title: "Karl Edochie",
  description:
    "Driven by curiosity, building with logic, striving for novelty—always moving forward.",
  creator: "Karl Edochie",
  publisher: "Karl Edochie",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreaderSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
