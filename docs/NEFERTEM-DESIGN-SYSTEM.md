# 香水人生 Design System

> 狀態：v0.3（2026-10-05）
> 網站名稱：**香水人生**（英文輔助：A LIFE IN SCENT）。NEFERTEM 是品牌的靈感來源與繆思，不是站名。
> 定位：現代精品香氛品牌 × 古埃及神話（藍色睡蓮之神 Nefertem）
> 主要 Art Direction：NEFERTEM 官方 Key Visual（`/public/images/nefertem-key-visual.png`，已提供）
> 語感參考：Aesop、Byredo、Le Labo、Diptyque、Maison Margiela Fragrances 的編輯感，以及 Awwwards 藝術型品牌網站。不複製任何一個。

---

## 0. 設計宣言

> 「香氣不是裝飾，而是一種記憶、一種情緒，也是今天的你想成為什麼樣子的選擇。」
> SCENT IS NOT AN ACCESSORY. IT IS MEMORY. IT IS MOOD. IT IS WHO YOU CHOOSE TO BE TODAY.

這不是電商、不是 dashboard，是一場**探索氣味的數位儀式**。當視覺品質與功能便利衝突時，優先維持品牌體驗。

### 0.1 Key Visual 是視覺母體

Key Visual 不是一張商品圖，而是整站視覺語言的來源。網站**只在首頁 Hero 使用這張圖本身**；其他頁面不重複貼同一張圖，而是延伸它的視覺語彙：

| 從 Key Visual 提取 | 轉化為網站的 UI |
|---|---|
| 米白紙面與水彩暈染 | 全站 ivory 底色 + 低透明度 grain（§3.4），圖片以 `mix-blend-multiply` 印在紙上，而非貼成方塊 |
| 藍色睡蓮 | 品牌 mark（單線蓮花 glyph）、底部導覽第一個 icon、`--lotus` / `--lotus-deep` 色票、散落的花瓣裝飾（`PetalScatter`） |
| 金色金屬與拉的日輪 | `--gold` / `--gilt` / `--sun`；`SunDisc` 元件（日輪 + 不等長手繪光芒），用於 Loading、登入、理念段落 |
| 香氣煙霧 | `SmokeLayer` 的細線煙霧，取圖中的藍紫與虹彩淡紫（`--vapour`） |
| 古埃及符號（安卡、荷魯斯之眼、蓮花莖、Ra） | `EgyptianGlyph` 線稿，作為段落點綴，一個區塊最多三個 |
| 手寫註記（Lotus / Aroma / Healing…） | `Annotation` 元件：襯線斜體直排詞列，用於區塊邊欄 |
| 手繪線條 | 所有圖示線寬 1–1.25px，直角不加圓角，陰影一律不用 |
| 人物與花朵比例、滿版構圖 | Hero 圖片突破容器右緣、左緣以 ivory 漸層融入紙面，讓標題可以壓在圖上 |

禁止：把符號當成邊框或重複花紋、在每個區塊貼同一張圖、把插畫當成背景圖鋪滿再壓深色遮罩。

### 0.2 原則

| 原則 | 意思 | 具體做法 |
|---|---|---|
| Editorial，不是 UI | 像翻一本印刷精品雜誌 | 大標、極大留白、細線、編號（01 / 02 / 03）、小型 uppercase label |
| Quiet Luxury | 安靜、克制 | 一屏一個主角；金色只做點綴，不做邊框 |
| 古老精神，現代語言 | 神話是氣質，不是裝飾 | 只用極簡蓮花 glyph 與太陽圓，禁止象形文字花邊 |
| 慢 | 電影感的節奏 | 動畫 0.8–1.5s、無 bounce、無 overshoot |
| 少表單，多發現 | 每一步只問一件事 | 選項做成全幅大型字體，不用 checkbox／下拉 |

### 0.3 禁止清單

