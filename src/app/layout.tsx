import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Labs — Flight Simulator for Social Media",
  description: "Master social media algorithms through hands-on simulation. Practice content creation, SEO, hashtags, and engagement strategies in a risk-free environment.",
  keywords: ["social media", "simulator", "content creation", "algorithm", "engagement", "creator"],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const theme = localStorage.getItem('cl-theme');
              const grain = localStorage.getItem('cl-grain');
              if (theme === 'dark') document.body.classList.add('dark');
              if (grain === 'false') document.body.classList.add('no-grain');
            } catch (e) {}
          })()
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
