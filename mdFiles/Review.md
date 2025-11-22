# Review Checklist

## 1. セキュリティ

- 不要なファイル（md / psd / fig / backup など）が src または public に残っていない
- .env がコード内に露出していない
- API キーなどの秘匿情報が直書きされていない
- node_modules / .next / dist などが Git で追跡されていない
- 外部スクリプトや CDN の読み込みが安全である（http → https）
- 任意のユーザー入力が危険な形で DOM に渡っていない

## 2. 画面出力（動作確認）

- Next.js プロジェクトがエラーなく dev 起動する
- コンソールエラーが出ない
- ページ遷移やアンカーリンクが正常に動く
- ボタン・リンクが正しい挙動をする

## 3. レイアウト / デザイン

- PC/SP のレイアウトが崩れていない
- Figma デザインと視覚的に一致している
- 画像が適切に object-cover / object-contain / max-w-full
- Tailwind の spacing（px/py/mx/my）が統一されている
- 文字のサイズ・重み・行間が適切
- セクション幅が揃っている

## 4. Spec.md の仕様どおりか or 存在しなかったら無視していい

- Spec.md のカラー・余白・構成・ブレークポイントに一致
- Spec.md に記載の禁止事項（例：inline-style）が守られている
- Spec.md のコンポーネント構造が再現されている
- SEO 要件（title, description, og:image）が仕様どおり

## 5. Plans.md の作業が完了しているか or 存在しなかったら無視していい

- 今日（または今回）の作業項目がすべて実装されている
- 未完了のタスクがあれば明確化されている
- 不要な作業や差分が混入していない

---

# Codex Commands（固定）

## /review

Review.md の内容を参照して、  
src/app と src/components をレビューしてください。

出力形式：

- 問題点：箇条書き
- 修正案：diff 形式  
  まだ full code は生成しない。

## /fix

直前のレビュー結果に基づいて、  
必要なファイルを full updated code で出力してください。  
diff は不要。

## /final

Review.md に基づいて最終チェックを行い、  
問題がなければ “All clear” を返してください。  
問題があれば箇条書きで提示。
