import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Lotus line drawing, one serif sentence, one quiet action. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center py-20 text-center", className)}>
      <LotusGlyph size={56} strokeWidth={1} className="text-blue-light" />
      <p className="mt-8 font-serif-zh text-h2 text-ink">{title}</p>
      {description ? <p className="mt-4 max-w-[26em] text-muted">{description}</p> : null}
      {action ? <div className="mt-10">{action}</div> : null}
    </div>
  );
}
