import type { Metadata } from "next";
import { AccountGate } from "@/components/collection/AccountGate";
import { ShoppingSearch } from "@/components/shopping/ShoppingSearch";
import { PageHeader } from "@/components/ui/PageHeader";
import { cleanKeyword } from "@/lib/shopping/links";

export const metadata: Metadata = {
  title: "搜尋購物",
  description: "輸入品牌或香水名稱，前往蝦皮、momo、香水1976 或品牌官方網站。",
};

export default async function ShoppingPage({ searchParams }: PageProps<"/shopping">) {
  const raw = (await searchParams).q;
  const query = cleanKeyword(Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? ""));

  return (
    <AccountGate>
      <PageHeader eyebrow="SHOPPING" title="FIND YOUR NEXT SCENT" subtitle="找到你的下一瓶香氣。" />
      {/* Keyed by the query so the search line shows what was searched after back/forward. */}
      <ShoppingSearch key={query} query={query} />
    </AccountGate>
  );
}
