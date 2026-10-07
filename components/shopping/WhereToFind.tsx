"use client";

import { useEffect, useState } from "react";
import { HairlineHeading } from "@/components/brand/EditorialHeading";
import { EgyptianGlyph } from "@/components/brand/EgyptianGlyph";
import type { BrandInfo } from "@/data/brands";
import { STORES, storeSearchUrl } from "@/lib/shopping/links";
import type { OfficialLink } from "@/lib/shopping/official/types";
import { StoreRow, StoreRowSkeleton } from "./StoreRow";

interface WhereToFindProps {
  keyword: string;
  brand?: BrandInfo;
  /** Perfume name for the official-site search. */
  name?: string;
  /** The matched bottle, so the official link can open its own page. */
  id?: string;
  concentration?: string;
}

type Official = { key: string; link: OfficialLink | null };

/** WHERE TO FIND IT: Shopee, momo and 香水1976 searches, plus the brand's own site when we know the brand. */
export function WhereToFind({ keyword, brand, name, id, concentration }: WhereToFindProps) {
  const officialKey = brand ? `${brand.key}|${name ?? ""}|${id ?? ""}|${concentration ?? ""}` : "";
  const [official, setOfficial] = useState<Official>();

  useEffect(() => {
    if (!brand) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ brand: brand.key });
    if (name) params.set("name", name);
    if (id) params.set("id", id);
    if (concentration) params.set("concentration", concentration);
    fetch(`/api/shopping/official?${params}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { link: null }))
      .then((data: { link: OfficialLink | null }) => setOfficial({ key: officialKey, link: data.link }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setOfficial({ key: officialKey, link: null });
        if (!controller.signal.aborted) console.error("[official] lookup failed", error);
      });
    return () => controller.abort();
  }, [brand, name, id, concentration, officialKey]);

  const current = official?.key === officialKey ? official : undefined;
  const officialHint = (link: OfficialLink) =>
    link.kind === "search" ? `${link.label}（我們尚未收錄網址）` : link.label;

  return (
    <section aria-labelledby="where-title" className="mt-20 desk:mt-28">
      <div className="flex items-center gap-5">
        <EgyptianGlyph name="stalk" size={26} className="shrink-0" />
        <HairlineHeading className="flex-1">
          <span id="where-title">WHERE TO FIND IT</span>
        </HairlineHeading>
      </div>
      <ul className="mt-4">
        {(Object.keys(STORES) as (keyof typeof STORES)[]).map((key) => (
          <StoreRow
            key={key}
            href={storeSearchUrl(key, keyword)}
            name={STORES[key].name}
            zh={STORES[key].zh}
            hint={`搜尋「${keyword}」`}
          />
        ))}
        {brand &&
          (current ? (
            current.link && (
              <StoreRow
                href={current.link.url}
                name="OFFICIAL"
                zh="品牌官方網站"
                hint={officialHint(current.link)}
              />
            )
          ) : (
            <StoreRowSkeleton />
          ))}
      </ul>
      <p className="mt-8 max-w-[38em] text-small text-faint">
        連結會在新分頁開啟。Nefertem 不經手交易，價格、庫存與商品真偽請以各平台與品牌官方公告為準。
      </p>
    </section>
  );
}
