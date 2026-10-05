# 香水人生 Architecture

> 狀態：v0.3（2026-10-05）
> 網站名稱：**香水人生**（A LIFE IN SCENT）。NEFERTEM 為品牌靈感來源。
> 搭配文件：[NEFERTEM-DESIGN-SYSTEM.md](./NEFERTEM-DESIGN-SYSTEM.md)
> 第一版目標：一個真正能跑、漂亮、流暢、穩定的 MVP。不為未來的 AI、爬蟲、推薦模型、聯盟行銷預先建複雜後端。

---

## 1. 產品範圍

香水人生 幫使用者找到「今天最適合自己的氣味」，三個主要區塊：

| 區塊 | Route | 核心 |
|---|---|---|
| 香水選擇 TODAY'S CHOICE | `/` | Hero → 天氣 → 場合 → 氣味印象 → 推薦結果（含推薦理由）→ 選擇障礙輪盤 → 確認使用並記錄 |
| 我的香水櫃 MY COLLECTION | `/collection` | 香水櫃、使用統計、手動建立、智能建檔、編輯、刪除 |
| 搜尋購物 SHOPPING | `/shopping` | 輸入品牌或香水名 → 蝦皮、momo、品牌官網連結 |
| 登入 | `/login` | Firebase Google 登入 |

**v1 不做**：即時比價、爬蟲、AI 擷取、社群、多語系切換（介面為中英雙語並列，但不做語系切換）。

---

## 2. 技術選型

| 層 | 選擇 |
|---|---|
| 框架 | Next.js（最新穩定版）App Router + TypeScript（strict） |
| 樣式 | Tailwind CSS v4，tokens 定義於 `app/globals.css` |
| UI 行為 | shadcn/ui（只取 Dialog、Sheet、Toast 等行為，樣式全部重寫）、Radix |
| 動畫 | Motion（Framer Motion），統一由 `lib/motion.ts` 管理 |
| 圖示 | Lucide + 自繪品牌 SVG（蓮花、瓶身、羅盤） |
| 會員 | Firebase Authentication（Google） |
| 資料庫 | Cloud Firestore |
| 檔案 | Firebase Storage（使用者上傳的香水照片） |
| 天氣 | `WeatherProvider` 抽象：OpenWeatherMap／中央氣象署／Mock |
| 部署 | Vercel（Firebase 只當 BaaS） |
| 品質 | ESLint、Prettier、`tsc --noEmit`、Vitest（推薦引擎、URL 產生器、天氣分類）、GitHub Actions CI |

---

## 3. Project Structure

```
nefertem/
├─ app/
│  ├─ layout.tsx               # 字體、metadata、GrainOverlay、Navigation、PageTransition、AuthProvider
│  ├─ globals.css              # Design tokens
│  ├─ fonts.ts
│  ├─ page.tsx                 # Hero + Today's Choice 流程
│  ├─ collection/page.tsx
│  ├─ shopping/page.tsx
│  ├─ login/page.tsx
│  ├─ not-found.tsx / error.tsx
│  └─ api/
│     ├─ weather/route.ts              # 伺服器端呼叫天氣 API（金鑰不進 client）
│     ├─ fragrance/lookup/route.ts     # 智能建檔
│     └─ shopping/official/route.ts    # 官網搜尋
├─ components/
│  ├─ ui/  brand/  navigation/  hero/
│  ├─ recommendation/  fragrance/  collection/  shopping/
├─ lib/
│  ├─ motion.ts
│  ├─ firebase/
│  │  ├─ client.ts             # 初始化（只用 NEXT_PUBLIC_ 設定）
│  │  ├─ auth.ts               # signInWithGoogle / signOut / onAuth
│  │  └─ repositories/         # userRepo、collectionRepo、usageRepo（UI 不直接呼叫 Firestore）
│  ├─ weather/
│  │  ├─ types.ts              # WeatherProvider 介面
│  │  ├─ openweathermap.ts
│  │  ├─ cwa.ts                # 中央氣象署（第二階段）
│  │  ├─ mock.ts
│  │  └─ index.ts              # getWeather()：依環境變數選 provider，失敗回退 mock
│  ├─ recommendation/
│  │  ├─ rules.ts              # 權重表（純設定）
│  │  ├─ engine.ts             # scoring + 排序
│  │  └─ explain.ts            # 產生「為什麼推薦給你？」文字
│  ├─ fragrance/
│  │  ├─ families.ts           # 香調家族定義與色票
│  │  ├─ provider.ts           # FragranceDataProvider 介面 + registry
│  │  └─ providers/mock.ts
│  ├─ scent-tags.ts            # 香料 → 印象 tags
│  └─ shopping/
│     ├─ links.ts              # 蝦皮、momo URL 產生器
│     └─ official/             # OfficialSearchProvider（mock / google-cse）
├─ data/
│  ├─ fragrances.ts            # 12–20 款 demo 香水（明確標示 demo）
│  ├─ notes.ts                 # 香料字典（中英名、家族）
│  └─ brands.ts                # 品牌、中文名、官網網域
├─ hooks/                      # useAuth、useWeather、useCollection、useReducedMotion…
├─ types/                      # Fragrance、UserFragrance、UsageLog、Weather…
├─ public/images/              # nefertem-reference.png（待提供）
├─ firestore.rules
├─ storage.rules
├─ firebase.json
├─ .env.example
└─ docs/
```

