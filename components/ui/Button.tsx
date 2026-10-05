import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "text";

const VARIANTS: Record<Variant, string> = {
  // Deep blue block, square corners — the only filled button in the system.
  primary:
    "bg-blue text-inverse px-8 h-14 hover:bg-[#122e52] disabled:bg-faint disabled:text-surface disabled:cursor-not-allowed",
  ghost: "border border-line-strong text-ink px-8 h-14 hover:border-ink",
  text: "gold-underline text-blue h-11",
};

const base =
  "label inline-flex min-h-11 items-center justify-center gap-3 transition-colors duration-300 ease-[var(--ease-editorial)]";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(base, VARIANTS[variant], className)} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, VARIANTS[variant], className)} {...props} />;
}
