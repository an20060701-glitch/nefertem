"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A text field with the database's matching options listed under it while it has
 * focus. Any text can still be typed freely.
 */
export function SuggestInput<T extends { value: string }>({
  options,
  aside,
  value,
  onChange,
  onPick,
  className,
  placeholder,
  maxLength,
}: {
  options: T[];
  /** Quieter text at the right of an option, e.g. its Chinese name. */
  aside?: (option: T) => string | undefined;
  value: string;
  onChange: (value: string) => void;
  onPick?: (option: T) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = useId();
  const listId = `${id}-options`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Nothing left to offer once the field holds exactly the one remaining choice.
  const exact = options.length === 1 && options[0].value === value;
  const shown = open && options.length > 0 && !exact;

  const pick = (s: T) => {
    onChange(s.value);
    onPick?.(s);
    setOpen(false);
    setActive(-1);
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (!shown || e.nativeEvent.isComposing) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (i + 1) % options.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            pick(options[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        role="combobox"
        aria-expanded={shown}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={shown && active >= 0 ? `${listId}-${active}` : undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {shown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 max-h-72 overflow-y-auto border border-t-0 border-line bg-surface-raised shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
        >
          {options.map((s, i) => (
            <li
              key={s.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown, so the pick lands before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-baseline justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0",
                i === active && "bg-surface",
              )}
            >
              <span className="text-ink">{s.value}</span>
              {aside?.(s) && <span className="shrink-0 font-serif-zh text-small text-faint">{aside(s)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
