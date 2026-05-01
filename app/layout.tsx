import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: "Land Pre-FS | วิเคราะห์ความเป็นไปได้โครงการจัดสรรที่ดิน",
  description:
    "เครื่องมือวิเคราะห์ความเป็นไปได้ทางการเงินสำหรับโครงการจัดสรรที่ดิน — คำนวณราคาขาย, ราคาที่ดิน, ค่าก่อสร้าง ตามเป้าหมายกำไร (Target GM)",
  keywords: [
    "วิเคราะห์ความเป็นไปได้",
    "โครงการจัดสรรที่ดิน",
    "real estate feasibility",
    "land development",
    "FAR",
    "GFA",
    "NSA",
    "ราคาขาย",
    "ค่าก่อสร้าง",
    "Gross Margin",
  ],
  openGraph: {
    title: "Land Pre-FS | วิเคราะห์ความเป็นไปได้โครงการจัดสรรที่ดิน",
    description:
      "เครื่องมือวิเคราะห์ความเป็นไปได้ทางการเงินสำหรับโครงการจัดสรรที่ดิน — Two-way Solver, Sensitivity Analysis, URL Sharing",
    type: "website",
    locale: "th_TH",
    siteName: "Land Pre-FS",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Land Pre-FS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Land Pre-FS | Real Estate Feasibility",
    description:
      "Professional land feasibility analysis — selling price, land value, construction costs solver.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
