import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/LanguageContext";
import BgmPlayer from "@/components/BgmPlayer";
import ContactButton from "@/components/ContactButton";
import DonateFloatButton from "@/components/DonateFloatButton";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "범죄예방 체험관 | Crime Prevention Korea",
  description: "실제 보이스피싱·스미싱·로맨스스캠 등 대한민국 최신 범죄 수법을 직접 체험하고 예방하세요. / Experience and prevent real crime tactics in Korea.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L31H0R3SEK"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L31H0R3SEK');
        `}} />
      </head>
      <body>
        <LanguageProvider>
          <AppShell>
            {children}
          </AppShell>
        </LanguageProvider>
        <BgmPlayer />
        <ContactButton />
        <DonateFloatButton />
        <Analytics />
      </body>
    </html>
  );
}
