import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-cn-display",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  /* next/font Roboto: no 600 — use 700 for “semibold” primary headings in CSS tokens */
  weight: ["400", "500", "700"],
  variable: "--font-cn-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "pod — Admin Dashboard",
  description: "pod admin dashboard — manage your platform",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoSlab.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