Bootstrap 模板、Dashboard UI、大量圓角卡片、紫色 SaaS 漸層、霓虹、Cyberpunk、shadcn 預設外觀、過度玻璃擬態與 blur、大量 emoji、俗氣埃及紋樣、隨處金框、每樣東西都是卡片、過度動畫、低品質 stock 圖、模仿既有網站。

---

## 1. Color Tokens

### 1.1 品牌色（An 指定）

```css
:root {
  --background:           #F7F4ED; /* Ivory White，主底色 */
  --background-secondary: #EFEBE1; /* Warm Off White，區塊底色 */
  --ink:                  #151515; /* Charcoal Black，文字 */
  --blue:                 #183B68; /* Deep Egyptian Blue */
  --blue-light:           #6F8FBD; /* Cobalt 淡調 */
  --gold:                 #B99652; /* Muted Gold */
  --gold-light:           #D8C38A;
}
```

### 1.1b Key Visual 取樣色（插畫延伸色）

直接從 Key Visual 取樣，只用於延伸插畫語彙的裝飾層，不承載介面資訊。

| Token | 值 | 取自 |
|---|---|---|
| `--lotus` | `#7E91CB` | 藍色睡蓮花瓣（長春花藍） |
| `--lotus-deep` | `#3E5A9E` | 項圈與頭飾的青金石條紋 |
| `--sun` | `#E3C299` | 拉的日輪淡金 |
| `--gilt` | `#D2A773` | 首飾金屬高光、手寫符號 |
| `--vapour` | `#DFC3E4` | 香氣煙霧的虹彩淡紫 |

底部導覽的 active 文字使用 `--lotus-deep`（對 ivory 對比 6.9:1，AA 通過）。

### 1.2 語意 Tokens（元件只用這一層）

| Token | 值 | 用途 |
|---|---|---|
| `--surface` | `var(--background)` | 頁面 |
| `--surface-raised` | `var(--background-secondary)` | 次要區塊、輸入底 |
| `--surface-inverse` | `#0F1F38`（深靛夜色） | 輪盤儀式、Loading、夜間段落 |
| `--text` | `var(--ink)` | 主文字（對 ivory 對比 17:1） |
| `--text-muted` | `#5B574F` | 次要文字（對 ivory 7:1，AA 通過） |
| `--text-faint` | `#8A857A` | 只用於 ≥ 18px 的大字或裝飾數字（3.4:1） |
| `--text-inverse` | `var(--background)` | 深底上的文字 |
| `--accent` | `var(--blue)` | 連結、選取狀態、主要動作 |
| `--accent-ornament` | `var(--gold)` | 編號、細線、active 小圓點、底線展開 |
| `--line` | `rgba(21,21,21,0.12)` | 細分隔線（0.5–1px） |
| `--line-strong` | `rgba(21,21,21,0.32)` | 輸入框底線 |
| `--focus` | `var(--blue)` | 鍵盤 focus 外框 |
| `--danger` | `#9B2C2C` | 錯誤、刪除（低飽和磚紅，維持品牌調性） |

**金色使用規則**：金色對 ivory 對比僅 2.6:1，**不可作為文字色承載資訊**，只能用於編號（大字）、線條、小圓點、圖形。需要金色文字時改用深金 `#8C6D2F`（4.6:1）。

### 1.3 深色段落（非全站 dark mode）

v1 不做整站深色模式（品牌主調是 ivory 紙感）。改為「夜間段落」：Loading、Fortune Wheel、結果頁的香氣敘事段，使用 `--surface-inverse` 深靛底 + ivory 文字 + 金色點綴，營造「午夜藍色睡蓮」的場景。之後若要做系統深色模式，只需在語意層覆寫。

### 1.4 香調家族色（Fragrance Family）

低飽和、像水彩顏料的色票，只用在：家族小色點、輪盤扇區、香調金字塔細線。**不用於大面積背景、不做漸層**。

