# Nefertem · A Life in Scent

現代精品香氛 × 古埃及藍色睡蓮之神 Nefertem。幫使用者依天氣、場合與想留下的印象，找到今天最適合自己的香氣。

- 設計系統：[docs/NEFERTEM-DESIGN-SYSTEM.md](docs/NEFERTEM-DESIGN-SYSTEM.md)
- 系統架構：[docs/NEFERTEM-ARCHITECTURE.md](docs/NEFERTEM-ARCHITECTURE.md)

## 開發

需要 Node.js 22。

```bash
npm install
cp .env.example .env.local   # 全部留空也能跑：天氣與官網搜尋使用 mock，登入會停用
npm run dev                  # http://localhost:3000
```

| 指令 | 用途 |
|---|---|
| `npm run dev` | 開發伺服器 |
| `npm run build` / `npm start` | Production build 與啟動 |
| `npm run typecheck` | 產生路由型別並執行 TypeScript 檢查 |
| `npm run lint` | ESLint |
| `npm test` | Vitest 單元測試 |
| `npm run check` | 以上三項一次跑完 |

## 字體

全站中文使用 **02流線形**（Flop Design，SIL OFL 1.1），以 `unicode-range` 切片自託管在 `public/fonts/ryusenkei/`。新增中文文案後請重跑 `python3 scripts/build-ryusenkei.py <TTF 資料夾>`（需要 `pip install fonttools brotli`），讓文案用到的字都在第一個切片裡。

## Key Visual

NEFERTEM 官方 Key Visual 位於 `public/images/nefertem-key-visual.png`，是整站視覺語言的母體：只在首頁 Hero 使用圖片本身，其餘頁面延伸它的色彩、睡蓮、日輪、聖符與煙霧語彙。

## 目前進度

- [x] Phase 1：專案骨架、Design tokens、字體、紙感 grain、motion 系統、手機底部導覽、桌面 editorial 導覽、Loading 儀式、Hero、頁面轉場、Firebase 架構與 Security Rules
- [x] Phase 2：Today's Choice 完整流程（天氣 → 場合 → 印象 → 推薦 → 輪盤 → 使用紀錄；訪客紀錄暫存在這台裝置，Phase 3 登入後改存 Firestore）
- [x] Phase 3：My Collection 與 Google 登入（未登入存在這台裝置；登入後存 Firestore `users/{uid}`，照片存 Storage；今日推薦改從你的香水櫃挑選）
- [x] Phase 4：Shopping（蝦皮、momo 連結；官網預設用品牌首頁，填入 GOOGLE_CSE_KEY / GOOGLE_CSE_ID 後改搜尋官網內頁）
- [ ] Phase 5：智能建檔 provider
