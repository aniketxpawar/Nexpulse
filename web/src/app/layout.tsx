import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ClientWrapper from "@/components/ClientWrapper";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexPulse",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className={inter.className}>
        <main className={`flex min-h-screen flex-col ${inter.className}`}>
          <ClientWrapper>
            <Header />
            {children}
            <ConditionalFooter/>
          </ClientWrapper>
          <Toaster/>
        </main>
      </body>
    </html>
  );
}
