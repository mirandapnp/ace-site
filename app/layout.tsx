import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  aceSafariDetectScript,
  aceSafariFadeStyles,
} from "@/components/ace-sweep";
import { SafariFlag } from "@/components/safari-flag";
import { site } from "@/content/site";
import { gtFlexa } from "./fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${gtFlexa.variable} ${geistSans.variable} ${geistMono.variable} h-full bg-black antialiased`}
    >
      <head>
        {/* Before paint — avoids a sweep→fade flash on WebKit. */}
        <script dangerouslySetInnerHTML={{ __html: aceSafariDetectScript }} />
        <style dangerouslySetInnerHTML={{ __html: aceSafariFadeStyles }} />
      </head>
      <body className="flex min-h-full flex-col bg-black text-white">
        <SafariFlag />
        {children}
      </body>
    </html>
  );
}