| key | 中文 | 英文顯示 | 色 |
|---|---|---|---|
| `citrus` | 柑橘 | CITRUS | `#C9A43B` |
| `fresh` | 清新綠意 | FRESH | `#7F9A6A` |
| `marine` | 海洋水生 | MARINE | `#5F86A6` |
| `floral` | 花香 | FLORAL | `#B9707F` |
| `fruity` | 果香 | FRUITY | `#C07A5A` |
| `fougere` | 馥奇 | FOUGÈRE | `#6E8370` |
| `chypre` | 柑苔 | CHYPRE | `#6B6A3E` |
| `woody` | 木質 | WOODY | `#7A5C45` |
| `amber` | 琥珀／東方 | AMBER · ORIENTAL | `#A9713A` |
| `gourmand` | 美食 | GOURMAND | `#9A6B4F` |
| `spicy` | 辛香 | SPICY | `#9C4F33` |
| `musky` | 麝香 | MUSK | `#A69A93` |
| `leather` | 皮革煙燻 | LEATHER | `#4E3B30` |
| `mineral` | 礦物 | MINERAL | `#8C9196` |
| `avantgarde` | 前衛 | AVANT-GARDE | `#3E4A5C` |

家族永遠「色點 + 文字」並列，不單靠顏色辨識。

---

## 2. Typography

### 2.1 字族

| 角色 | 字體 | 載入 |
|---|---|---|
| Display（英文標題、Logo、香水名） | **Cormorant Garamond**（300 / 400 / 500，含 italic） | `next/font/google` |
| 中文標題 | **Noto Serif TC**（400 / 600） | `next/font/google`，只做 subset 常用字 |
| Body（中英文內文、UI） | **Inter** + **Noto Sans TC**（400 / 500） | `next/font/google` |
| Label（uppercase 小字） | Inter 500，字距加寬 | 同上 |

```css
--font-display: "Cormorant Garamond", "Noto Serif TC", Georgia, serif;
--font-serif-zh: "Noto Serif TC", "Songti TC", serif;
--font-sans: "Inter", "Noto Sans TC", -apple-system, "PingFang TC", sans-serif;
```

選 Cormorant Garamond 而非 DM Serif Display：它字重更細、對比更高，大尺寸時更接近精品印刷刊物；DM Serif 偏粗，較適合海報。

### 2.2 字級（Mobile → Desktop，以 `clamp()` 平滑過渡）

| Token | Mobile | Desktop | 行高 | 字距 | 字體 | 用途 |
|---|---|---|---|---|---|---|
| `hero` | 56px | 160px | 0.9 | -0.02em | Display 300 | Hero 英文大字 |
| `hero-zh` | 52px | 136px | 1.05 | 0.12em | Serif TC 400 | 「香水人生」主標 |
| `display` | 44px | 104px | 0.95 | -0.015em | Display 300 | 香水名（AVENTUS）、步驟大字選項 |
| `h1` | 32px | 64px | 1.05 | -0.01em | Display 400 | 頁面標題（MY COLLECTION） |
| `h1-zh` | 26px | 40px | 1.35 | 0.02em | Serif TC 400 | 中文標題（「你今天會去哪裡？」） |
| `h2` | 24px | 36px | 1.2 | 0 | Display 400 | 區塊標題 |
| `lead` | 18px | 22px | 1.7 | 0.01em | Sans 400 | 推薦理由、引言 |
| `body` | 16px | 17px | 1.75 | 0.01em | Sans 400 | 內文（中文需要較寬行高） |
| `small` | 14px | 14px | 1.6 | 0.01em | Sans 400 | 輔助說明 |
| `label` | 11px | 12px | 1.4 | 0.18em | Sans 500 uppercase | TODAY'S CHOICE、STEP 01 |
| `numeral` | 40px | 72px | 1 | 0 | Display 300 italic，金色 | 01 / 02 / 03 編號 |

規則：
- 中文不套負字距；負字距只用在英文 Display。
- 英文大標一律 uppercase 或 Title Case，不混用。
- 雙語成對時：英文 `label`（小、寬字距）在上，中文標題在下；或英文 Display 為主、中文為輔，依頁面而定，同一頁只用一種模式。

