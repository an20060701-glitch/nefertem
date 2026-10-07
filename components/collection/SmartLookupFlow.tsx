"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { OfficialImage } from "@/lib/fragrance/image/types";
import type { FragranceLookupResult } from "@/lib/fragrance/lookup/types";
import { MAX_QUERY_LENGTH } from "@/lib/fragrance/lookup/types";
import type { Fragrance } from "@/types";
import { FragranceForm, type FragranceFormResult } from "./FragranceForm";
import { NameSuggestInput } from "./NameSuggestInput";

type Step =
  { kind: "query"; error?: string } | { kind: "found"; result: FragranceLookupResult } | { kind: "manual" };

const CONFIDENCE: Record<FragranceLookupResult["confidence"], string> = {
  high: "品牌與名稱完全相符。",
  medium: "名稱部分相符，請確認是同一款。",
  low: "品牌拼法不同，請確認是同一款。",
};

const fieldClass =
  "mt-2 h-12 w-full border-b border-line-strong bg-transparent text-ink outline-none transition-colors placeholder:text-faint focus:border-blue";

/** The brand's own picture for this scent; a slow or failed search just means no picture. */
async function findImage(params: URLSearchParams): Promise<OfficialImage | null> {
  try {
    // v=2: skips answers cached before misses stopped being cached (2026-10-07).
    const res = await fetch(`/api/fragrance/image?${params}&v=2`, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;
    return ((await res.json()) as { image: OfficialImage | null }).image;
  } catch {
    return null;
  }
}

function imageFields(image: OfficialImage | null): Partial<Fragrance> {
  return image ? { imageUrl: image.imageUrl, imageSource: image.pageUrl } : {};
}

/** The form edits a whole Fragrance; fill what we know, leave the rest empty for the user. */
function prefill(fields: Partial<Fragrance>): Fragrance {
  return {
    id: "",
    createdAt: 0,
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    tags: [],
    ...fields,
  } as Fragrance;
}

/**
 * 智能建檔 (architecture §7): brand + name → /api/fragrance/lookup on the server →
 * 「找到以下資料，請確認。」 with its source → editable form → save as origin "lookup".
 * The bottle picture comes from the brand's own site (/api/fragrance/image), found in parallel.
 * Nothing found → offer manual entry with what was typed already filled in.
 */
export function SmartLookupFlow({
  allowImage,
  onSave,
  onBack,
}: {
  allowImage: boolean;
  onSave: (result: FragranceFormResult) => Promise<void>;
  onBack: () => void;
}) {
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<Step>({ kind: "query" });
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [image, setImage] = useState<OfficialImage | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !name.trim()) {
      setStep({ kind: "query", error: "請輸入品牌與香水名稱。" });
      return;
    }
    setSearching(true);
    setNotFound(false);
    setStep({ kind: "query" });
    try {
      const params = new URLSearchParams({ brand: brand.trim(), name: name.trim() });
      const [res, picture] = await Promise.all([fetch(`/api/fragrance/lookup?${params}`), findImage(params)]);
      if (!res.ok) throw new Error(`lookup ${res.status}`);
      const { result } = (await res.json()) as { result: FragranceLookupResult | null };
      setImage(picture);
      if (result) setStep({ kind: "found", result });
      else setNotFound(true);
    } catch (error) {
      console.error("[lookup] request failed", error);
      setStep({ kind: "query", error: "查詢沒有完成，請再試一次。" });
    } finally {
      setSearching(false);
    }
  }

  if (step.kind === "found") {
    const { result } = step;
    return (
      <div>
        <div className="border-b border-line pb-6" role="status">
          <p className="font-serif-zh text-h1-zh text-ink">找到以下資料，請確認。</p>
          <p className="mt-2 text-muted">{CONFIDENCE[result.confidence]}所有欄位都可以修改。</p>
          <p className="mt-4 text-small text-faint">資料來源：{result.sources.join("、")}</p>
        </div>
        <div className="mt-10">
          <FragranceForm
            initial={prefill({
              ...result.fragrance,
              ...imageFields(image),
              origin: "lookup",
              sources: result.sources,
            })}
            allowImage={allowImage}
            submitLabel="確認並放進香水櫃"
            onCancel={() => setStep({ kind: "query" })}
            onSubmit={onSave}
          />
        </div>
      </div>
    );
  }

  if (step.kind === "manual") {
    return (
      <FragranceForm
        initial={prefill({ brand: brand.trim(), name: name.trim(), ...imageFields(image), origin: "manual" })}
        allowImage={allowImage}
        submitLabel="放進香水櫃"
        onCancel={() => setStep({ kind: "query" })}
        onSubmit={onSave}
      />
    );
  }

  return (
    <div>
      <form onSubmit={search} noValidate className="grid gap-10 desk:grid-cols-2 desk:gap-x-16">
        <label className="block">
          <span className="label text-muted">品牌 BRAND</span>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            maxLength={MAX_QUERY_LENGTH}
            placeholder="例如 Creed"
            className={fieldClass}
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="label text-muted">香水名稱 NAME</span>
          <NameSuggestInput
            brand={brand}
            value={name}
            onChange={setName}
            maxLength={MAX_QUERY_LENGTH}
            placeholder="例如 Aventus"
            className={fieldClass}
          />
        </label>
        <div className="flex flex-wrap items-center gap-6 desk:col-span-2">
          <Button type="submit" disabled={searching} aria-busy={searching}>
            {searching ? "查詢中…" : "查詢 · LOOK UP"}
          </Button>
          <Button variant="text" onClick={onBack}>
            ← 返回
          </Button>
        </div>
      </form>

      <div aria-live="polite">
        {step.error && <p className="mt-6 text-small text-danger">{step.error}</p>}
        {notFound && (
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-serif-zh text-lead text-ink">目前找不到這款香水的資料，要改為手動建立嗎？</p>
            <p className="mt-2 text-muted">已輸入的品牌與名稱會直接帶入。</p>
            <Button variant="ghost" className="mt-6" onClick={() => setStep({ kind: "manual" })}>
              改為手動建立
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
