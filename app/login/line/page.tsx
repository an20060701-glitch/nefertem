import type { Metadata } from "next";
import { LineFinish } from "@/components/collection/LineFinish";

export const metadata: Metadata = {
  title: "正在以 LINE 登入",
  robots: { index: false },
};

export default function LineLoginPage() {
  return (
    <section className="page-x flex min-h-[80svh] flex-col items-center justify-center py-20 text-center">
      <LineFinish />
    </section>
  );
}
