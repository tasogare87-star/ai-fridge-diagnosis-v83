# AI冷蔵庫診断 カタログ品質監査

更新日: 2026-08-28

## 目的
本番候補を「新しい世代かどうか」だけで判断せず、メーカー公式仕様、ヨドバシ販売状態、価格鮮度、診断用途、設置奥行き、本番配信状態を分離して管理する。

## 自動品質検証
`validate-catalog.mjs`、`validate-inventory.mjs` と診断・奥行き・AQUA優先度の回帰テストをGitHub Actionsで実行する。

現在の基準:
- 総商品数: **152**
- AQUA 27 / HITACHI 21 / MITSUBISHI ELECTRIC 27 / Panasonic 27 / SHARP 18 / TOSHIBA 32
- 構文・必須項目エラー: 0
- 完全同一型番重複: 0
- 潜在的な色違い・ベース型番重複: 0
- validator警告: **0**
- 奥行き公式確認: **152 / 152**
- 据付必要奥行き確認: **123 / 152**
- 本体奥行きのみ: **29 / 152**

## 監査で確定した重要事項

### 1. 6機種を明示的除外
2026-08-28の運用判断により、以下6機種は**診断候補・pending・売り切り在庫監査・将来の自動昇格候補から除外**する。

- Panasonic `NR-FVF45S3`
- TOSHIBA `GR-Y550FK`
- TOSHIBA `GR-Y460FK`
- TOSHIBA `GR-Y550FZ`
- TOSHIBA `GR-Y510FZ`
- TOSHIBA `GR-Y460FZ`

除外履歴はinventory JSONに残すが、今後の販売確認対象には戻さない。

この6機種は除外前から本番診断152機種には含まれていなかったため、**本番総数は152機種のまま**。

### 2. Panasonic NR-FVF45S3
- メーカー現行品としての履歴は保持。
- 本番候補には未登録のまま。
- `catalog-inventory-panasonic.json` の `excludedCurrentProducts` へ移動。
- `pendingYodobashiCheck` は **0** に変更。

### 3. 東芝5機種
- `GR-Y550FK`, `GR-Y460FK`, `GR-Y550FZ`, `GR-Y510FZ`, `GR-Y460FZ` を `retailSellThroughAudit` から削除。
- `excludedRetailSellThrough` に履歴として保持。
- `retailSellThroughAudit` は **0件**。
- 今後の売り切り在庫昇格監査対象にはしない。

### 4. 東芝 GR-Y510FK / GR-Y600FK は本番保持
- `GR-Y510FK` と `GR-Y600FK` は、既に確認済みの販売根拠に基づき売り切り在庫として本番診断対象に保持する。
- 明示的除外6機種には含めない。

### 5. 日立 R-H54Y
- `catalog-production-batch20.js` で本番候補へ追加済み。
- 日立の標準冷凍冷蔵庫は **21 / 21完了**。

### 6. AQUA特殊小容量機
- `AQR-FD7B` と `AQR-9A` は標準診断対象外として別管理を継続。

### 7. SHARP SJ-X373P
- ヨドバシ現行販売なしと判定し診断対象から除外済み。

### 8. 奥行きデータ
- メーカー公式根拠で **152 / 152** の奥行き確認を完了。
- `installDepth` 確認済み123機種は奥行きhard filterに使用可能。
- 本体奥行きのみ29機種は最終クリアランス確認を要求する。

## 鮮度ルール
本番152機種の販売判定は次の優先順位とする。

1. ヨドバシ商品ページの現在表示
2. 直近30日程度の価格.com「ヨドバシ・ドット・コム」個別ショップ登録
3. 直近30日程度の量販店別価格でヨドバシが実売ショップとして価格表示
4. 量販店候補名にヨドバシが出るだけでは販売確認としない
5. 古い検索キャッシュや購入報告は単独根拠にしない

明示的除外6機種については、この鮮度監査の対象外とする。

## inventory CI契約
`validate-inventory.mjs` で以下を固定する。

- Panasonic本番27件 / pending 0 / `NR-FVF45S3` excluded
- SHARP現行18件 production-live
- AQUA標準27件 production-live / pending 0
- 東芝売り切り在庫 live 2件 / audit 0件 / excluded 5件
- 除外6機種の型番集合と除外日を固定

これにより、明示的除外機種が誤ってpendingやauditへ戻った場合はCIを失敗させる。

## デプロイ状態
- Vercel本番は **batch20 / v8.11 / 奥行き拡張まで配信済み**。
- 公開URL `https://ai-fridge-diagnosis-v83.vercel.app/` はHTTP 200確認済み。
- 固定QR用public projectはv8.2のまま維持し、変更していない。

## 次の監査順
1. 本番v8.11を実機ブラウザで複数ケース確認
2. 本番152機種の価格・販売状態の48時間鮮度監査を継続
3. inventory / 本番配信 / CIの整合性を維持
