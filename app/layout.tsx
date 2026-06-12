import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "범죄예방 체험관 | 대한민국 사기 수법 시뮬레이션",
  description: "실제 보이스피싱·스미싱·로맨스스캠 등 대한민국 최신 범죄 수법을 직접 체험하고 예방하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
