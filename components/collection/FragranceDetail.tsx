"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HairlineHeading } from "@/components/brand/EditorialHeading";
import { SunDisc } from "@/components/brand/SunDisc";
import { FamilyDot } from "@/components/fragrance/FamilyDot";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sheet } from "@/components/ui/Sheet";
import { guideForFamily } from "@/data/family-guide";
import { noteInfo } from "@/data/notes";
import { imageCredit } from "@/lib/fragrance/image/credit";
import { withSuppliedImage } from "@/lib/fragrance/supplied-image";
import { MOODS } from "@/lib/fragrance/families";
import { tagToMood } from "@/lib/scent-tags";
import { cityLabel } from "@/lib/weather/cities";
import { CONDITION_LABELS } from "@/lib/weather/labels";
import { useCollection } from "./CollectionProvider";
import { FragranceForm } from "./FragranceForm";
import { CONCENTRATION_GUIDE } from "@/data/concentrations";
import { updateFromForm } from "./saveFragrance";

const LAYERS = [
  { key: "topNotes", en: "TOP", zh: "前調" },
  { key: "heartNotes", en: "HEART", zh: "中調" },
  { key: "baseNotes", en: "BASE", zh: "後調" },
] as const;

const dateFormat = new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "long", day: "numeric" });

/** One scent from the cabinet: an editorial spread, its wear history, edit and remove. */
export function FragranceDetail({ id }: { id: string }) {
  const { items, usage, ready, repo } = useCollection();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string>();

  const f = items.find((i) => i.id === id);

  if (!ready) {
    return (
      <div className="page-x pt-10 md:pt-[calc(var(--nav-desktop-height)+3rem)]" aria-busy="true">
        <span className="skeleton block h-[60svh] w-full" />
      </div>
    );
  }
  if (!f) {
    return (
      <div className="page-x pt-10 md:pt-[calc(var(--nav-desktop-height)+3rem)]">
        <EmptyState
          title="香水櫃裡找不到這款香水。"
          description="它可能已被移除，或存在另一台裝置上。"
          action={
            <Link href="/collection" className="gold-underline label text-blue">
              ← 回到香水櫃
            </Link>
          }
        />
      </div>
    );
  }

  const history = usage.filter((u) => u.fragranceId === f.id).sort((a, b) => b.timestamp - a.timestamp);
  const moods = f.tags.map(tagToMood).filter(Boolean);
  const guide = guideForFamily(f.family);
  const shown = withSuppliedImage(f);
  const credit = shown.imageUrl ? imageCredit(shown.imageSource) : undefined;

  async function remove() {
    setRemoving(true);
    setRemoveError(undefined);
    try {
      await repo.remove(f!.id);
      router.push("/collection");
    } catch (error) {
      console.error("[collection] remove failed", error);
      setRemoveError("移除沒有完成，請再試一次。");
      setRemoving(false);
    }
  }

  return (
    <article
      className="page-x pb-24 pt-6 md:pt-[calc(var(--nav-desktop-height)+3rem)]"
      aria-labelledby="scent-name"
    >
      <Link href="/collection" className="gold-underline label text-muted">
        ← MY COLLECTION
      </Link>

      <div className="mt-10 grid gap-12 desk:grid-cols-12 desk:gap-6">
        <figure className="relative mx-auto w-full max-w-[20rem] desk:sticky desk:top-28 desk:col-span-5 desk:max-w-[26rem] desk:self-start">
          <div className="relative aspect-[4/5]">
            <SunDisc
              id="detail-sun"
              className="absolute left-1/2 top-0 w-[78%] -translate-x-1/2 opacity-60"
            />
            <div className="absolute inset-x-0 bottom-0 flex h-[78%] justify-center">
              <FragranceVisual fragrance={f} className="w-[52%]" />
            </div>
          </div>
          {credit && (
            <figcaption className="mt-6 text-center text-small text-faint">
              圖片來源：
              <a href={credit.href} target="_blank" rel="noopener noreferrer" className="gold-underline">
                {credit.label} 官網
              </a>
            </figcaption>
          )}
          {f.origin === "demo" && (
            <figcaption className="label mt-6 text-center text-faint">示範資料 · DEMO DATA</figcaption>
          )}
          {f.origin === "lookup" && (
            <figcaption className="mt-6 text-center">
              <span className="label block text-faint">智能建檔 · SMART LOOKUP</span>
              {f.sources?.length ? (
                <span className="mt-2 block text-small text-faint">資料來源：{f.sources.join("、")}</span>
              ) : null}
            </figcaption>
          )}
        </figure>

        <div className="desk:col-span-6 desk:col-start-7">
          <p className="label text-muted">{f.brand}</p>
          <h1 id="scent-name" className="mt-3 font-display text-display font-light text-ink">
            {f.name}
          </h1>
          {f.nameZh && <p className="mt-2 font-serif-zh text-lead text-muted">{f.nameZh}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <FamilyDot family={f.family} />
            {[
              f.concentration &&
                (f.concentration.length === 3 ? f.concentration : CONCENTRATION_GUIDE[f.concentration].en),
              f.volumeMl && `${f.volumeMl} ML`,
            ]
              .filter(Boolean)
              .map((t) => (
                <span key={String(t)} className="label text-faint">
                  {t}
                </span>
              ))}
          </div>
          {moods.length > 0 && (
            <p className="mt-4 font-serif-zh text-small text-lotus-deep">
              {moods.map((m) => MOODS.find((d) => d.key === m)?.zh).join("　")}
            </p>
          )}
          {f.description && <p className="mt-6 max-w-[30em] text-muted">{f.description}</p>}

          <dl className="mt-10 border-t border-line">
            {LAYERS.map((layer) =>
              f[layer.key].length ? (
                <div key={layer.key} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-4">
                  <dt>
                    <span className="label block text-ink">{layer.en}</span>
                    <span className="text-small text-faint">{layer.zh}</span>
                  </dt>
                  <dd className="font-serif-zh text-ink">
                    {f[layer.key].map((n) => noteInfo(n)?.zh ?? n).join("・")}
                  </dd>
                </div>
              ) : null,
            )}
          </dl>

          {guide && (
            <aside aria-label={`關於${guide.zh}`} className="mt-10 bg-surface-raised p-6 desk:p-8">
              <p className="label text-gold-text">
                {guide.zh} <span className="text-faint">· {guide.en}</span>
              </p>
              <p className="mt-3 text-small text-muted">{guide.description}</p>
            </aside>
          )}

          <section aria-labelledby="history-title" className="mt-14">
            <HairlineHeading as="h2">
              <span id="history-title">
                使用紀錄 <span className="text-faint">WORN · {f.usageCount}</span>
              </span>
            </HairlineHeading>
            {history.length === 0 ? (
              <p className="mt-6 text-muted">
                還沒有使用紀錄。在「香水選擇」按下「就決定是你了」就會記在這裡。
              </p>
            ) : (
              <ul className="mt-2">
                {history.slice(0, 8).map((log) => (
                  <li
                    key={log.id}
                    className="flex flex-wrap justify-between gap-x-6 border-b border-line py-4 text-small"
                  >
                    <span className="text-ink">{dateFormat.format(log.timestamp)}</span>
                    <span className="text-muted">
                      {cityLabel(log.city)} · {Math.round(log.temperature)}°C ·{" "}
                      {CONDITION_LABELS[log.weather]?.zh} · {log.occasion === "indoor" ? "室內" : "戶外"}
                      {log.viaWheel ? " · 輪盤" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            <Button variant="ghost" onClick={() => setEditing(true)}>
              編輯 · EDIT
            </Button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="label min-h-11 text-danger transition-opacity hover:opacity-80"
            >
              從香水櫃移除
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <Sheet key="edit" label="EDIT SCENT" title={`編輯 ${f.name}`} onClose={() => setEditing(false)}>
            <FragranceForm
              initial={f}
              allowImage={repo.supportsImages}
              submitLabel="儲存變更"
              onCancel={() => setEditing(false)}
              onSubmit={async (result) => {
                await updateFromForm(repo, f.id, result);
                setEditing(false);
              }}
            />
          </Sheet>
        )}
        {confirming && (
          <Sheet
            key="remove"
            label="REMOVE SCENT"
            title={`把 ${f.name} 從香水櫃移除？`}
            onClose={() => setConfirming(false)}
          >
            <p className="text-muted">移除後香水資料{f.imageUrl ? "與照片" : ""}會刪除，使用紀錄會保留。</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
              <button
                type="button"
                onClick={remove}
                disabled={removing}
                aria-busy={removing}
                className="label inline-flex h-14 items-center justify-center bg-danger px-8 text-inverse transition-colors hover:bg-[#7f2424] disabled:opacity-60"
              >
                {removing ? "移除中…" : "確定移除"}
              </button>
              <Button variant="text" onClick={() => setConfirming(false)}>
                取消
              </Button>
              {removeError && (
                <p role="alert" className="text-small text-danger">
                  {removeError}
                </p>
              )}
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </article>
  );
}
