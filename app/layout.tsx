import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/LanguageContext";
import BgmPlayer from "@/components/BgmPlayer";
import ContactButton from "@/components/ContactButton";

export const metadata: Metadata = {
  title: "범죄예방 체험관 | Crime Prevention Korea",
  description: "실제 보이스피싱·스미싱·로맨스스캠 등 대한민국 최신 범죄 수법을 직접 체험하고 예방하세요. / Experience and prevent real crime tactics in Korea.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <BgmPlayer />
        <ContactButton />
        <Analytics />
      </body>
    </html>
  );
}
