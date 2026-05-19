import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { BRAND_CONFIG } from "@/config/brand";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} - Premium E-Commerce Dashboard`,
  description: BRAND_CONFIG.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} antialiased font-sans bg-background text-foreground`}>
        <ReduxProvider>
          <ThemeProvider defaultTheme="system" storageKey={BRAND_CONFIG.themeStorageKey}>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
