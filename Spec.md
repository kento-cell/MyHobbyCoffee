# MyHobbyCoffee.com – Site Specification

（LIGHT UP COFFEE を参考にした大幅アップデート版）
参考 URL：https://lightupcoffee.com/

---

## 1. Site Overview（サイト概要）

- **サイト名**：MyHobbyCoffee.com
- **目的**：
  - 現行 UI/UX の全面刷新
  - ブランド価値（自家焙煎のこだわり）を伝える Web デザイン
  - EC（Stripe 導入予定）への拡張性確保
  - microCMS 連携（既存スキーマ）を維持したまま UI 更新
- **コンセプト**：  
  LightUpCoffee のような「余白を大切にしたミニマルデザイン＋写真を魅せる」スタイル。  
  明るいライムグリーンをブランドカラーにし、清潔感と専門性を演出する。

---

## 2. Design Guideline（デザイン仕様）

### ■ Color Design（色設計）

- **メインカラー（ブランド）**：#A4DE02（柔らかいライトグリーン）
- サブカラー：ホワイト #FFFFFF
- テキストカラー：#222222（中間ダークグレー）
- 補助カラー：#F5F5F5（ライトグレー背景）

### ■ Layout（レイアウト）

- 余白多め（section padding: 80px 前後）
- LightUpCoffee のように “写真主導の静的デザイン”
- レスポンシブ設計：
  - SP：1 カラム
  - PC：2 ～ 3 カラム中心
- 見出しは大きく、フォントは細め（font-light）

### ■ Typography（文字）

- 日本語：Noto Sans
- 英語：Inter or Montserrat
- H1：2.5rem〜3.5rem
- line-height は広めに設定（1.5〜1.7）

---

## 3. Page Structure（ページ構成）

### 必要ページ（現行＋アップデート後）　ここらへん競合しないように注意して作成して

- `/` → Home（トップ）
- `/menu` → 商品一覧（microCMS）
- `/menu/[id]` → 商品詳細
- `/blog` → ブログ一覧
- `/blog/[id]` → ブログ詳細
- `/about`　 → あってもなくても一旦 OK です。

## 4. Functional Requirements（機能仕様）

### ■ microCMS（既存維持）

- 商品データ（menu）
- ブログ（blog）
- カテゴリ（必要に応じて）

スキーマ構造は **変更しない**。  
既存の `microcms.ts` をそのまま利用。

### ■ Stripe（将来追加）

- priceID を商品情報に追加予定
- Next.js → Stripe Checkout redirect
- カートシステム（将来オプション）

### ■ 共通機能

- next/image による画像最適化
- SEO 設計（OGP、記事タイトル）
- PC/SP レスポンシブ
- 404 ページ整備

---

## 5. Component Design（コンポーネント仕様）

### ■ Hero（TOP）

- 大きな写真 or 動画（SampleMov_home.mp4）
- 半透明オーバーレイ＋キャッチコピー
- CTA ボタン（購入 / 商品を見る）
- ブランドカラーのライムグリーンを強調

### ■ ProductCard

- 最小構造：画像 → タイトル → 価格
- ライムグリーンの細いラインをアクセントに
- Hover: 微フェード＋少し拡大

### ■ Product Detail（menu/[id]）

- 豆の生産国 / 精製方法 / 焙煎度 / 風味コメント
- 100g・200g の選択 UI（後に Stripe 対応）
- 画像を大きく表示（LightUp スタイル）

### ■ BlogCard

- 白背景に影なし
- 画像＋タイトル＋投稿日
- クリックで詳細へ遷移

### ■ Header（ナビゲーション）

- 左：ロゴ（MyHobbyCoffee）
- 右：Menu / Blog / About
- スクロール時に shadow-sm を付与する Sticky Header

### ■ Footer

- SNS リンク
- Copylight
- サイト簡易ナビ

---

## 6. Information Architecture（情報設計）

### ⬜ 目指すサイトの方向性

- 余白を大きく → 高級感＆見やすさ
- 画像を大きく → コーヒー豆の魅力を伝える
- テキストは最小限 → 読ませないデザイン
- 色は白 x ライムグリーン中心で統一

### ⬜ Home ページ構成

1. Hero
2. Concept（焙煎へのこだわり）
3. Product List
4. Blog（最新 2〜3 件）
5. About
6. Footer

---

## 7. Technical Specification（技術仕様）

### ■ Stack

- Next.js 16 app router
- TypeScript
- Tailwind CSS
- microCMS（API 読み込み）
- Stripe（後付け）

### 8.注意

Review.md をしっかりと参照すること
