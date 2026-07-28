import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { spaceGrotesk } from "./fonts";
import "./globals.css";
import { cookies } from "next/headers";

const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
});

const geistMono = Geist_Mono({
     variable: "--font-geist-mono",
     subsets: ["latin"],
});

export const metadata: Metadata = {
     title: "StarterApp — Clean SaaS Template",
     description: "A production-ready full-stack developer starter template.",
};

export default async function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     const cookieStore = await cookies();
     const sessionCookie = cookieStore.get("user_session")?.value;
     let preloadedUser = undefined;
     if (sessionCookie) {
          try {
               preloadedUser = JSON.parse(decodeURIComponent(sessionCookie));
          } catch {
               // ignore
          }
     }

     return (
          <html lang="en" suppressHydrationWarning>
               <head>
                    <script
                         dangerouslySetInnerHTML={{
                              __html: `
                                   (function() {
                                        try {
                                             var theme = localStorage.getItem('starter-app-theme') || 'system';
                                             var root = document.documentElement;
                                             root.classList.remove('light', 'dark');
                                             if (theme === 'system') {
                                                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                                  root.classList.add(systemTheme);
                                             } else {
                                                  root.classList.add(theme);
                                             }

                                             // Primary color injection
                                             var primaryColor = localStorage.getItem('starter-app-primary-color');
                                             if (primaryColor) {
                                                  root.style.setProperty('--primary', primaryColor);
                                                  root.style.setProperty('--ring', primaryColor);
                                                  root.style.setProperty('--color-primary', primaryColor);
                                             }
                                        } catch (e) {}
                                   })();
                              `,
                         }}
                    />
               </head>
               <body
                    className={`${spaceGrotesk.className} font-sans`}
               >
                    <ThemeProvider>
                         <ReduxProvider preloadedUser={preloadedUser}>
                              <>
                                   <Toaster richColors />
                                   {children}
                              </>
                         </ReduxProvider>
                    </ThemeProvider>
               </body>
          </html>
     );
}
