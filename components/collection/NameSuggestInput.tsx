"use client";

import { useMemo } from "react";
import { nameSuggestions, type NameSuggestion } from "@/lib/fragrance/lookup/catalogue";
import { SuggestInput } from "./SuggestInput";

/**
 * The name field: once a brand is typed, the database's perfumes of that brand open
 * under it, and every letter narrows them. Any name can still be typed freely.
 */
export function NameSuggestInput({
  brand,
  value,
  ...props
}: {
  brand: string;
  value: string;
  onChange: (value: string) => void;
  onPick?: (suggestion: NameSuggestion) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const options = useMemo(() => nameSuggestions(brand, value), [brand, value]);
  return (
    <SuggestInput
      {...props}
      value={value}
      options={options}
      aside={(s) => (s.nameZh && s.nameZh !== s.name ? s.nameZh : undefined)}
    />
  );
}
