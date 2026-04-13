import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { DEFAULT_LANGUAGE } from "@/i18n/config";
import { translateFromDictionary } from "@/i18n/dictionaries";

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
  title: translateFromDictionary(DEFAULT_LANGUAGE, "meta.title"),
  description: translateFromDictionary(DEFAULT_LANGUAGE, "meta.description"),
  applicationName: translateFromDictionary(DEFAULT_LANGUAGE, "common.appName"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: translateFromDictionary(DEFAULT_LANGUAGE, "common.appName"),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
