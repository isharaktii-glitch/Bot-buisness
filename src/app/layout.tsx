import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BotVerse — WhatsApp & Facebook AI Bot Platform",
  description: "Automate your business messages with a smart AI bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
