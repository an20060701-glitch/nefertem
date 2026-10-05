"use client";

import { useId, useState } from "react";
import { NOTES, noteInfo } from "@/data/notes";

const ENTRIES = Object.entries(NOTES).map(([key, n]) => ({ key, zh: n.zh, en: n.en }));

/** Typed text → a dictionary key when it matches a note's key, Chinese or English name; otherwise kept as written. */
export function resolveNote(text: string): string {
  const t = text.trim();
  if (!t) return "";
  const lower = t.toLowerCase();
  const hit = ENTRIES.find((e) => e.key === lower || e.zh === t || e.en.toLowerCase() === lower);
  return hit?.key ?? t;
}

/**
 * Notes as removable chips. Suggestions come from data/notes.ts, but any
 * note can be typed freely (architecture §7).
 */
export function NoteInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string[];
  onChange: (notes: string[]) => void;
}) {
  const [text, setText] = useState("");
  const id = useId();
  const listId = `${id}-notes`;

  const commit = () => {
    const parts = text
      .split(/[,，、]/)
      .map(resolveNote)
      .filter(Boolean);
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
    setText("");
  };

  return (
    <div>
      <label htmlFor={id} className="label flex items-baseline gap-3 text-ink">
        {label} <span className="text-faint">{hint}</span>
      </label>
      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((note) => (
            <li key={note}>
              <button
                type="button"
                onClick={() => onChange(value.filter((n) => n !== note))}
                className="group inline-flex min-h-9 items-center gap-2 border border-line px-3 font-serif-zh text-small text-ink transition-colors hover:border-ink"
                aria-label={`移除 ${noteInfo(note)?.zh ?? note}`}
              >
                {noteInfo(note)?.zh ?? note}
                <span aria-hidden className="text-faint group-hover:text-ink">
                  ×
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        list={listId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder="輸入香料，按 Enter 加入"
        className="mt-3 h-12 w-full border-b border-line-strong bg-transparent font-serif-zh text-ink outline-none transition-colors placeholder:text-faint focus:border-blue"
      />
      <datalist id={listId}>
        {ENTRIES.map((e) => (
          <option key={e.key} value={e.zh}>
            {e.en}
          </option>
        ))}
      </datalist>
    </div>
  );
}
