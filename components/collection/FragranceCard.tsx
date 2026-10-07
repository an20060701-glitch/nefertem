import Link from "next/link";
import { FamilyDot } from "@/components/fragrance/FamilyDot";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import { cn } from "@/lib/cn";
import type { UserFragrance } from "@/types";

const dateFormat = new Intl.DateTimeFormat("zh-TW", { month: "long", day: "numeric" });

/** One scent in the Digital Perfume Cabinet: flacon, brand, name, family and how often it is worn. */
export function FragranceCard({ fragrance, tall }: { fragrance: UserFragrance; tall?: boolean }) {
  return (
    <Link
      href={`/collection/${encodeURIComponent(fragrance.id)}`}
      className="press-soft group block break-inside-avoid pb-12"
      aria-label={`${fragrance.brand} ${fragrance.name}`}
    >
      <div
        className={cn(
          "relative flex items-end justify-center bg-surface-raised p-8 transition-colors duration-700 group-hover:bg-[#ebe5d8]",
          tall ? "aspect-[3/4]" : "aspect-square",
        )}
      >
        <FragranceVisual
          fragrance={fragrance}
          className="max-h-full w-[46%] transition-transform duration-1000 ease-[var(--ease-editorial)] group-hover:-translate-y-1"
        />
        {fragrance.origin === "demo" && (
          <span className="label absolute left-4 top-4 text-faint">示範資料</span>
        )}
      </div>
      <p className="label mt-5 text-muted">{fragrance.brand}</p>
      <p className="mt-1 font-display text-h2 font-light text-ink transition-colors duration-500 group-hover:text-blue">
        {fragrance.name}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <FamilyDot family={fragrance.family} />
        <span className="label text-faint">
          {fragrance.usageCount > 0
            ? `${fragrance.usageCount} 次${fragrance.lastUsedAt ? ` · ${dateFormat.format(fragrance.lastUsedAt)}` : ""}`
            : "尚未使用"}
        </span>
      </div>
    </Link>
  );
}
