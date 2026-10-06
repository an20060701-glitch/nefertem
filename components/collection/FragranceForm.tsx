"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { imageCredit } from "@/lib/fragrance/image/credit";
import type { FragranceDraft } from "@/lib/collection/types";
import { FAMILIES, MOODS } from "@/lib/fragrance/families";
import { deriveMoods, tagToMood } from "@/lib/scent-tags";
import type { Fragrance, FragranceFamily, Mood } from "@/types";
import { NoteInput } from "./NoteInput";

const CONCENTRATIONS = ["EDC", "EDT", "EDP", "Parfum", "Extrait"] as const;
const FAMILY_KEYS = Object.keys(FAMILIES) as FragranceFamily[];

export interface FragranceFormResult {
  draft: FragranceDraft;
  /** A new photo, `null` to remove the current one, undefined to leave it. */
  image?: File | null;
}

interface FragranceFormProps {
  initial?: Fragrance;
  allowImage: boolean;
  submitLabel: string;
  onSubmit: (result: FragranceFormResult) => Promise<void>;
  onCancel: () => void;
}

const fieldClass =
  "mt-2 h-12 w-full border-b border-line-strong bg-transparent text-ink outline-none transition-colors placeholder:text-faint focus:border-blue";

/** 手動建立 / 編輯 — underline fields, notes as chips, moods suggested from the notes. */
export function FragranceForm({ initial, allowImage, submitLabel, onSubmit, onCancel }: FragranceFormProps) {
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [nameZh, setNameZh] = useState(initial?.nameZh ?? "");
  const [concentration, setConcentration] = useState<Fragrance["concentration"] | "">(
    initial?.concentration ?? "",
  );
  const [volume, setVolume] = useState(initial?.volumeMl ? String(initial.volumeMl) : "");
  const [family, setFamily] = useState<FragranceFamily | "">(initial?.family ?? "");
  const [topNotes, setTopNotes] = useState(initial?.topNotes ?? []);
  const [heartNotes, setHeartNotes] = useState(initial?.heartNotes ?? []);
  const [baseNotes, setBaseNotes] = useState(initial?.baseNotes ?? []);
  const [moods, setMoods] = useState<Mood[]>(
    (initial?.tags ?? []).map(tagToMood).filter((m): m is Mood => !!m),
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState<File | null | undefined>(undefined);
  // The brand's own picture, found by smart lookup; the member can decline it.
  const official =
    initial?.imageUrl && initial.imageSource
      ? { url: initial.imageUrl, source: initial.imageSource }
      : undefined;
  const [useOfficial, setUseOfficial] = useState(true);
  const showOfficial = official && useOfficial;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();

  const suggested = deriveMoods({ topNotes, heartNotes, baseNotes });
  const canSuggest = suggested.some((m) => !moods.includes(m));

  const toggleMood = (m: Mood) =>
    setMoods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!brand.trim()) next.brand = "請輸入品牌。";
    if (!name.trim()) next.name = "請輸入香水名稱。";
    if (!family) next.family = "請選擇主要香調。";
    const ml = volume ? Number(volume) : undefined;
    if (volume && (!Number.isFinite(ml) || ml! <= 0 || ml! > 1000))
      next.volume = "容量請輸入 1–1000 之間的數字。";
    setErrors(next);
    if (Object.keys(next).length || !family) return;

    const customTags = (initial?.tags ?? []).filter((t) => !tagToMood(t));
    setSaving(true);
    setSaveError(undefined);
    try {
      await onSubmit({
        draft: {
          brand: brand.trim(),
          name: name.trim(),
          nameZh: nameZh.trim() || undefined,
          concentration: concentration || undefined,
          volumeMl: ml,
          family,
          subFamilies: initial?.subFamilies?.filter((f) => f !== family),
          topNotes,
          heartNotes,
          baseNotes,
          tags: [...moods, ...customTags],
          description: description.trim() || undefined,
          imageUrl: official ? (useOfficial ? official.url : undefined) : initial?.imageUrl,
          imageSource: showOfficial ? official.source : undefined,
          origin: initial?.origin,
          sources: initial?.sources,
        },
        // Declining the official picture clears it on a saved scent too.
        image: official && !useOfficial && image === undefined ? null : image,
      });
    } catch (error) {
      console.error("[collection] save failed", error);
      setSaveError("儲存沒有完成，請再試一次。");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 desk:grid-cols-2 desk:gap-x-16">
      <Field label="品牌 BRAND" error={errors.brand}>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="例如 Le Labo"
          className={fieldClass}
          autoComplete="off"
        />
      </Field>
      <Field label="香水名稱 NAME" error={errors.name}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如 Santal 33"
          className={fieldClass}
          autoComplete="off"
        />
      </Field>
      <Field label="中文名稱 （選填）">
        <input
          value={nameZh}
          onChange={(e) => setNameZh(e.target.value)}
          className={fieldClass}
          autoComplete="off"
        />
      </Field>
      <div className="grid grid-cols-2 gap-8">
        <Field label="濃度">
          <select
            value={concentration}
            onChange={(e) => setConcentration(e.target.value as Fragrance["concentration"] | "")}
            className={fieldClass}
          >
            <option value="">—</option>
            {CONCENTRATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="容量 ML" error={errors.volume}>
          <input
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            inputMode="numeric"
            className={fieldClass}
          />
        </Field>
      </div>

      <fieldset className="desk:col-span-2">
        <legend className="label text-ink">
          主要香調 FAMILY{" "}
          {errors.family && (
            <span className="ml-3 normal-case tracking-normal text-danger">{errors.family}</span>
          )}
        </legend>
        <div role="radiogroup" className="mt-4 flex flex-wrap gap-2">
          {FAMILY_KEYS.map((key) => {
            const f = FAMILIES[key];
            const checked = family === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => setFamily(key)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 border px-3 text-small transition-colors",
                  checked ? "border-blue text-blue" : "border-line text-ink hover:border-ink",
                )}
              >
                <span aria-hidden className="size-2 rounded-full" style={{ background: f.color }} />
                <span className="font-serif-zh">{f.zh}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-8 desk:col-span-2 desk:grid-cols-3">
        <NoteInput label="前調" hint="TOP" value={topNotes} onChange={setTopNotes} />
        <NoteInput label="中調" hint="HEART" value={heartNotes} onChange={setHeartNotes} />
        <NoteInput label="後調" hint="BASE" value={baseNotes} onChange={setBaseNotes} />
      </div>

      <fieldset className="desk:col-span-2">
        <legend className="label text-ink">氣味印象 TAGS</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {MOODS.map((m) => {
            const checked = moods.includes(m.key);
            return (
              <button
                key={m.key}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleMood(m.key)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 border px-3 text-small transition-colors",
                  checked ? "border-blue text-blue" : "border-line text-ink hover:border-ink",
                )}
              >
                <span className="font-serif-zh">{m.zh}</span>
                <span className="label text-faint">{m.en}</span>
              </button>
            );
          })}
        </div>
        {canSuggest && (
          <p className="mt-4 text-small text-muted">
            依香料推導：{suggested.map((m) => MOODS.find((d) => d.key === m)?.zh).join("、")}
            <button
              type="button"
              onClick={() => setMoods((cur) => [...new Set([...cur, ...suggested])])}
              className="gold-underline ml-4 text-blue"
            >
              套用建議
            </button>
          </p>
        )}
      </fieldset>

      <Field label="描述 （選填）" className="desk:col-span-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-y border-b border-line-strong bg-transparent py-2 text-ink outline-none focus:border-blue"
        />
      </Field>

      <div className="desk:col-span-2">
        <p className="label text-ink">照片 PHOTO</p>
        {showOfficial ? (
          <OfficialPicture
            url={official.url}
            source={official.source}
            alt={`${brand} ${name}`}
            onDecline={() => setUseOfficial(false)}
          />
        ) : allowImage ? (
          <div className="mt-3 flex flex-wrap items-center gap-6">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? undefined)}
              className="text-small text-muted file:mr-4 file:h-11 file:border file:border-line-strong file:bg-transparent file:px-4 file:text-ink"
            />
            {initial?.imageUrl && image !== null && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="gold-underline text-small text-muted"
              >
                移除目前照片
              </button>
            )}
          </div>
        ) : (
          <p className="mt-3 text-small text-muted">會以品牌官網圖片或瓶身線稿呈現。</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 desk:col-span-2">
        <Button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? "儲存中…" : submitLabel}
        </Button>
        <Button variant="text" onClick={onCancel}>
          取消
        </Button>
        {saveError && (
          <p role="alert" className="text-small text-danger">
            {saveError}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactElement<{ "aria-invalid"?: boolean }>;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label text-ink">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-small text-danger">
          {error}
        </span>
      )}
    </label>
  );
}

/** The bottle as the brand shows it, credited to the page it came from. */
function OfficialPicture({
  url,
  source,
  alt,
  onDecline,
}: {
  url: string;
  source: string;
  alt: string;
  onDecline: () => void;
}) {
  const credit = imageCredit(source);
  return (
    <div className="mt-3 flex flex-wrap items-end gap-6">
      {/* Linked from the brand's own site, never copied; next/image would proxy and store it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className="h-40 w-32 border border-line object-contain" />
      <div className="text-small text-muted">
        <p>
          圖片來源：
          {credit ? (
            <a
              href={credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-underline text-ink"
            >
              {credit.label} 官網
            </a>
          ) : (
            "品牌官網"
          )}
        </p>
        <button type="button" onClick={onDecline} className="gold-underline mt-3 text-muted">
          不使用這張圖
        </button>
      </div>
    </div>
  );
}
