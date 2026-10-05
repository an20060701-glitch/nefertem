import { cn } from "@/lib/cn";

interface AnnotationProps {
  words: string[];
  className?: string;
}

/**
 * The key visual's handwritten margin notes ("Lotus / Aroma / Healing…"),
 * set as a stacked italic word list in lapis ink.
 */
export function Annotation({ words, className }: AnnotationProps) {
  return (
    <ul
      aria-hidden
      className={cn(
        "font-display text-[1.125rem] font-light italic leading-[1.55] text-lotus-deep/80",
        className,
      )}
    >
      {words.map((word) => (
        <li key={word}>{word}</li>
      ))}
    </ul>
  );
}