### 2.3 排版語彙

- **編號系統**：`01 THE WEATHER`、`02 THE OCCASION`、`03 THE IMPRESSION`，編號用金色 `numeral`，標籤用 `label`。
- **細線**：1px `--line`，常以「線 + label」組成段落標頭，例如 `WHERE TO FIND IT ───────`。
- **引號**：推薦理由使用 Display italic 的開引號作為裝飾，不加框。

---

## 3. Spacing、Grid、Layout

### 3.1 間距（8px 基準，偏大以保留呼吸感）

| Token | 值 | Token | 值 |
|---|---|---|---|
| `space-1` | 4px | `space-8` | 64px |
| `space-2` | 8px | `space-10` | 80px |
| `space-3` | 12px | `space-12` | 96px |
| `space-4` | 16px | `space-16` | 128px |
| `space-5` | 24px | `space-20` | 160px（Desktop 段落間） |
| `space-6` | 32px | `space-24` | 192px（Desktop Hero 留白） |
| `space-7` | 48px | | |

### 3.2 Breakpoints

| 名稱 | 寬度 | 版型 |
|---|---|---|
| Mobile | < 768px | App-like 單欄；底部導覽；邊距 20px |
| Tablet | 768–1199px | 單欄為主、兩欄香水櫃；頂部導覽；邊距 40px |
| Desktop | 1200–1599px | 12 欄 Editorial grid；邊距 64px；圖文不對稱分欄 |
| Large Desktop | ≥ 1600px | 內容最大寬 1440px，置中；字級停在上限 |

### 3.3 Editorial Grid（Desktop）

12 欄、gutter 24px。常用構圖：
- **Hero**：圖佔 7 欄並向右突破容器（overflow），標題佔 1–6 欄並與圖重疊。
- **推薦結果**：左 6 欄香水瓶大圖（4:5），右 1–5 欄文字從第 8 欄開始（留 1 欄空白）。
- **香水櫃**：不等高 masonry，3 欄，每 5 件插入一件跨 2 欄的大圖。

### 3.4 形狀

- 圓角：預設 **0**。只有三處例外：active 小圓點（圓）、頭像（圓）、浮動新增按鈕（圓）。輸入框為「底線式」，不是方框。
- 陰影：不使用 drop shadow。層次靠底色（ivory → off-white）、細線與留白建立。
- 質感：全站疊一層 noise/grain（SVG `feTurbulence` 生成，`opacity: 0.03`，`pointer-events: none`，`mix-blend-mode: multiply`）。

---

## 4. Motion

### 4.1 原則

- **Slow / Elegant / Cinematic / Organic**：主要動畫 0.8–1.5s。
- **不使用彈簧回彈**：無 bounce、無 overshoot；全部使用減速曲線。
- **不是每個元素都動**：每屏最多一個主動畫 + 一組文字 reveal。
- 只動 `transform`、`opacity`、`clip-path`，維持 60fps。

### 4.2 Tokens（`lib/motion.ts` 統一匯出）

| Token | 值 | 用途 |
|---|---|---|
| `ease.editorial` | `[0.22, 1, 0.36, 1]` | 預設減速曲線（文字、圖片 reveal） |
| `ease.cinematic` | `[0.76, 0, 0.24, 1]` | 頁面轉場、clip-path 幕布 |
| `ease.drift` | `[0.45, 0, 0.55, 1]` | 煙霧、蓮花漂浮的循環 |
| `duration.micro` | 0.3s | hover、底線、focus |
| `duration.base` | 0.8s | 文字淡入上移 |
| `duration.slow` | 1.2s | 圖片 reveal、頁面轉場 |
| `duration.ritual` | 1.5s | Hero 進場、Loading 淡出 |
| `stagger.lines` | 0.08s | 多行文字逐行 |
| `stagger.items` | 0.06s | 選項、香料標籤 |

### 4.3 Variants（`lib/motion.ts`）

