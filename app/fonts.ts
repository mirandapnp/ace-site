import localFont from "next/font/local";

export const gtFlexa = localFont({
  src: [
    {
      path: "./fonts/GT-Flexa-Extended-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gt-flexa",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});
