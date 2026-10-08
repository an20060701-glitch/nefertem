"use client";

import { useEffect, useState } from "react";
import type { SiteStats } from "@/lib/admin/summary";
import { useCollection } from "@/components/collection/CollectionProvider";

type Load = { state: "loading" } | { state: "error"; code: string } | { state: "ready"; stats: SiteStats };

const MESSAGES: Record<string, string> = {
  "not-configured": "伺服器尚未設定 FIREBASE_SERVICE_ACCOUNT_KEY，無法讀取會員資料。",
  "signed-out": "請先登入。",
  forbidden: "這個帳號沒有查看後台的權限（不在 ADMIN_EMAILS 名單中）。",
};

const date = (ms: number | null) =>
  ms === null ? "—" : new Date(ms).toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" });
const PROVIDER = { google: "Google", line: "LINE", other: "其他" } as const;

export function SiteStatsView() {
  const { user } = useCollection();
  const [load, setLoad] = useState<Load>({ state: "loading" });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` },
          cache: "no-store",
        });
        const body = await res.json();
        if (cancelled) return;
        setLoad(res.ok ? { state: "ready", stats: body as SiteStats } : { state: "error", code: body.error });
      } catch {
        if (!cancelled) setLoad({ state: "error", code: "failed" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return <p className="page-x label text-muted">需要登入才能查看。</p>;
  if (load.state === "loading") return <p className="page-x label text-muted">正在讀取…</p>;
  if (load.state === "error")
    return <p className="page-x pb-24 text-muted">{MESSAGES[load.code] ?? "讀取失敗，請稍後再試。"}</p>;

  const { totals, signups, members, generatedAt } = load.stats;
  const tiles = [
    ["註冊會員", totals.members, `Google ${totals.google} · LINE ${totals.line}`],
    ["近 7 天新註冊", totals.new7d, `近 30 天 ${totals.new30d}`],
    ["近 7 天有使用", totals.active7d, `近 30 天 ${totals.active30d}`],
    ["香水櫃有香水", totals.withPerfumes, `共 ${totals.perfumes} 瓶`],
    ["今日選香紀錄", totals.wears, `近 7 天 ${totals.wears7d} 次`],
  ] as const;
  const peak = Math.max(1, ...signups.map((s) => s.count));

  return (
    <section className="page-x pb-24">
      <dl className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
        {tiles.map(([label, value, note]) => (
          <div key={label} className="bg-surface p-5">
            <dt className="label text-muted">{label}</dt>
            <dd className="mt-3 font-display text-h1 font-light text-ink">{value}</dd>
            <dd className="mt-1 text-sm text-muted">{note}</dd>
          </div>
        ))}
      </dl>

      <h2 className="label mt-14 text-muted">近 30 天每日註冊</h2>
      <div className="mt-4 flex h-32 items-end gap-[3px] border-b border-line" role="img" aria-label="近 30 天每日註冊人數">
        {signups.map((s) => (
          <div
            key={s.day}
            title={`${s.day}：${s.count} 人`}
            className="flex-1 bg-blue"
            style={{ height: `${(s.count / peak) * 100}%`, minHeight: s.count ? 2 : 0 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-faint">
        <span>{signups[0]?.day}</span>
        <span>{signups.at(-1)?.day}</span>
      </div>

      <h2 className="label mt-14 text-muted">會員（{members.length}）</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="label text-muted">
            <tr className="border-b border-line">
              <th className="py-3 pr-4 font-normal">會員</th>
              <th className="py-3 pr-4 font-normal">登入方式</th>
              <th className="py-3 pr-4 font-normal">註冊日</th>
              <th className="py-3 pr-4 font-normal">最近使用</th>
              <th className="py-3 pr-4 text-right font-normal">香水</th>
              <th className="py-3 text-right font-normal">選香次數</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} className="border-b border-line text-ink">
                <td className="py-3 pr-4">
                  {m.name}
                  {m.email && m.email !== m.name && <span className="block text-xs text-faint">{m.email}</span>}
                </td>
                <td className="py-3 pr-4">{PROVIDER[m.provider]}</td>
                <td className="py-3 pr-4">{date(m.createdAt)}</td>
                <td className="py-3 pr-4">{date(m.lastSeenAt)}</td>
                <td className="py-3 pr-4 text-right">{m.perfumes}</td>
                <td className="py-3 text-right">{m.wears}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-xs text-faint">
        更新於 {new Date(generatedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
      </p>
    </section>
  );
}