原則：page.tsx 只組合元件；資料存取經過 `repositories/`；外部服務經過 provider 介面；推薦邏輯是純函式、可單元測試。

---

## 4. 資料結構

### 4.1 TypeScript Types（`types/`）

```ts
export type FragranceFamily =
  | 'citrus' | 'fresh' | 'marine' | 'floral' | 'fruity' | 'fougere' | 'chypre'
  | 'woody' | 'amber' | 'gourmand' | 'spicy' | 'musky' | 'leather' | 'mineral' | 'avantgarde';

export type Mood =
  | 'mysterious' | 'fresh' | 'warm' | 'calm' | 'mature' | 'seductive' | 'bold';

export type Occasion = 'indoor' | 'outdoor';

export type DataOrigin = 'demo' | 'manual' | 'lookup';

export interface Fragrance {
  id: string;
  brand: string;              // "Creed"
  name: string;               // "Aventus"
  nameZh?: string;            // "阿文圖斯"
  concentration?: 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Extrait';
  volumeMl?: number;
  imageUrl?: string;
  family: FragranceFamily;            // 主家族
  subFamilies?: FragranceFamily[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  tags: (Mood | string)[];            // 內建 Mood 或自訂 tag
  description?: string;
  origin: DataOrigin;                 // demo 資料會在 UI 標示「示範資料」
  sources?: string[];                 // 智能建檔的資料出處
  createdAt: number;
}

export interface UserFragrance extends Fragrance {   // 存在 users/{uid}/fragrances
  addedAt: number;
  usageCount: number;
  lastUsedAt?: number;
}

export interface UsageLog {
  id: string;
  fragranceId: string;
  timestamp: number;
  weather: WeatherCondition;          // 'clear' | 'cloudy' | 'rain' | 'storm' | ...
  temperature: number;
  city: string;
  occasion: Occasion;
  mood: Mood[];
  viaWheel: boolean;                  // 是否由選擇障礙輪盤決定
}

export interface WeatherSnapshot {
  city: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  isRainy: boolean;
  isHot: boolean;                     // ≥ 26°C
  isCold: boolean;                    // ≤ 18°C
  source: 'openweathermap' | 'cwa' | 'mock';
}
```

使用者收藏存完整 `Fragrance` 資料（而不是只存 id 再查共用目錄），因為手動建立、智能建檔的資料都屬於使用者自己，v1 也沒有共用的線上目錄。demo 目錄是靜態的 `data/fragrances.ts`。

### 4.2 Firestore

```
users/{uid}
  uid, displayName, email, photoURL, createdAt, lastLoginAt

users/{uid}/fragrances/{fragranceId}     → UserFragrance
users/{uid}/usageLogs/{logId}            → UsageLog
```

- 只存 Google 提供的必要個資；不存定位座標（只存城市名）。
- `usageCount`、`lastUsedAt` 在寫入 `usageLogs` 時用同一個 `writeBatch` 一起更新（`increment(1)`），確保一致。
- 「本月使用最多」由 `usageLogs` 以 `timestamp >= 月初` 查詢後於 client 聚合（個人資料量小，不需 Cloud Functions）。

### 4.3 Firebase Security Rules

```js
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /{sub=**} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}

// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid
        && (request.resource == null
            || (request.resource.size < 5 * 1024 * 1024
                && request.resource.contentType.matches('image/.*')));
    }
  }
}
```

---

## 5. 會員與登入

- `lib/firebase/auth.ts`：`signInWithPopup(GoogleAuthProvider)`；手機瀏覽器 popup 被擋時改用 `signInWithRedirect`。
- `AuthProvider`（client）提供 `user`、`loading`；首次登入時建立 `users/{uid}`，之後每次更新 `lastLoginAt`。
- **訪客模式（預設決定）**：Hero 與 Today's Choice 不需登入即可體驗，推薦來源為 demo 香水；按「就決定是你了」、進入香水櫃時才要求登入。這樣第一次打開網站先看到品牌體驗，而不是登入牆。（見 §11 待決事項 1）

