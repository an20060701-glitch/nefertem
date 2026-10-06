import type { Metadata } from "next";
import { AccountGate } from "@/components/collection/AccountGate";
import { TodaysChoice } from "@/components/recommendation/TodaysChoice";

export const metadata: Metadata = {
  title: "今日香氣",
  description: "依今天的天氣、場合與想要的印象，從你的香水櫃挑出今天的香氣。",
};

export default function ChoicePage() {
  return (
    <AccountGate>
      <TodaysChoice />
    </AccountGate>
  );
}
