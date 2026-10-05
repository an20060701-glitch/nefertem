export type NavKey = "choice" | "collection" | "shopping";

export interface NavItem {
  key: NavKey;
  href: string;
  labelZh: string;
  labelEn: string;
  /** Shorter English label for the desktop nav, per the brief. */
  labelEnShort: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    key: "choice",
    href: "/",
    labelZh: "香水選擇",
    labelEn: "TODAY'S CHOICE",
    labelEnShort: "TODAY'S CHOICE",
  },
  {
    key: "collection",
    href: "/collection",
    labelZh: "我的香水櫃",
    labelEn: "MY COLLECTION",
    labelEnShort: "MY COLLECTION",
  },
  { key: "shopping", href: "/shopping", labelZh: "搜尋購物", labelEn: "SHOPPING", labelEnShort: "SHOP" },
];

export function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/" || pathname.startsWith("/choice");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
