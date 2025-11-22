import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Event Seating Map",
  description: "Select up to 8 seats for your event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
