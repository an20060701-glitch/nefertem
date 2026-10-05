import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "我的香水櫃",
  description: "你的氣味收藏：記錄擁有的香水、香調與使用紀錄。",
};

export default function CollectionPage() {
  return (
    <>
      <PageHeader
        eyebrow="MY COLLECTION"
        title="MY COLLECTION"
        subtitle="你的氣味收藏。"
        aside={
          <dl className="flex gap-12">
            <div>
              <dt className="label text-muted">SCENTS</dt>
              <dd className="mt-2 font-display text-h1 font-light text-ink [font-variant-numeric:lining-nums]">
                0
              </dd>
            </div>
            <div>
              <dt className="label text-muted">本月使用最多</dt>
              <dd className="mt-2 font-serif-zh text-lead text-faint">—</dd>
            </div>
            <div>
              <dt className="label text-muted">最近使用</dt>
              <dd className="mt-2 font-serif-zh text-lead text-faint">—</dd>
            </div>
          </dl>
        }
      />
      <section className="page-x pb-24" aria-label="香水櫃">
        <EmptyState
          title="你的香水櫃還是空的。"
          description="登入後，就能把擁有的香水放進來，記錄前調、中調與後調，以及每一次的使用。"
          action={
            <ButtonLink href="/login" variant="text">
              ENTER YOUR SCENT JOURNEY →
            </ButtonLink>
          }
        />
      </section>
    </>
  );
}
