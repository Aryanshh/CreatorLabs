import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Labs — Flight Simulator for Social Media",
  description: "Master social media algorithms through hands-on simulation. Practice content creation, SEO, hashtags, and engagement strategies in a risk-free environment.",
  keywords: ["social media", "simulator", "content creation", "algorithm", "engagement", "creator"],
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
