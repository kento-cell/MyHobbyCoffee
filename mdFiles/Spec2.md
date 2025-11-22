# MyHobbyCoffee – Cart Function Specification

（Cart 機能の追加・更新版）

---

## 1. 概要

本仕様書は、MyHobbyCoffee.com に EC 対応の前段階となる「カート機能（MVP）」を導入するためのものである。

- microCMS → 商品情報（価格・画像・説明など）を既存通り使用
- Zustand → カート機能の全状態管理を担当
- Next.js → カート UI、数量変更 UI の構築
- Supabase / Stripe → **本フェーズでは導入しない**（後日追加）

本仕様は UI / 状態管理 / ページ構造の追加のみを扱う。

---

## 2. 追加ページ・追加コンポーネント

### ■ /cart（カートページ）

- カート内の商品一覧を表示
- 個数変更（＋／−）
- 小計表示（price × qty）
- 商品削除
- 合計金額表示
- 「購入へ進む」ボタン（Stripe 導入時に接続）

### ■ CartIcon（ヘッダー用）

- ヘッダー右上に配置
- 商品数バッジを表示（数量合計）
- クリック → /cart

### ■ QtySelector（数量選択 UI）

- “−” と “＋” の 2 ボタン
- 初期値：1
- 最小：1、最大：10
- menu 一覧 / 商品詳細 / cart ページ共通化

---

## 3. Header 改修仕様

- ナビゲーション内の **Beans** を廃止
- ShoppingCart アイコンを追加
- バッジにはカート内合計数量を表示
  - 数量が 0 の場合は非表示
- カートページ `/cart` へ遷移

---

## 4. State Management（Zustand）

### ● データ型

```ts
type CartItem = {
  id: string; // microCMS の ID
  title: string; // 商品名
  price: number; // microCMS の price
  image: string; // 画像 URL
  qty: number; // 個数
};
```
