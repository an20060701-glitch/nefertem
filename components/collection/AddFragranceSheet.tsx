"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FamilyDot } from "@/components/fragrance/FamilyDot";
import { Sheet } from "@/components/ui/Sheet";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { cn } from "@/lib/cn";
import { useCollection } from "./CollectionProvider";
import { FragranceForm, type FragranceFormResult } from "./FragranceForm";
import { addFromForm } from "./saveFragrance";
import { SmartLookupFlow } from "./SmartLookupFlow";

type Mode = "choose" | "manual" | "lookup" | "demo";

const OPTIONS = [
  { mode: "manual", en: "MANUAL", zh: "手動建立", note: "自己輸入品牌、香調與前中後調。" },
  {
    mode: "lookup",
    en: "SMART LOOKUP",
    zh: "智能建檔",
    note: "輸入品牌與名稱，自動帶入香調資料，確認後再存。",
  },
  { mode: "demo", en: "FROM THE CATALOGUE", zh: "從示範目錄挑選", note: "從 18 款示範香水中直接加入。" },
] as const;

/** ADD NEW SCENT — numbered editorial choices, then the chosen way in (design system §7). */
export function AddFragranceSheet({ onClose }: { onClose: () => void }) {
  const { repo, items } = useCollection();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");
  const [adding, setAdding] = useState<string>();
  const owned = new Set(items.map((f) => f.id));

  const title =
    mode === "manual"
      ? "手動建立"
      : mode === "lookup"
        ? "智能建檔"
        : mode === "demo"
          ? "從示範目錄挑選"
          : "新增一瓶香氣";

  async function save(result: FragranceFormResult) {
    const item = await addFromForm(repo, result);
    onClose();
    router.push(`/collection/${encodeURIComponent(item.id)}`);
  }

  return (
    <Sheet label="ADD NEW SCENT" title={title} onClose={onClose}>
      {mode === "choose" && (
        <ol className="border-t border-line">
          {OPTIONS.map((o, i) => (
            <li key={o.mode} className="border-b border-line">
              <button
                type="button"
                onClick={() => setMode(o.mode)}
                className="press-soft group flex w-full items-start gap-6 py-8 text-left desk:gap-10 desk:py-10"
              >
                <span className="font-display text-numeral font-light italic text-gold" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="label block text-faint">{o.en}</span>
                  <span className="mt-2 block font-serif-zh text-h1-zh text-ink transition-colors duration-500 group-hover:text-blue">
                    {o.zh}
                  </span>
                  <span className="mt-2 block text-muted">{o.note}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {mode === "manual" && (
        <FragranceForm
          allowImage={repo.supportsImages}
          submitLabel="放進香水櫃"
          onCancel={() => setMode("choose")}
          onSubmit={save}
        />
      )}

      {mode === "lookup" && (
        <SmartLookupFlow allowImage={repo.supportsImages} onSave={save} onBack={() => setMode("choose")} />
      )}

      {mode === "demo" && (
        <div>
          <p className="text-muted">示範資料整理自公開描述，未經品牌官方驗證。</p>
          <ul className="mt-6 border-t border-line">
            {DEMO_FRAGRANCES.map((f) => {
              const have = owned.has(f.id);
              return (
                <li key={f.id} className="flex items-center justify-between gap-6 border-b border-line py-4">
                  <span>
                    <span className="label block text-faint">{f.brand}</span>
                    <span className="mt-1 block font-display text-h2 font-light text-ink">{f.name}</span>
                    <FamilyDot family={f.family} className="mt-2" />
                  </span>
                  <button
                    type="button"
                    // aria-disabled keeps focus on the button, so Escape still reaches the sheet.
                    aria-disabled={have || adding === f.id}
                    onClick={async () => {
                      if (have || adding) return;
                      setAdding(f.id);
                      try {
                        await repo.add({ ...f }, { id: f.id });
                      } finally {
                        setAdding(undefined);
                      }
                    }}
                    className={cn(
                      "label min-h-11 shrink-0 border px-4 transition-colors",
                      have
                        ? "border-transparent text-gold-text"
                        : "border-line-strong text-ink hover:border-ink",
                    )}
                  >
                    {have ? "已在香水櫃" : adding === f.id ? "加入中…" : "加入 · ADD"}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setMode("choose")}
            className="gold-underline label mt-10 text-blue"
          >
            ← 返回
          </button>
        </div>
      )}
    </Sheet>
  );
}
