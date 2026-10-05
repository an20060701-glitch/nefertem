import { cn } from "@/lib/cn";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  aside?: React.ReactNode;
  className?: string;
}

/** Editorial page opening: small label, large serif title, Chinese line. */
export function PageHeader({ eyebrow, title, subtitle, aside, className }: PageHeaderProps) {
  return (
    <header
      className={cn("page-x pb-14 pt-6 md:pt-[calc(var(--nav-desktop-height)+3rem)] desk:pb-20", className)}
    >
      <p className="label text-muted">{eyebrow}</p>
      <div className="mt-5 flex flex-col gap-8 desk:flex-row desk:items-end desk:justify-between">
        <div>
          <h1 className="font-display text-h1 font-light text-ink">{title}</h1>
          <p className="mt-4 font-serif-zh text-h1-zh text-ink">{subtitle}</p>
        </div>
        {aside}
      </div>
      <span aria-hidden className="mt-10 block h-px w-full bg-line desk:mt-14" />
    </header>
  );
}