| 名稱 | 定義 |
|---|---|
| `fadeIn` | opacity 0 → 1 |
| `fadeUp` | opacity 0 → 1，y 30 → 0 |
| `reveal` | `clip-path: inset(100% 0 0 0)` → `inset(0)`（由下往上揭幕） |
| `scaleIn` | 圖片 scale 1.05 → 1 + fadeIn |
| `lineExpand` | 金色線 `scaleX` 0 → 1，`transform-origin: left` |
| `pageTransition` | 離場：opacity → 0、y → -12（0.6s）；進場：ivory 幕布由下往上 clip reveal（1.2s） |

### 4.4 招牌動畫

| 名稱 | 描述 |
|---|---|
| **Loading Ritual** | 深靛底，極簡蓮花線稿以 stroke-dashoffset 畫出（1.5s）→ 出現「FOLLOW THE SCENT」→ 整片淡出進首頁。只在首次進站播放（sessionStorage 記錄），最長 2.5s。 |
| **Hero** | 蓮花緩慢浮現；2–3 層 SVG 煙霧以 `ease.drift` 循環漂移（20–30s 一輪）；金色微粒 ≤ 12 顆；插畫 1–2% 捲動視差；標題逐行 fadeUp。 |
| **Step 轉場** | 每個步驟佔滿一屏；選擇後，選中的選項放大淡出、其餘下沉消失，下一步編號從金色細線後方 reveal。 |
| **Magnetic Tag** | Desktop 印象選項在游標 80px 內輕微吸附（最大位移 8px），離開以 `ease.editorial` 回位。 |
| **Gold Underline** | 連結 hover 時金線由左展開（0.3s）。購物連結的整條細線展開到全寬。 |
| **Fortune Wheel** | 見 §6.4。 |
| **Image Parallax** | 大圖在容器內 ±4% 位移；手機只保留 ±2%。 |

### 4.5 減少動態

`prefers-reduced-motion: reduce` 時：
- 取消視差、煙霧循環、磁吸、custom cursor。
- 頁面轉場與 reveal 改為 0.2s 純淡入。
- Loading 直接顯示 logo 0.6s 後進站。
- 輪盤不旋轉，直接以淡入揭曉結果（結果仍為隨機）。

---

## 5. 圖像與圖示

- **主視覺**：Key Visual 只用於首頁 Hero，以 `mix-blend-multiply` 印在 ivory 紙面上，左緣加 ivory 漸層讓標題壓得上去。若檔案不存在，顯示 ivory 占位框 + 「NEFERTEM KEY VISUAL」label，**不自行生成不同風格的圖**。
- **構圖**：圖片要有 cropping、mask（拱門形 `clip-path`、圓形太陽遮罩）、視差、突破容器，不全部做成背景圖。
- **香水瓶**：優先去背圖，放在 off-white 底上；無圖時顯示極簡瓶身線稿 SVG + 品牌名，不用灰色方塊。
- **圖示**：Lucide，線寬 1.25px（比預設細，接近線稿插畫）；底部導覽使用自繪三個 icon：蓮花（香水選擇）、瓶身（香水櫃）、羅盤（搜尋購物）。
- **Logo**：文字 Logo `香水人生`（Noto Serif TC 400，字距 0.32em）+ 下方 `SCENT • RITUAL • MEMORY`（label）；brand mark 為單線蓮花 glyph（`--lotus-deep`）。英文 `A Life in Scent` 以 Cormorant 斜體作輔助，只在 Hero 出現。

---

## 6. Component Architecture

### 6.1 分層

