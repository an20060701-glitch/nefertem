import type { Metadata } from "next";
import { AccountGate } from "@/components/collection/AccountGate";
import { SiteStatsView } from "@/components/admin/SiteStatsView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "後台",
  robots: { index: false, follow: false },
};

/** Owner-only usage stats; the API answers only for ADMIN_EMAILS. */
export default function AdminPage() {
  return (
    <AccountGate>
      <PageHeader eyebrow="ADMIN" title="SITE USAGE" subtitle="網站使用情形" />
      <SiteStatsView />
    </AccountGate>
  );
}
