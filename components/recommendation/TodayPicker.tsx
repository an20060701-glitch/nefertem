"use client";

import { FamilyDot } from "@/components/fragrance/FamilyDot";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";
import type { Fragrance } from "@/types";

export interface PickerEntry {
  fragrance: Fragrance;
  /** Times worn, all time. */
  wears: number;
}

/**
 * 「今天想噴哪一瓶？」(An, 2026-10-06): the visitor picks any scent in their
 * cabinet. Row one is today's recommendation; row two is everything else,
 * most worn first.
 */
export function TodayPicker({
  recommended,
  others,
  onChoose,
  onClose,
}: {
  recommended: PickerEntry[];
  others: PickerEntry[];
  onChoose: (fragranceId: string) => void;
  onClose: () => void;
}) {
  return (
    <Sheet label="TODAY'S SCENT" title="今天，想噴哪一瓶？" onClose={onClose}>
      <PickerRow
        label="今日推薦 · RECOMMENDED FOR TODAY"
        note="依今天的天氣、場合與你選的印象排序。"
        entries={recommended}
        onChoose={onChoose}
        highlightFirst
      />
      {others.length > 0 && (
        <PickerRow
          label="你最常噴的 · MOST WORN"
          note="香水櫃裡其他的香水，依你噴過的次數由多到少。"
          entries={others}
          onChoose={onChoose}
          className="mt-14"
        />
      )}
    </Sheet>
  );
}

function PickerRow({
  label,
  note,
  entries,
  onChoose,
  highlightFirst = false,
  className,
}: {
  label: string;
  note: string;
  entries: PickerEntry[];
  onChoose: (fragranceId: string) => void;
  highlightFirst?: boolean;
  className?: string;
}) {
  return (
    <section className={className} aria-label={label}>
      <p className="label text-gold-text">{label}</p>
      <p className="mt-2 text-small text-muted">{note}</p>
      {/* One row that scrolls sideways, so the sheet stays short on phones. */}
      <ul className="-mx-[var(--gutter)] mt-6 flex snap-x gap-4 overflow-x-auto px-[var(--gutter)] pb-4 desk:mx-0 desk:px-0">
        {entries.map(({ fragrance: f, wears }, i) => (
          <li key={f.id} className="w-40 shrink-0 snap-start desk:w-48">
            <button
              type="button"
              onClick={() => onChoose(f.id)}
              className={cn(
                "group flex h-full w-full flex-col border p-4 text-left transition-colors duration-500",
                highlightFirst && i === 0 ? "border-gold" : "border-line hover:border-ink",
              )}
            >
              <span className="relative block aspect-[4/5] w-full bg-surface-raised">
                <FragranceVisual fragrance={f} className="absolute inset-0 p-3" />
              </span>
              <span className="label mt-4 block truncate text-faint">{f.brand}</span>
              <span className="mt-1 block font-display text-lead font-light leading-tight text-ink transition-colors duration-500 group-hover:text-blue">
                {f.name}
              </span>
              <span className="mt-auto flex items-center justify-between gap-2 pt-3 text-small text-muted">
                <FamilyDot family={f.family} />
                <span className="shrink-0 lining-nums">{wears > 0 ? `噴過 ${wears} 次` : "還沒噴過"}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
