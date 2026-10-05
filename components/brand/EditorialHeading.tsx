import { cn } from "@/lib/cn";

interface EditorialNumberProps {
  index: number;
  label: string;
  className?: string;
}

/** "01  THE WEATHER" — gold italic numeral paired with an uppercase label. */
export function EditorialNumber({ index, label, className }: EditorialNumberProps) {
  return (
    <div className={cn("flex items-baseline gap-4", className)}>
      <span className="font-display text-numeral font-light italic text-gold" aria-hidden>
        {String(index).padStart(2, "0")}
      </span>
      <span className="label text-muted">{label}</span>
    </div>
  );
}

interface HairlineHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "p";
}

/** "WHERE TO FIND IT ─────────" — a label followed by a hairline to the edge. */
export function HairlineHeading({ children, className, as: Tag = "h2" }: HairlineHeadingProps) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <Tag className="label shrink-0 text-ink">{children}</Tag>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  );
}
