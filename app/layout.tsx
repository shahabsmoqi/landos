import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandOS — Developer Intelligence Platform",
  description: "Analyze zoning, utilities, flood risk, development potential, permits, and financial feasibility from one address.",
  keywords: ["land development", "zoning", "real estate", "development intelligence", "parcel analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.15 0.02 250)",
              border: "1px solid oklch(0.24 0.02 250)",
              color: "oklch(0.94 0.01 240)",
            },
          }}
        />
      </body>
    </html>
  );
}
