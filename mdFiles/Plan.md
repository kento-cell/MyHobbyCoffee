# plan.md（2025-11-22）

## 1. Header 改修

- 現状の「Beans」表記を削除
- カートアイコン（ShoppingCart Icon）に変更
- カートアイコンには商品数バッジ（0 → カート内の合計数量）を表示
- カートページ（/cart）を新規追加（※ UI のみ、機能は MVP）

---

## 2. カート機能（最小 MVP）を導入（Zustand）

### 2-1. カートのデータ構造（Zustand）

以下の内容を useCartStore に保持する：

- productId（microCMS の ID）
- title（商品名）
- price（microCMS の価格を使用）
- qty（個数）
- image（商品画像 URL）

### 2-2. カート操作関数

- addToCart(product, qty)
- removeFromCart(productId)
- updateQty(productId, qty)
- clearCart()

※ 在庫はまだ扱わない（Supabase 導入時に追加）

---

## 3. menu ページ（商品一覧）改修

- 各商品カードに「カートに追加」ボタンを追加
- 以下を同時実装：
  - 数量可変（左右の - / + ボタン）
  - 初期値：1
  - カートに追加したら toast で通知
- 商品カードの画像またはタイトルをタップすると商品詳細ページへ遷移

---

## 4. 商品詳細ページ（menu/[id]）

- 商品詳細の構成・価格・グラム数は **microCMS 全面管理**（UI 側では編集しない）
- UI に数量可変コンポーネントを追加（- / +）
- 初期数量：1
- 「カートに追加」ボタンを配置

※ 商品詳細ページの仕様は変更しない  
（商品説明・料金・グラム数など CMS で自由に可変）

---

## 5. カートページ（/cart）作成

- カート内の商品一覧を表示
- 個数変更（- / +）
- 商品削除ボタン
- 小計（price × qty）
- 合計金額表示
- 「購入へ進む」ボタン（※ Stripe 未接続のため今は UI だけ）

---

## 6. Stripe / Supabase（後日実装・別フェーズ）

- 今フェーズでは Stripe と Supabase は**導入しない**
- Stripe との連携は、後日 API route（/api/checkout）を作成して実装する
- 在庫管理（Supabase）は Stripe Webhook とセットで導入予定
- 今は UI のみ「購入へ進む」ボタンを置く

---

## 7. UI/UX 改修

- SITE 全体の余白（LightUpCoffee のような広めのデザイン）
- ボタンの色をライムグリーン（#A4DE02）で統一
- カード、ボタン、Badge のデザイン統一
- レスポンシブ最適化（SP：1 カラム / PC：2〜3 カラム）

---

## 今日の目標（必達）

- Header のカートアイコン導入とページ遷移
- Zustand のカート基盤作成
- menu の「カートに追加」ボタン実装（数量可変付き）

---

## 今フェーズの重要ポイント（確認）

- 商品の価格・グラム数は microCMS の情報を“そのまま利用”
- カート内の合計計算も microCMS の price を使用
- Stripe 決済金額は後日の API で microCMS の価格を渡す仕様にする
- 在庫管理はまだ導入しない（後で Supabase 追加）
