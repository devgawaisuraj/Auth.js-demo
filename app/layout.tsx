import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth.js MySQL Demo",
  description: "Next.js authentication with Auth.js and MySQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
