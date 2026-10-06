import type { Metadata } from "next";
import { NefertemEmblem } from "@/components/brand/NefertemEmblem";
import { SignInOptions } from "@/components/collection/SignInOptions";
import { safeNext } from "@/lib/account";

export const metadata: Metadata = {
  title: "進入你的香氣收藏",
  description: "使用 Google 或 LINE 帳號進入 Nefertem。",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const raw = params.next;
  const next = safeNext(Array.isArray(raw) ? raw[0] : raw);

  return (
    <section className="page-x flex min-h-[80svh] flex-col items-center justify-center py-20 text-center md:pt-[calc(var(--nav-desktop-height)+2rem)]">
      <NefertemEmblem title="Nefertem" className="h-32 w-auto" />
      <p className="label mt-10 text-muted">ENTER YOUR SCENT JOURNEY</p>
      <h1 className="mt-5 font-serif-zh text-h1-zh text-ink">進入你的香氣收藏。</h1>
      <p className="mt-4 text-muted">登入後，開始今天的香氣儀式。</p>
      <div className="mt-14 w-full max-w-sm">
        <SignInOptions next={next} lineFailed={params.error === "line"} />
      </div>
    </section>
  );
}
