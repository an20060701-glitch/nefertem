import type { Metadata } from "next";
import { CollectionView } from "@/components/collection/CollectionView";

export const metadata: Metadata = {
  title: "我的香水櫃",
  description: "你的氣味收藏：記錄擁有的香水、香調與使用紀錄。",
};

export default function CollectionPage() {
  return <CollectionView />;
}
