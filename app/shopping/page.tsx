import type { Metadata } from "next";
import { HairlineHeading } from "@/components/brand/EditorialHeading";
import { EgyptianGlyph } from "@/components/brand/EgyptianGlyph";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "搜尋購物",
  description: "輸入品牌或香水名稱，前往蝦皮、momo 或品牌官方網站。",
};

const STORES = [
  { name: "SHOPEE", zh: "蝦皮購物", hint: "Search marketplace" },
  { name: "MOMO", zh: "momo 購物網", hint: "Search marketplace" },
  { name: "OFFICIAL", zh: "品牌官方網站", hint: "Find official retailer" },
];

export default function ShoppingPage() {
  return (
    <>
      <PageHeader eyebrow="SHOPPING" title="FIND YOUR NEXT SCENT" subtitle="找到你的下一瓶香氣。" />
      <section className="page-x pb-24 desk:pb-40" aria-labelledby="search-label">
        <div className="max-w-3xl">
          <label id="search-label" htmlFor="scent-search" className="label text-muted">
            輸入品牌或香水名稱
          </label>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end">
            <input
              id="scent-search"
              type="search"
              disabled
              placeholder="Creed Aventus"
              className="w-full flex-1 border-b border-line-strong bg-transparent pb-3 font-display text-h2 font-light text-ink placeholder:text-faint focus:border-blue focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              className="label h-14 shrink-0 bg-blue px-8 text-inverse disabled:cursor-not-allowed disabled:opacity-60"
            >
              SEARCH SCENT
            </button>
          </div>
          <p className="mt-4 text-small text-faint">搜尋功能即將開放。</p>
        </div>

        <div className="mt-24 flex items-center gap-5 desk:mt-32">
          <EgyptianGlyph name="stalk" size={26} className="shrink-0" />
          <HairlineHeading className="flex-1">WHERE TO FIND IT</HairlineHeading>
        </div>
        <ul className="mt-4">
          {STORES.map((store) => (
            <li key={store.name} className="group border-b border-line py-8 desk:py-10">
              <div className="flex items-baseline justify-between gap-6 text-faint">
                <span className="font-display text-display font-light">{store.name}</span>
                <span className="label hidden md:inline">{store.hint} →</span>
              </div>
              <span className="mt-2 block text-small text-faint">{store.zh}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
