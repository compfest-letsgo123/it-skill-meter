import Head from "next/head";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Skill Meter",
  description: "Uji kemampuan ITmu untuk berkarir!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/app/favicon.ico" />
        <meta name="description" content={metadata.description || ""} />
      </Head>
      <body className={poppins.className}>
        <main className="bg-gradient-to-r px-8 from-blue-100 to-pink-100">
          {children}
        </main>
      </body>
    </html>
  );
}