---

## 6. Today's Choice

### 6.1 流程狀態

`useChoiceFlow()` 以 reducer 管理：`hero → weather → occasion → mood → result → (wheel) → confirmed`。每步驟的選擇保存在 URL search params（`?occasion=indoor&mood=mysterious`），重新整理不會遺失，也可用瀏覽器返回鍵回到上一步。

### 6.2 天氣（`lib/weather/`）

```ts
export interface WeatherProvider {
  name: 'openweathermap' | 'cwa' | 'mock';
  getWeather(location: { lat: number; lon: number } | { city: CityKey }): Promise<WeatherSnapshot>;
}
export async function getWeather(location): Promise<WeatherSnapshot>; // 選 provider + fallback
```

- Client 用 `navigator.geolocation` 取座標，呼叫 `/api/weather`；金鑰只存在伺服器端。
- 拒絕定位、逾時（5s）或 API 失敗：顯示「暫時無法取得天氣。」並提供「使用預設城市」：台北、台中、高雄、台南、新竹。
- 沒有設定 `OPENWEATHER_API_KEY` 時自動使用 mock（依城市與月份回傳合理數值），網站照常運作，UI 角落以小字標示「示範天氣」。
- 伺服器端快取：同城市 30 分鐘。

### 6.3 推薦引擎（`lib/recommendation/`）

**輸入**：`WeatherSnapshot`、`Occasion`、`Mood[]`（1–2 個）、候選香水（已登入：使用者香水櫃；香水櫃為空或訪客：demo 目錄）、使用紀錄。

**Mood → 家族權重**（`rules.ts`，依 An 的規則，數值可調）：

| Mood | 主要家族（權重 1.0） | 次要家族（0.5） |
|---|---|---|
| 神秘 mysterious | amber | woody、leather、musky |
| 清新 fresh | citrus、fresh | marine、fougere |
| 溫暖 warm | woody、gourmand | amber、spicy |
| 平靜 calm | woody、fougere、chypre | musky |
| 成熟 mature | fougere、chypre | woody、leather |
| 誘人 seductive | floral、amber | gourmand、musky |
| 侵略性 bold | marine、mineral、avantgarde | leather、spicy |

（「Oriental」在資料中統一歸入 `amber`。）

**分數組成**（每項 0–1，加權後相加）：

| 項目 | 權重 | 計算 |
|---|---|---|
| `moodScore` | 0.35 | 香水主家族／次家族對所選 Mood 的權重；兩個 Mood 取平均 |
| `weatherScore` | 0.10 | 雨天加分 woody、amber、musky、chypre；扣 marine、citrus |
| `temperatureScore` | 0.15 | isHot：citrus、fresh、marine 加分，gourmand、amber、leather 扣分；isCold 反之 |
| `occasionScore` | 0.10 | 室內：musky、floral、woody 等貼膚香型加分，濃烈的 avantgarde、leather 扣分；戶外：citrus、fresh、marine 加分 |
| `familyScore` | 0.10 | 香料層級的家族吻合度：用 `data/notes.ts` 查前中後調香料的家族，與今日目標家族比對（中調 ×1.2） |
| `preferenceScore` | 0.05 | 香水的 `tags` 是否包含所選 Mood |
| `usageFrequencyScore` | 0.15 | 近 90 天使用次數，`log(1 + n) / log(1 + maxN)` |

```
totalScore = Σ 權重 × 分數 − recentlyUsedPenalty
recentlyUsedPenalty = 昨天用過 0.25 ／ 2 天內 0.15 ／ 3 天內 0.08 ／ 更早 0
```

**常用香水優先**（An 原始需求）：找出近 90 天最常使用的香水，若它的 `moodScore + temperatureScore` 達到門檻（符合今天條件），即使有 `recentlyUsedPenalty` 也排第一，並標記「常用」。唯一例外：它昨天剛用過時改排第二，避免每天都是同一瓶。

**輸出**：排序後的清單，每筆包含 `totalScore`、各項分數明細、`reasons[]`（給 explain 用）。第一名作為 TODAY'S SCENT，其餘為「也很適合」。

**推薦理由**（`explain.ts`）：依分數最高的兩個項目組合模板句，例如：

> 「今天台北的潮濕天氣，加上你選擇的『神秘』印象，讓帶有琥珀與木質氣息的香水成為更適合你的選擇。」
> 「這也是你這個月最常使用的香氣。」