```
components/
├─ ui/            # 無品牌語意的基礎元件（可包 shadcn/Radix 行為，但全部重寫樣式）
├─ brand/         # NefertemLogo、LotusGlyph、SunDisc、EgyptianGlyph、PetalScatter、Annotation、GrainOverlay、EditorialNumber、HairlineHeading、Manifesto
├─ navigation/    # BottomNavigation、DesktopNav、PageTransition、CustomCursor
├─ hero/          # Hero、SmokeLayer、GoldParticles、LoadingRitual
├─ recommendation/# WeatherContext、OccasionSelector、MoodSelector、RecommendationResult、WhyThisScent、FortuneWheel
├─ fragrance/     # FragranceBottle、FragranceCard、NotePyramid、FamilyDot
├─ collection/    # CollectionGrid、CollectionStats、AddFragranceModal、ManualFragranceForm、SmartLookupFlow
└─ shopping/      # FragranceSearch、ShoppingLinks
```

### 6.2 基礎元件（`ui/`）

| 元件 | 樣式要點 |
|---|---|
| `Button` | variant：`primary`（深藍底 ivory 字、直角）、`ghost`（文字 + 金色底線展開）、`text-link`（含 → 箭頭位移）。最小點擊區 44×44。 |
| `TextField` | 底線式；label 為 `label` 樣式浮在上方；focus 時底線轉深藍並從左展開。 |
| `Sheet / Dialog` | 手機從底部滑出、Desktop 為全屏 overlay；ivory 底，無圓角，以 Radix Dialog 處理 focus trap。 |
| `Toast` | 頂部一條細橫幅，ivory 底 + 左側金色細線。 |
| `Skeleton` | off-white 底 + 極慢（2s）光澤掃過，不用灰塊閃爍。 |
| `EmptyState` | 蓮花線稿 + serif 一句話 + text-link 動作。 |
| `ErrorState` | 同 EmptyState 結構，文字溫和（例：「暫時無法取得天氣。」+「手動選擇城市」）。 |

### 6.3 導覽

**BottomNavigation（Mobile）**
- 高 72px + `env(safe-area-inset-bottom)`；底色 `rgba(247,244,237,0.88)` + `backdrop-filter: blur(12px)`（輕度，不做玻璃感）；上緣 1px `--line`。
- 三項：蓮花「香水選擇 / TODAY'S CHOICE」、瓶身「我的香水櫃 / MY COLLECTION」、羅盤「搜尋購物 / SHOPPING」。中文 12px + 英文 9px label。
- Active：icon 轉 `--blue`，下方 4px 金色圓點以 `layoutId` 平移到新位置（0.5s `ease.editorial`）。不使用色塊背景。

**DesktopNav**
- 左：`NEFERTEM` 文字 Logo；右：`TODAY'S CHOICE`、`MY COLLECTION`、`SHOP` 三個 label 連結；中間留白。
- 捲動超過 80px 時高度 96 → 64px、Logo 縮小，背景轉為 ivory 實色 + 底線。
- 當前頁：文字下方金色細線。

**CustomCursor（Desktop only）**：8px 深藍圓點 + 32px 細圈，在可點元素上放大成 64px 圈並顯示「VIEW」/「SELECT」；`pointer: coarse` 或 reduced-motion 時停用。

### 6.4 Fortune Wheel（選擇障礙？CAN'T DECIDE?）

- 全屏 `--surface-inverse` 深靛夜色，像一場儀式而非賭場轉盤。
- 輪盤：細金線圓環分隔扇區，每區只寫香水名（Display italic）與家族色點；中心為太陽圓 + 蓮花 glyph；頂端一根金色細指針。
- 動畫：結果在開始時以 `crypto.getRandomValues` 決定；旋轉 4–6 圈，總時長 4.5s，曲線 `[0.12, 0.8, 0.12, 1]`（快速起轉、長尾減速）；停止前最後 0.3s 指針有 ±1.5° 的微震（模擬刻度摩擦），之後靜止。支援時 `navigator.vibrate(8)`；可選的輕聲鐘聲預設關閉。
- 結果：輪盤淡出，香水名以 `display` 大字 reveal，「今天，就它了。」→ CTA「就決定是你了」。

### 6.5 頁面骨架

