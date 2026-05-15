import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU_Base-App Admin",
  description: "Central admin dashboard for the EU_Base-App portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
