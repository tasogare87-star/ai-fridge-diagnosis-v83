# AI冷蔵庫診断 本番カタログ進捗

更新日: 2026-08-28

## 目的
ヨドバシ.comで現在販売中または現在注文可能な Panasonic / 三菱電機 / 日立 / 東芝 / SHARP / AQUA の家庭用冷蔵庫を、メーカー公式仕様と照合しながら診断対象へ追加する。

メーカーの「現行商品」と、生産終了後もヨドバシで販売が続く「売り切り在庫」は別ステータスで管理する。標準冷凍冷蔵庫の診断用途から外れる特殊小容量機も別枠で管理する。

## 現在のデプロイ状態
- Vercel本番は **batch 14まで** 配信確認済み。
- `batch 15` ～ `batch 20` はGitHub mainへ反映済みだが、Vercelの **build rate limit** により未配信。
- 固定QR用 `ai-fridge-diagnosis-public` はv8.2のまま維持し、今回の更新対象外。

## 自動カタログ検証
GitHub Actions `Catalog validation` と診断回帰テストを運用中。

batch20適用時の検証結果:
- 総商品数: **152機種**
- AQUA: 27
- HITACHI: 21
- MITSUBISHI ELECTRIC: 27
- Panasonic: 27
- SHARP: 18
- TOSHIBA: 32
- 潜在的な色違い・ベース型番重複: **0件**
- カタログ警告: **0件**
- `Catalog validation: PASS`
- `Diagnosis regression: PASS`

## 診断対象化の定義
1. ヨドバシ.comで現在販売中または現在注文可能であることを確認
2. メーカー現行品でなくても、生産終了後の売り切り在庫がヨドバシで販売継続していれば別枠で保持
3. 予約受付中・発売前・ヨドバシ取扱終了は本番候補から除外
4. 容量、幅、ドア方式、ドア数、主要冷凍容量、野菜室容量・位置、年間消費電力量、自動製氷、スマホ連携をメーカー公式情報で照合
5. 色違いだけでは候補数を増やさない
6. 右開き / 左開き、フレンチドア / どっちもドアなど診断上意味のある差は別型番として保持
7. 価格はヨドバシ.comの現行表示を最優先し、取得不能時は直近30日程度の量販店別価格・個別ショップ登録を補助証拠として使う
8. 各商品に `verifiedAt` を持たせる
9. 100L未満の特殊小容量機や家具調・ミニバー用途は、標準冷凍冷蔵庫診断から除外し別管理する
10. GitHub登録済みとVercel本番配信済みを分離する

## メーカー別進捗

### Panasonic
- `catalog-inventory-panasonic.json`
- 現行候補 28件
- GitHub診断カタログ: **27件**
- ヨドバシ確認待ち: `NR-FVF45S3` **1件**
- `NR-F55HY3-N` は287,100円へ更新済み

### 三菱電機
- `catalog-inventory-mitsubishi.json`
- 発売済み現行候補 27件
- **27 / 27 完了**

### 日立
- `catalog-inventory-hitachi.json`
- 標準冷凍冷蔵庫 21候補
- **21 / 21 完了**
- `R-H54Y-S`: batch20で追加。ヨドバシ実売219,250円を確認し公式仕様を再照合
- `R-K11R`（冷凍庫）と `R-MR7S`（ミニバー）は対象外

### 東芝
- `catalog-inventory-toshiba.json`
- メーカー現行商品一覧基準: **30 / 30完了**
- 売り切り在庫でヨドバシ販売継続確認済み: `GR-Y510FK`, `GR-Y600FK`
- 販売鮮度監査継続: `GR-Y550FK`, `GR-Y460FK`, `GR-Y550FZ`, `GR-Y510FZ`, `GR-Y460FZ`

### SHARP
- `catalog-inventory-sharp.json`
- 現行R世代 **18 / 18完了**
- `SJ-X373P` はヨドバシ現行販売なしと判定し除外済み
- `SJ-MF55R` は公式値545Lで登録

### AQUA
- `catalog-inventory-aqua.json`
- 標準冷凍冷蔵庫: **27候補 / 27件GitHub診断カタログ化済み / pending 0**
- `AQR-FD7B` は72L・家具調2ドアの特殊小容量冷凍冷蔵庫。診断の100L hard minimum未満のため標準診断対象外へ整理
- `AQR-9A`（90L・1ドア）も標準診断対象外
- AQUAの現行標準ライン初回監査は完了

## 残る販売確認
ヨドバシ現行取扱の直接・最新根拠が取れていないため推測せず保留する。

### 現行候補
1. Panasonic `NR-FVF45S3`

### 売り切り在庫監査
1. 東芝 `GR-Y550FK`
2. 東芝 `GR-Y460FK`
3. 東芝 `GR-Y550FZ`
4. 東芝 `GR-Y510FZ`
5. 東芝 `GR-Y460FZ`

## 次の優先順位
1. **Vercel build rate limit解消後、batch15～20を本番配信確認**
2. Panasonic `NR-FVF45S3` と東芝売り切り5機種の販売確認
3. 本番反映後、ブラウザ実機相当の全メーカー横断回帰確認

## カタログファイル
- `data.js`
- `catalog-production-extension.js`
- `catalog-production-batch2.js` ～ `catalog-production-batch14.js`: 本番配信確認済み
- `catalog-production-batch15.js` ～ `catalog-production-batch20.js`: GitHub main反映済み / Vercel未配信
- `validate-catalog.mjs`: カタログ自動検証
- `test-diagnosis.mjs`: 診断回帰テスト
- `.github/workflows/catalog-validate.yml`: mainおよびcatalog系ブランチで検証実行

毎日の「冷蔵庫価格チェック」は `data.js` とすべての `catalog-production-*.js` を対象とする。
