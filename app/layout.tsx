import type { Metadata, Viewport } from "next";
import { GrainOverlay } from "@/components/brand/GrainOverlay";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { LoadingRitual } from "@/components/hero/LoadingRitual";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { CustomCursor } from "@/components/navigation/CustomCursor";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileTopBar } from "@/components/navigation/MobileTopBar";
import { BRAND } from "@/lib/brand";
import { introFlagScript } from "@/lib/intro";
import { fontVariables } from "./fonts";
import "./ryusenkei.css";
import "./globals.css";

const title = `${BRAND.name} — 找到今天適合你的香氣`;
const description = "探索你的香水收藏，根據天氣、場合與氣味印象，找到今天最適合你的香氣。";

export const metadata: Metadata = {
  title: { default: title, template: `%s — ${BRAND.name}` },
  description,
  applicationName: BRAND.name,
  openGraph: {
    title,
    description,
    siteName: BRAND.name,
    locale: "zh_TW",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#F7F4ED",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Sets data-intro-seen before paint so the loading ritual never flashes for returning visitors. */}
        <script dangerouslySetInnerHTML={{ __html: introFlagScript }} />
        {/* The Ryusenkei slice holding every character of the site's own copy. */}
        <link
          rel="preload"
          href="/fonts/ryusenkei/ryusenkei-400-00.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body className="min-h-svh bg-surface">
        <a
          href="#main"
          className="label sr-only z-[90] bg-surface px-4 py-3 text-blue focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          跳到主要內容
        </a>
        <LoadingRitual />
        <DesktopNav />
        <MobileTopBar />
        <main id="main" className="pb-[calc(var(--nav-mobile-height)+env(safe-area-inset-bottom))] md:pb-0">
          {children}
          <SiteFooter />
        </main>
        <BottomNavigation />
        <CustomCursor />
        <GrainOverlay />
      </body>
    </html>
  );
}
