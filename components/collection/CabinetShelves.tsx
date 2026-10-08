"use client";

import Link from "next/link";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import type { FragranceFamily, UserFragrance } from "@/types";

/**
 * The cabinet as four shelves by scent family (An, 2026-10-08, after ThreeUI's "Complete Shelf"):
 * each shelf shows its first four bottles standing on a ledge, empty places as small dots,
 * and 全部 opens every scent of that shelf.
 */
export interface Shelf {
  key: string;
  zh: string;
  color: string;
  families: readonly FragranceFamily[];
}

export const SHELVES: readonly Shelf[] = [
  {
    key: "fresh",
    zh: "清新調",
    color: "#5E7A4C",
    families: ["citrus", "fresh", "marine", "fougere", "mineral"],
  },
  { key: "floral", zh: "花香調", color: "#A35A6B", families: ["floral", "fruity"] },
  { key: "woody", zh: "木質調", color: "#7A5C45", families: ["woody", "chypre", "leather"] },
  {
    key: "amber",
    zh: "琥珀調",
    color: "#6A5A8C",
    families: ["amber", "gourmand", "spicy", "musky", "avantgarde"],
  },
];

const PLACES = 4;

export function shelfOf(family: FragranceFamily): Shelf {
  return SHELVES.find((s) => s.families.includes(family)) ?? SHELVES[0];
}

export function CabinetShelves({
  items,
  onOpenShelf,
}: {
  items: readonly UserFragrance[];
  onOpenShelf: (shelf: Shelf) => void;
}) {
  return (
    <div className="grid gap-6 desk:grid-cols-2 desk:gap-8">
      {SHELVES.map((shelf) => {
        const bottles = items.filter((f) => shelfOf(f.family).key === shelf.key);
        return (
          <ShelfPanel key={shelf.key} shelf={shelf} bottles={bottles} onOpen={() => onOpenShelf(shelf)} />
        );
      })}
    </div>
  );
}

function ShelfPanel({
  shelf,
  bottles,
  onOpen,
}: {
  shelf: Shelf;
  bottles: readonly UserFragrance[];
  onOpen: () => void;
}) {
  const shown = bottles.slice(0, PLACES);
  const empty = PLACES - shown.length;
  return (
    <section
      aria-label={`${shelf.zh}，${bottles.length} 瓶`}
      className="relative overflow-hidden rounded-[28px] px-5 pb-5 pt-6 sm:px-8 sm:pt-8"
      style={{ background: `color-mix(in oklab, ${shelf.color} 13%, var(--color-surface-raised, #efe9dc))` }}
    >
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
      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-display text-h2 font-light" style={{ color: shelf.color }}>
          {shelf.zh}
          <span className="label ml-3 align-middle text-faint lining-nums">{bottles.length}</span>
        </h2>
        <button
          type="button"
          onClick={onOpen}
          disabled={bottles.length === 0}
          className="press-soft label flex items-center gap-2 disabled:opacity-40"
          style={{ color: shelf.color }}
        >
          全部 <span aria-hidden>›</span>
        </button>
      </div>
    </section>
  );
}
