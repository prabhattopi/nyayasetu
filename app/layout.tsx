import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ClerkProvider } from "@clerk/nextjs"; 
// FIX: Using the new v7 UI themes package
import { dark } from "@clerk/ui/themes"; 

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
    // FIX: Using 'theme' instead of 'baseTheme'
    <ClerkProvider appearance={{ 
      theme: dark,
      variables: { colorPrimary: '#3b82f6' } 
    }}>
      <html lang="en" className="dark">
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
    </ClerkProvider>
  );
}