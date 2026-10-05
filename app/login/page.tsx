import type { Metadata } from "next";
import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { SunDisc } from "@/components/brand/SunDisc";
import { GoogleSignInButton } from "@/components/collection/GoogleSignInButton";

export const metadata: Metadata = {
  title: "進入你的香氣收藏",
  description: "使用 Google 帳號進入香水人生。",
};

export default function LoginPage() {
  return (
    <section className="page-x flex min-h-[80svh] flex-col items-center justify-center py-20 text-center md:pt-[calc(var(--nav-desktop-height)+2rem)]">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <SunDisc id="login-sun" className="absolute inset-0 opacity-70" />
        <LotusGlyph size={56} strokeWidth={1} draw className="relative text-lotus-deep" />
      </div>
      <p className="label mt-10 text-muted">ENTER YOUR SCENT JOURNEY</p>
      <h1 className="mt-5 font-serif-zh text-h1-zh text-ink">進入你的香氣收藏。</h1>
      <div className="mt-14 w-full max-w-sm">
        <GoogleSignInButton />
      </div>
    </section>
  );
}
