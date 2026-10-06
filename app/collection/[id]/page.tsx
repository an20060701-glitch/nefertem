import type { Metadata } from "next";
import { AccountGate } from "@/components/collection/AccountGate";
import { FragranceDetail } from "@/components/collection/FragranceDetail";

export const metadata: Metadata = {
  title: "香水詳細",
  robots: { index: false },
};

export default async function FragrancePage({ params }: PageProps<"/collection/[id]">) {
  const { id } = await params;
  return (
    <AccountGate>
      <FragranceDetail id={decodeURIComponent(id)} />
    </AccountGate>
  );
}
