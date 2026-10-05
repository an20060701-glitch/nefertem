import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <section className="page-x flex min-h-[70svh] items-center justify-center md:pt-[var(--nav-desktop-height)]">
      <EmptyState
        title="這縷香氣已經散去。"
        description="你要找的頁面不存在。"
        action={
          <ButtonLink href="/" variant="text">
            RETURN TO TODAY&apos;S CHOICE →
          </ButtonLink>
        }
      />
    </section>
  );
}
