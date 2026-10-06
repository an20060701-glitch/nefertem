import { cn } from "@/lib/cn";

interface StoreRowProps {
  href: string;
  name: string;
  zh: string;
  hint: string;
}

/** One giant typographic store link; a gold line runs the full width on hover or focus. */
export function StoreRow({ href, name, zh, hint }: StoreRowProps) {
  return (
    <li className="border-b border-line">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block py-8 outline-none desk:py-10"
      >
        <span className="flex items-baseline justify-between gap-6">
          <span className="font-display text-display font-light text-ink transition-colors duration-500 group-hover:text-blue group-focus-visible:text-blue">
            {name}
          </span>
          <span
            aria-hidden
            className="label shrink-0 text-muted transition-transform duration-500 group-hover:translate-x-1"
          >
            ↗
          </span>
        </span>
        <span className="mt-3 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <span className="font-serif-zh text-ink">{zh}</span>
          <span className="text-small text-muted">{hint}</span>
        </span>
        <span className="sr-only">（在新分頁開啟）</span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gold",
            "transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-x-100 group-focus-visible:scale-x-100",
          )}
        />
      </a>
    </li>
  );
}

export function StoreRowSkeleton() {
  return (
    <li className="border-b border-line py-8 desk:py-10" aria-hidden>
      <span className="skeleton block h-16 w-2/3 max-w-[28rem]" />
      <span className="skeleton mt-4 block h-4 w-40" />
    </li>
  );
}
