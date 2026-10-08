"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import { FAMILIES } from "@/lib/fragrance/families";
import type { FragranceFamily, UserFragrance } from "@/types";
import { useCollection } from "./CollectionProvider";

/**
 * The cabinet as shelves (An, 2026-10-08, after ThreeUI's "Complete Shelf"): one shelf for
 * every scent family, each showing its first four bottles standing on a ledge, empty places
 * as small dots, and 全部 opening every scent of that shelf. A shelf's X takes the shelf away
 * (its scents stay in the collection); taken-away shelves can be put back below.
 */
export interface Shelf {
  key: FragranceFamily;
  zh: string;
  color: string;
  /** The family colour darkened enough to read as text on the shelf's tint. */
  ink: string;
}

export const SHELVES: readonly Shelf[] = Object.values(FAMILIES).map((f) => ({
  key: f.key,
  zh: [...f.zh].length <= 2 ? `${f.zh}調` : f.zh,
  color: f.color,
  ink: `color-mix(in oklab, ${f.color} 78%, #151515)`,
}));

const PLACES = 4;

export function shelfOf(family: FragranceFamily): Shelf {
  return SHELVES.find((s) => s.key === family) ?? SHELVES[0];
}

export function CabinetShelves({
  items,
  onOpenShelf,
}: {
  items: readonly UserFragrance[];
  onOpenShelf: (shelf: Shelf) => void;
}) {
  const { repo } = useCollection();
  const [hidden, setHidden] = useState<{ repo: unknown; keys: string[] }>();
  useEffect(() => repo.subscribeHiddenShelves((keys) => setHidden({ repo, keys })), [repo]);
  const hiddenKeys = hidden?.repo === repo ? hidden.keys : [];

  const save = (keys: string[]) => {
    setHidden({ repo, keys });
    void repo.setHiddenShelves(keys).catch(() => undefined);
  };
  const shown = SHELVES.filter((s) => !hiddenKeys.includes(s.key));
  const away = SHELVES.filter((s) => hiddenKeys.includes(s.key));
  const awayBottles = items.filter((f) => hiddenKeys.includes(shelfOf(f.family).key)).length;

  return (
    <>
      <div className="grid gap-6 desk:grid-cols-2 desk:gap-8">
        {shown.map((shelf) => (
          <ShelfPanel
            key={shelf.key}
            shelf={shelf}
            bottles={items.filter((f) => shelfOf(f.family).key === shelf.key)}
            onOpen={() => onOpenShelf(shelf)}
            onRemove={() => save([...hiddenKeys, shelf.key])}
          />
        ))}
      </div>

      {away.length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <p className="label text-muted">
            已移除的櫃子
            {awayBottles > 0 && <span className="text-faint"> · 裡面的 {awayBottles} 瓶香水仍在收藏中</span>}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {away.map((shelf) => (
              <button
                key={shelf.key}
                type="button"
                onClick={() => save(hiddenKeys.filter((k) => k !== shelf.key))}
                className="press-soft label flex items-center gap-2 rounded-full border px-4 py-2"
                style={{
                  color: shelf.ink,
                  borderColor: `color-mix(in oklab, ${shelf.color} 45%, transparent)`,
                }}
                aria-label={`放回${shelf.zh}櫃`}
              >
                <span aria-hidden>＋</span> {shelf.zh}
              </button>
            ))}
            {away.length > 1 && (
              <button type="button" onClick={() => save([])} className="press-soft label px-2 text-blue">
                全部放回
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ShelfPanel({
  shelf,
  bottles,
  onOpen,
  onRemove,
}: {
  shelf: Shelf;
  bottles: readonly UserFragrance[];
  onOpen: () => void;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const shown = bottles.slice(0, PLACES);
  const empty = PLACES - shown.length;
  return (
    <section
      aria-label={`${shelf.zh}，${bottles.length} 瓶`}
      className="relative overflow-hidden rounded-[28px] px-5 pb-5 pt-6 sm:px-8 sm:pt-8"
      style={{ background: `color-mix(in oklab, ${shelf.color} 13%, var(--color-surface-raised))` }}
    >
      <button
        type="button"
        onClick={() => (bottles.length > 0 ? setConfirming(true) : onRemove())}
        className="press-soft absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full text-lead transition-colors hover:bg-black/5"
        style={{ color: shelf.ink }}
        aria-label={`移除${shelf.zh}櫃`}
      >
        <span aria-hidden>×</span>
      </button>

      <div className="relative grid grid-cols-4 items-end gap-2 [perspective:900px] sm:gap-4">
        {shown.map((f) => (
          <Link
            key={f.id}
            href={`/collection/${encodeURIComponent(f.id)}`}
            aria-label={`${f.brand} ${f.name}`}
            className="group relative flex aspect-[3/5] items-end justify-center outline-offset-4"
          >
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 h-2.5 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-[6px] transition-all duration-700 group-hover:w-[56%] group-hover:opacity-60"
            />
            <FragranceVisual
              fragrance={f}
              className="relative max-h-full w-[86%] origin-bottom object-bottom transition-transform duration-700 ease-[var(--ease-editorial)] motion-safe:group-hover:[transform:translateY(-6px)_rotateY(-14deg)]"
            />
          </Link>
        ))}
        {Array.from({ length: empty }, (_, i) => (
          <span key={`empty-${i}`} aria-hidden className="flex aspect-[3/5] items-center justify-center">
            <span className="size-3 rounded-full opacity-45" style={{ background: shelf.color }} />
          </span>
        ))}
      </div>
      {/* The ledge the bottles stand on. */}
      <div
        aria-hidden
        className="-mt-0.5 h-2 rounded-full"
        style={{
          background: `linear-gradient(to bottom, color-mix(in oklab, ${shelf.color} 35%, white), color-mix(in oklab, ${shelf.color} 22%, transparent))`,
          boxShadow: `0 6px 14px -8px ${shelf.color}`,
        }}
      />

      {confirming ? (
        <div
          className="mt-5 flex flex-wrap items-center justify-between gap-3"
          role="group"
          aria-label="確認移除"
        >
          <p className="text-small text-ink">
            移除{shelf.zh}櫃？<span className="text-muted">裡面的 {bottles.length} 瓶香水不會刪除。</span>
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="press-soft label text-muted"
            >
              取消
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="press-soft label"
              style={{ color: shelf.ink }}
            >
              移除
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between">
          <h2 className="font-display text-h2 font-light" style={{ color: shelf.ink }}>
            {/* The shelf's name opens it too, like 全部 (An, 2026-10-08). */}
            <button
              type="button"
              onClick={onOpen}
              disabled={bottles.length === 0}
              className="press-soft text-left"
            >
              {shelf.zh}
            </button>
            <span className="label ml-3 align-middle text-faint lining-nums">{bottles.length}</span>
          </h2>
          <button
            type="button"
            onClick={onOpen}
            disabled={bottles.length === 0}
            className="press-soft label flex items-center gap-2 disabled:opacity-40"
            style={{ color: shelf.ink }}
          >
            全部 <span aria-hidden>›</span>
          </button>
        </div>
      )}
    </section>
  );
}
