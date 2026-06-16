import type { Metadata } from "next";
import {
  Pixelify_Sans,
  Silkscreen,
  Geist_Mono,
  Be_Vietnam_Pro,
  VT323,
} from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Vietnamese-first proportional face. The pixel display fonts ship no Vietnamese
// diacritic glyphs, so all full-diacritic profile copy + the brand title render
// in this (mapped to `--font-viet` / the `font-viet` utility in globals.css).
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

// Retro CRT/terminal pixel face — one of the few pixel fonts on Google Fonts
// that ships a `vietnamese` subset, so it can render full-diacritic copy. Drives
// the member page's pixel/gaming look (mapped to `--font-pixel` in globals.css).
const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VNZ — Vietnam Z-DNA Technology",
  description:
    "VNZ — Vietnam Z-DNA Technology. Một thế hệ người Việt làm chủ công nghệ, tạo ra giá trị và ghi dấu ấn trên bản đồ công nghệ thế giới.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pixelify.variable} ${silkscreen.variable} ${geistMono.variable} ${beVietnam.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-mono text-cream">{children}</body>
    </html>
  );
}
