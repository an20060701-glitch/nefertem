"use client";

import { useMemo } from "react";
import { brandSuggestions } from "@/lib/fragrance/lookup/catalogue";
import { SuggestInput } from "./SuggestInput";

/**
 * The brand field: the database's brands open under it on focus, and every letter
 * (English or Chinese) narrows them. Any brand can still be typed freely.
 */
export function BrandSuggestInput({
  value,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const options = useMemo(() => brandSuggestions(value), [value]);
  return <SuggestInput {...props} value={value} options={options} aside={(b) => b.zh} />;
}
