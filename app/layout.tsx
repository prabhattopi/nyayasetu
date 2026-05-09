import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/dashboard/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NyayaSetu | Intelligent Legal Assistant",
  description: "Democratizing legal knowledge using Agentic AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Forcing dark mode for that pro dev feel initially */}
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
            <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}