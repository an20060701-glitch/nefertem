"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { PetalScatter } from "@/components/brand/PetalScatter";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { findDemoFragrance } from "@/data/fragrances";
import { byMostWorn, lastUsed, mostUsedThisMonth } from "@/lib/collection/stats";
import { AccountBar } from "./AccountBar";
import { AddFragranceSheet } from "./AddFragranceSheet";
import { CabinetShelves, type Shelf, shelfOf } from "./CabinetShelves";
import { useCollection } from "./CollectionProvider";
import { FragranceCard } from "./FragranceCard";

/** MY COLLECTION — stats, the Digital Perfume Cabinet, and the way to add a scent. */
export function CollectionView() {
  const { items, usage, ready, error } = useCollection();
  const [adding, setAdding] = useState(false);
  const [shelf, setShelf] = useState<Shelf>();
  const [newestFirst, setNewestFirst] = useState(false);
  const sorted = newestFirst ? [...items].sort((a, b) => b.addedAt - a.addedAt) : byMostWorn(items);
  const openShelf = (s: Shelf | undefined) => {
    setShelf(s);
    document.getElementById("cabinet")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nameOf = (id: string) => {
    const f = items.find((i) => i.id === id) ?? findDemoFragrance(id);
    return f?.name ?? "—";
  };
  const top = mostUsedThisMonth(usage);
  const recent = lastUsed(usage);

  return (
    <>
      <PageHeader
        eyebrow="MY COLLECTION"
        title="MY COLLECTION"
        subtitle="你的氣味收藏。"
        aside={
          <dl className="flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt className="label text-muted">SCENTS</dt>
              <dd className="mt-2 font-display text-h1 font-light text-ink lining-nums">
                {ready ? items.length : "—"}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">本月使用最多</dt>
              <dd className="mt-2 font-display text-lead text-ink">
                {top ? (
                  <>
                    {nameOf(top.id)} <span className="label text-faint">× {top.count}</span>
                  </>
                ) : (
                  <span className="text-faint">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">最近使用</dt>
              <dd className="mt-2 font-display text-lead text-ink">
                {recent ? nameOf(recent.fragranceId) : <span className="text-faint">—</span>}
              </dd>
            </div>
          </dl>
        }
      />

      <section id="cabinet" className="page-x relative scroll-mt-24 pb-24" aria-label="香水櫃">
        <PetalScatter side="right" />
        <div className="relative mb-12 flex flex-wrap items-center justify-between gap-6">
          <AccountBar />
          {items.length > 0 && (
            <Button variant="ghost" onClick={() => setAdding(true)}>
              + 新增香水 · ADD SCENT
            </Button>
          )}
        </div>

        {ready && items.length > 0 && usage.length === 0 && (
          // First use (An, 2026-10-06): scents are in, so the next step is today's choice.
          <div className="relative mb-12 flex flex-wrap items-center justify-between gap-6 border border-gold px-6 py-5">
            <p className="text-ink">
              香水櫃準備好了。
              <span className="text-muted">接下來回答兩個問題，從這 {items.length} 款裡找到今天的香氣。</span>
            </p>
            <ButtonLink href="/choice">開始今天的香氣選擇 →</ButtonLink>
          </div>
        )}

        {error ? (
          <EmptyState title={error} description="請重新整理頁面，或稍後再試。" />
        ) : !ready ? (
          <div className="grid gap-8 md:grid-cols-3" aria-busy="true" aria-label="載入中">
            {[0, 1, 2].map((i) => (
              <span key={i} className="skeleton block aspect-square" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="你的香水櫃還是空的。"
            description="把擁有的香水放進來，記錄前調、中調與後調，「香水選擇」就會從你的收藏中推薦。"
            action={<Button onClick={() => setAdding(true)}>新增第一瓶香水</Button>}
          />
        ) : (
          <>
            <div className="relative mb-6 flex items-center justify-between gap-4">
              {shelf ? (
                <button
                  type="button"
                  onClick={() => openShelf(undefined)}
                  className="press-soft label text-blue"
                >
                  ← 所有香調
                </button>
              ) : (
                <h2 className="font-display text-h2 font-light text-ink">我的收藏</h2>
              )}
              <button
                type="button"
                onClick={() => setNewestFirst((v) => !v)}
                className="press-soft label flex items-center gap-2 text-blue"
                aria-label={
                  newestFirst ? "目前依最新加入排序，改為最常使用" : "目前依最常使用排序，改為最新加入"
                }
              >
                <span aria-hidden className="text-lead">
                  ↑↓
                </span>
                {newestFirst ? "最新加入" : "最常使用"}
              </button>
            </div>
            {shelf ? (
              <>
                <h2 className="mb-10 font-display text-h1 font-light" style={{ color: shelf.ink }}>
                  {shelf.zh}
                </h2>
                <div className="relative gap-8 md:columns-2 desk:columns-3 desk:gap-10">
                  {sorted
                    .filter((f) => shelfOf(f.family).key === shelf.key)
                    .map((f, i) => (
                      <Reveal key={f.id} amount={0.15}>
                        <FragranceCard fragrance={f} tall={i % 3 === 1} />
                      </Reveal>
                    ))}
                </div>
              </>
            ) : (
              <CabinetShelves items={sorted} onOpenShelf={openShelf} />
            )}
          </>
        )}
      </section>

      <AnimatePresence>{adding && <AddFragranceSheet onClose={() => setAdding(false)} />}</AnimatePresence>
    </>
  );
}