### 6.4 選擇障礙輪盤

- 候選：推薦清單中 `totalScore` 前 6 名（至少 2 瓶才顯示入口）。
- 結果在轉動前由 `crypto.getRandomValues` 決定，動畫只負責停在該扇區。
- 視覺與動畫規格見設計系統 §6.4。

### 6.5 確認使用

CTA「就決定是你了」→ 未登入則先登入 → `usageRepo.logUsage()`：
- 新增 `users/{uid}/usageLogs/{logId}`（fragranceId、timestamp、weather、temperature、city、occasion、mood、viaWheel）
- 更新 `users/{uid}/fragrances/{id}` 的 `usageCount +1`、`lastUsedAt`
- 若選的是 demo 香水且不在香水櫃中，先詢問「加入你的香水櫃？」

---

## 7. My Collection

| 功能 | 說明 |
|---|---|
| 統計 | 香水數量（`12 SCENTS`）、本月使用最多、最近使用 |
| 香水櫃 | Masonry editorial grid（設計系統 §3.3） |
| 新增 | 浮動 `+` → `01 手動建立` ／ `02 智能建檔` |
| 手動建立 | 品牌、香水名稱、容量、前／中／後調（輸入時從 `data/notes.ts` 自動完成，也可自由輸入）、家族、tags（7 個 Mood + 自訂）、圖片（上傳到 Storage `users/{uid}/fragrances/{id}/cover.webp`，上傳前於 client 壓縮至 1600px） |
| 智能建檔 | 輸入品牌 + 名稱 → `/api/fragrance/lookup` → 顯示「找到以下資料，請確認。」→ 使用者可修改 → 確認後存入 |
| 編輯／刪除 | 詳細頁中操作；刪除需確認，同時刪除 Storage 圖片（使用紀錄保留，以 fragranceId 對應） |
| Tag 自動推導 | 存檔時以 `lib/scent-tags.ts` 從香料推導建議 tags，使用者可取消 |

### 7.1 FragranceDataProvider（`lib/fragrance/provider.ts`）

```ts
export interface FragranceLookupResult {
  fragrance: Partial<Fragrance>;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
}
export interface FragranceDataProvider {
  name: string;
  lookup(query: { brand: string; name: string }): Promise<FragranceLookupResult | null>;
}
```

- v1 只實作 `MockFragranceProvider`：先比對 `data/fragrances.ts`，找不到回傳 `null`，UI 顯示「目前找不到這款香水的資料，要改為手動建立嗎？」並帶入已輸入的品牌與名稱。
- 只在伺服器端（Route Handler）執行；不在前端做 scraping，不寫 Selenium 爬蟲。
- 未來可註冊的 provider：授權的香水資料 API、品牌官網結構化資料（JSON-LD）、開源香水資料庫。任何爬取型 provider 必須做成獨立的伺服器端服務，並遵守 robots.txt、服務條款、速率限制，圖片只存出處連結不 hotlink 大圖。

### 7.2 Scent Tag Engine（`lib/scent-tags.ts`）

```ts
export const NOTE_TAGS: Record<string, string[]> = {
  patchouli: ['沉穩', '平靜', '成熟'],
  rose:      ['優雅', '浪漫', '誘人'],
  bergamot:  ['清新', '活力'],
  oud:       ['神秘', '成熟', '濃郁'],
  vanilla:   ['溫暖', '甜美', '誘人'],
  // …v1 約 60 種常見香料
};
export function deriveTags(notes: string[]): { tag: string; weight: number }[];
```

`deriveTags` 以中調權重最高、前後調次之，回傳排序後的建議 tags；其中屬於 7 個 Mood 的 tag 會被推薦引擎的 `preferenceScore` 使用。

---

## 8. Shopping

### 8.1 連結產生（`lib/shopping/links.ts`）

