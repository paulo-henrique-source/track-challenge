import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "./providers";
import "../styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--app-font-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--app-font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Track Challenge",
  description: "Base inicial para o desafio de rastreamento de veiculos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
