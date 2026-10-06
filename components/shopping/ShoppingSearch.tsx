"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { HairlineHeading } from "@/components/brand/EditorialHeading";
import { useCollection } from "@/components/collection/CollectionProvider";
import { BRANDS } from "@/data/brands";
import { FAMILY_GUIDES } from "@/data/family-guide";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { cn } from "@/lib/cn";
import { cleanKeyword, MAX_KEYWORD_LENGTH } from "@/lib/shopping/links";
import { familySearchKeyword, matchSearch } from "@/lib/shopping/normalize";
import { MatchSummary } from "./MatchSummary";
import { WhereToFind } from "./WhereToFind";

const QUICK_PICKS = 6;

/** /shopping: one search line, what we understood, and where to buy it. The query lives in ?q=. */
export function ShoppingSearch({ query }: { query: string }) {
  const router = useRouter();
  const { items } = useCollection();
  const [value, setValue] = useState(query);

  // The member's own scents first, then the demo catalogue.
  const catalogue = useMemo(() => {
    const own = new Set(items.map((i) => i.id));
    return [...items, ...DEMO_FRAGRANCES.filter((f) => !own.has(f.id))];
  }, [items]);
  const ownedIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  const match = useMemo(() => matchSearch(query, catalogue), [query, catalogue]);
  const familyScents = useMemo(
    () =>
      match?.family ? catalogue.filter((f) => match.family!.families.includes(f.family)).slice(0, 8) : [],
    [match, catalogue],
  );

  const suggestions = useMemo(
    () => [
      ...new Set([
        ...catalogue.map((f) => `${f.brand} ${f.name}`),
        ...BRANDS.map((b) => b.name),
        ...FAMILY_GUIDES.map(familySearchKeyword),
      ]),
    ],
    [catalogue],
  );
  const picks = (items.length ? items : DEMO_FRAGRANCES).slice(0, QUICK_PICKS);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = cleanKeyword(value);
    router.push(q ? `/shopping?q=${encodeURIComponent(q)}` : "/shopping", { scroll: false });
  };

  return (
    <section className="page-x pb-24 desk:pb-40" aria-label="搜尋香水">
      <form role="search" onSubmit={submit} className="max-w-3xl">
        <label htmlFor="scent-search" className="label text-muted">
          輸入品牌或香水名稱，中英文都可以
        </label>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end">
          <input
            id="scent-search"
            type="search"
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={MAX_KEYWORD_LENGTH}
            list="scent-suggestions"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Creed Aventus、阿文圖斯"
            className="w-full flex-1 border-b border-line-strong bg-transparent pb-3 font-display text-h2 font-light text-ink placeholder:text-faint focus:border-blue focus:outline-none"
          />
          <datalist id="scent-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <button
            type="submit"
            className="label h-14 shrink-0 bg-blue px-8 text-inverse transition-colors duration-300 hover:bg-ink"
          >
            SEARCH SCENT
          </button>
        </div>
      </form>

      {match ? (
        <div aria-live="polite">
          <div className="mt-16 max-w-4xl desk:mt-20">
            <MatchSummary match={match} familyScents={familyScents} ownedIds={ownedIds} />
          </div>
          <WhereToFind
            key={match.keyword}
            keyword={match.keyword}
            brand={match.brand}
            name={match.fragrance?.name}
          />
        </div>
      ) : (
        <div className="mt-14 max-w-3xl">
          <p className="label text-muted">
            {items.length ? "從你的香水櫃 · FROM YOUR COLLECTION" : "試試看 · TRY"}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {picks.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/shopping?q=${encodeURIComponent(`${f.brand} ${f.name}`)}`}
                  scroll={false}
                  className="gold-underline font-display text-lead text-ink hover:text-blue"
                >
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav aria-labelledby="family-title" className="mt-24 desk:mt-32">
        <HairlineHeading as="h2">
          <span id="family-title">
            依香調探索 <span className="text-faint">EXPLORE BY FAMILY</span>
          </span>
        </HairlineHeading>
        <ul className="mt-2 grid md:grid-cols-2 md:gap-x-10 desk:grid-cols-3">
          {FAMILY_GUIDES.map((g) => {
            const q = familySearchKeyword(g);
            const current = match?.family?.key === g.key;
            return (
              <li key={g.key} className="border-b border-line">
                <Link
                  href={`/shopping?q=${encodeURIComponent(q)}`}
                  scroll={false}
                  aria-current={current ? "true" : undefined}
                  className="group flex min-h-16 flex-col justify-center py-4"
                >
                  <span
                    className={cn(
                      "font-serif-zh text-lead transition-colors duration-500 group-hover:text-blue",
                      current ? "text-blue" : "text-ink",
                    )}
                  >
                    {g.zh}
                  </span>
                  <span className="label mt-1 text-faint">{g.en}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