```
Mobile                              Desktop
┌───────────────────────┐          ┌──────────────────────────────────────────┐
│ NEFERTEM        (logo)│          │ NEFERTEM          TODAY'S CHOICE  MY ... │
│                       │          │                                          │
│  內容（一屏一個主角）  │          │  12 欄 editorial grid，圖文不對稱         │
│                       │          │                                          │
├───────────────────────┤          │                                          │
│ 蓮花   瓶身   羅盤     │          └──────────────────────────────────────────┘
│   •                   │  ← 金色 active 小圓點
└───────────────────────┘
```

---

## 7. 頁面視覺規格

| 頁面 | 重點 |
|---|---|
| Loading | §4.4 Loading Ritual |
| `/` Hero + Today's Choice | Hero 文案：`香水人生`／「香氣」換行「是你今天選擇成為誰的方式」（不加標點）／SCENT IS A WAY OF CHOOSING WHO YOU BECOME TODAY.；往下捲進入 STEP 01 |
| STEP 01 天氣 | 大字顯示 `TAIPEI · 26°C · RAINY`；拒絕定位時列出 台北／台中／高雄／台南／新竹 五個大字選項 |
| STEP 02 場合 | 整屏只有兩個巨大選項 `INDOOR 涼爽的室內` / `OUTDOOR 戶外活動`，上下（手機）或左右（Desktop）各半 |
| STEP 03 印象 | 七個 Large Typography Tags（MYSTERIOUS 神秘…BOLD 侵略性），最多選 2 個，選中時文字轉深藍、前方出現金色小圓點 |
| 推薦結果 | `TODAY'S SCENT` → 品牌（label）→ 香水名（display）→ 家族 → 前／中／後調 → `WHY THIS SCENT?` 推薦理由（lead，serif 開引號）→ CTA「就決定是你了」與 text-link「選擇障礙？CAN'T DECIDE?」 |
| `/collection` | `MY COLLECTION`／「你的氣味收藏。」；`12 SCENTS`；「本月使用最多」「最近使用」兩個橫向小區；下方 Digital Perfume Cabinet masonry；右下浮動圓形 `+` |
| 新增香水 | 全屏 overlay：`ADD NEW SCENT`，兩個編號大選項 `01 手動建立`、`02 智能建檔` |
| `/shopping` | 「找到你的下一瓶香氣。」大搜尋底線輸入框 + `SEARCH SCENT`；結果為 `WHERE TO FIND IT` 細線標頭 + 三條巨大 typography 連結（SHOPEE / MOMO / OFFICIAL），hover 時金線展開全寬 |
| `/login` | 「進入你的香氣收藏。」ENTER YOUR SCENT JOURNEY；單一按鈕 CONTINUE WITH GOOGLE |

---

## 8. Accessibility

- 語意 HTML（`header`／`nav`／`main`／`section`、每頁一個 `h1`）。
- 所有互動元素可鍵盤操作；focus 樣式：2px `--focus` 外框 + 2px offset，不被移除。
- 自訂選項（場合、印象、城市）使用 `role="radiogroup"`／`role="checkbox"` 語意與 `aria-checked`。
- Fortune Wheel 提供「直接幫我選」按鈕作為手勢替代，結果以 `aria-live="polite"` 宣告。
- 文字對比符合 WCAG AA（見 §1.2）；金色不承載資訊文字。
- 所有圖片有 `alt`；裝飾性圖層（煙霧、微粒、grain）`aria-hidden`。
- 完整支援 `prefers-reduced-motion`（§4.5）。

---

## 9. 實作對應

| 項目 | 檔案 |
|---|---|
| CSS tokens | `app/globals.css`（`:root` 變數 + Tailwind v4 `@theme` 對應，class 如 `bg-surface`、`text-muted`、`font-display`） |
| 字體 | `app/fonts.ts`（`next/font/google`） |
| 動畫 | `lib/motion.ts`（ease、duration、variants） |
| 家族色 | `lib/fragrance/families.ts`（單一來源，CSS 與 TS 共用） |
| shadcn/ui | 只取 Dialog、Sheet、Toast 的行為層，樣式全部依本文件重寫 |
