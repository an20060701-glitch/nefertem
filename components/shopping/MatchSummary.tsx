import Link from "next/link";
import { FamilyDot } from "@/components/fragrance/FamilyDot";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import type { SearchMatch } from "@/lib/shopping/normalize";
import type { Fragrance } from "@/types";

interface MatchSummaryProps {
  match: SearchMatch;
  /** Scents of the matched family, from the member's collection and the demo catalogue. */
  familyScents: Fragrance[];
  ownedIds: Set<string>;
}

/** What we understood the search to be: a known scent, a family, a brand, or just the words. */
export function MatchSummary({ match, familyScents, ownedIds }: MatchSummaryProps) {
  const { fragrance: f, family, brand } = match;

  if (f) {
    const owned = ownedIds.has(f.id);
    return (
      <div className="grid grid-cols-[5.5rem_1fr] items-center gap-6 md:grid-cols-[7rem_1fr] md:gap-10">
        <div className="aspect-[4/5] bg-surface-raised p-3">
          <FragranceVisual fragrance={f} />
        </div>
        <div>
          <p className="label text-muted">{f.brand}</p>
          <p className="mt-2 font-display text-h2 font-light text-ink">{f.name}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <FamilyDot family={f.family} />
            {owned ? (
              <Link
                href={`/collection/${encodeURIComponent(f.id)}`}
                className="gold-underline text-small text-blue"
              >
                在你的香水櫃裡
              </Link>
            ) : f.origin === "demo" ? (
              <span className="text-small text-faint">示範資料</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (family) {
    return (
      <div className="bg-surface-raised p-6 desk:p-8">
        <p className="label text-gold-text">
          {family.zh} <span className="text-faint">· {family.en}</span>
        </p>
        <p className="mt-3 max-w-[40em] text-small text-muted">{family.description}</p>
        <ul aria-label="氣味特性" className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {family.traits.map((t) => (
            <li key={t} className="font-serif-zh text-small text-lotus-deep">
              {t}
            </li>
          ))}
        </ul>
        {familyScents.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="label text-muted">屬於這個香調 · IN THIS FAMILY</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {familyScents.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/shopping?q=${encodeURIComponent(`${s.brand} ${s.name}`)}`}
                    className="gold-underline font-display text-lead text-ink hover:text-blue"
                  >
                    {s.name}
                  </Link>
                  <span className="ml-2 text-small text-faint">{s.brand}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <p className="text-muted">
      {brand ? (
        <>
          品牌：<span className="text-ink">{brand.name}</span>
          {brand.zh ? <span className="ml-2 font-serif-zh text-ink">{brand.zh}</span> : null}。
        </>
      ) : null}
      目錄裡還沒有這款香水，直接以「<span className="text-ink">{match.keyword}</span>」搜尋。
    </p>
  );
}