```ts
const q = encodeURIComponent(keyword.trim().slice(0, 80));
shopee: `https://shopee.tw/search?keyword=${q}`
momo:   `https://m.momoshop.com.tw/search.momo?searchKeyword=${q}`
```

- 一律 `encodeURIComponent`，並限制長度、去除控制字元；連結以 `target="_blank" rel="noopener noreferrer"` 開啟。
- 關鍵字正規化：先比對 `data/brands.ts` 與 `data/fragrances.ts` 的中英文名稱（例：「阿文圖斯」→「Creed Aventus」），找到時使用標準名稱搜尋，並在結果上方顯示該香水的小型 editorial 卡（品牌、名稱、家族）。

### 8.2 OfficialSearchProvider（`lib/shopping/official/`）

```ts
export interface OfficialSearchProvider {
  find(query: { brand: string; name?: string }): Promise<{ url: string; label: string } | null>;
}
```

- `MockOfficialProvider`（v1 預設）：查 `data/brands.ts` 的官網網域，回傳品牌官網首頁。
- `GoogleCseProvider`（設定 `GOOGLE_CSE_KEY`、`GOOGLE_CSE_ID` 後啟用）：搜尋 `site:<brand-domain> <perfume-name>`，取第一筆。
- 都在 `/api/shopping/official` 伺服器端執行；失敗時退回品牌首頁或隱藏 OFFICIAL 列，頁面不壞。

---

## 9. 錯誤、載入、空狀態

| 情境 | 處理 |
|---|---|
| 天氣失敗 | 「暫時無法取得天氣。」＋ 手動選擇城市 |
| Firestore 失敗 | 友善錯誤訊息 + 重試；Today's Choice 仍可用 demo 資料運作 |
| 圖片載入失敗 | 退回瓶身線稿 SVG |
| 香水櫃空 | 蓮花線稿 +「你的香水櫃還是空的。」+「新增第一瓶香氣」 |
| 搜尋無對應香水 | 仍產生三個商城連結（直接用輸入字） |
| 載入中 | Skeleton（慢速光澤），不使用 spinner |
| 路由錯誤 | `error.tsx`、`not-found.tsx` 皆依品牌樣式設計 |

---

## 10. SEO、安全、環境變數

**Metadata**：Title「NEFERTEM — 找到今天適合你的香氣」；Description「探索你的香水收藏，根據天氣、場合與氣味印象，找到今天最適合你的香氣。」；OpenGraph 圖使用 Hero 構圖（`app/opengraph-image.tsx`）。

**安全**：Firebase Web 設定屬公開資訊（`NEXT_PUBLIC_`），真正的保護靠 Security Rules；所有第三方金鑰只在 Route Handler 使用，不進 client bundle；`.env.local` 列入 `.gitignore`。

**`.env.example`**

```bash
# Firebase（Firebase Console → 專案設定 → 你的應用程式）
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# 天氣（可留空，留空使用 mock）
WEATHER_PROVIDER=openweathermap   # openweathermap | cwa | mock
OPENWEATHER_API_KEY=
CWA_API_KEY=

# 官網搜尋（可留空，留空使用 mock）
GOOGLE_CSE_KEY=
GOOGLE_CSE_ID=
```

沒有 Firebase 設定時：網站仍可瀏覽 Hero、Today's Choice（demo）、Shopping；登入與香水櫃顯示「尚未設定會員服務」。

---

## 11. 開發階段

| Phase | 內容 | 完成標準 |
|---|---|---|
| 1 | Next.js、TypeScript、Tailwind、Firebase 架構、Design tokens、字體、Global styles、Grain、Responsive layout、BottomNavigation、DesktopNav、Loading、Hero、Page transition、`lib/motion.ts` | 手機與桌面都能看到完整 Hero 與三個頁面骨架；Lighthouse a11y ≥ 95 |
| 2 | Today's Choice：天氣 → 場合 → 印象 → 推薦引擎 → 結果與理由 → 輪盤 → 確認 → 使用紀錄 | 推薦引擎單元測試通過；未設天氣金鑰時以 mock 正常運作 |
| 3 | My Collection：Google 登入、香水櫃、新增（手動）、編輯、刪除、使用次數、統計 | Security Rules 驗證只能存取自己的資料 |
| 4 | Shopping：搜尋、蝦皮、momo、官網（mock provider） | 中英文名稱皆能產生正確連結 |
| 5 | 智能建檔 provider 架構（mock） | 可在不改 UI 的情況下換 provider |

每個 Phase 一個 PR。每次合併前自查：TypeScript、ESLint、Responsive（375／768／1280／1600）、Accessibility、Loading／Error／Empty state、手機與桌面互動。

---

## 12. 待 An 決定或提供

1. **訪客模式**：目前預設「不登入也能先體驗 Today's Choice（用 demo 香水），確認使用與香水櫃才需登入」。你最初的規格是「一進網站先登入」，要改回強制登入嗎？
2. **參考插畫**：請上傳 Nefertem 官方視覺圖，我會放到 `/public/images/nefertem-reference.png`。在拿到之前會使用占位框。
3. **Firebase 專案**：需要你在 Firebase Console 建立專案並開啟 Google 登入，把 Web 設定值給我（或之後直接填在 Vercel 環境變數）。Phase 1–2 不需要，Phase 3 才需要。
4. **GitHub repo**：建立空 repo（建議 `nefertem`）後告訴我名稱。
