# AI冷蔵庫診断 本番カタログ進捗

更新日: 2026-08-28

## 目的
ヨドバシ.comで現在販売中または現在注文可能な Panasonic / 三菱電機 / 日立 / 東芝 / SHARP / AQUA の家庭用冷蔵庫を、メーカー公式仕様と照合しながら診断対象へ追加する。

メーカーの「現行商品」と、生産終了後もヨドバシで販売が続く「売り切り在庫」は別ステータスで管理する。

## 現在のデプロイ状態
- Vercel本番は **batch 14まで** 配信確認済み。
- `batch 15`（SHARP）、`batch 16`（AQUA）、`batch 17`（Panasonic）はGitHub mainに準備済みだが、Vercelの **build rate limit** で未配信。
- `batch 18`（売り切り在庫監査補正）は品質監査ブランチに準備済み。
  - 東芝 `GR-Y600FK` をヨドバシ販売継続の売り切り在庫として追加。
  - SHARP `SJ-X373P` は最新販売店情報でヨドバシが確認できないため除外。
- GitHubにコードが存在しても、本番URLでHTTP 200と読込を確認するまでは `production-live` と扱わない。

## 診断対象化の定義
1. ヨドバシ.comで現在販売中または現在注文可能であることを確認
2. メーカー現行品でなくても、生産終了後の売り切り在庫がヨドバシで販売継続していれば別枠で保持
3. 予約受付中・発売前・ヨドバシ取扱終了は本番候補から除外
4. 容量、幅、ドア方式、ドア数、主要冷凍容量、野菜室容量・位置、年間消費電力量、自動製氷、スマホ連携をメーカー公式情報で照合
5. 色違いだけでは候補数を増やさない
6. 右開き / 左開き、フレンチドア / どっちもドアなど診断上意味のある差は別型番として保持
7. 価格はヨドバシ.comの現行表示を最優先し、取得不能時は直近30日程度の量販店別価格・個別ショップ登録を補助証拠として使う
8. 各商品に `verifiedAt` を持たせる
9. GitHub登録済みとVercel本番配信済みを分離する

## メーカー別進捗

### Panasonic
- `catalog-inventory-panasonic.json`
- 現行候補 28件
- 現在本番配信済み: **26件**
- batch 17追加準備済み: `NR-C33JS2L` **1件（staged-not-live）**
- ヨドバシ確認待ち: `NR-FVF45S3` **1件**

### 三菱電機
- `catalog-inventory-mitsubishi.json`
- 発売済み現行候補 27件
- **27 / 27 本番化完了**

### 日立
- `catalog-inventory-hitachi.json`
- 標準冷凍冷蔵庫 21候補
- **20件本番 / `R-H54Y` 1件ヨドバシ確認待ち**
- `R-K11R`（冷凍庫）と `R-MR7S`（ミニバー）は対象外

### 東芝
- `catalog-inventory-toshiba.json`
- メーカー現行商品一覧基準: **30候補 / 30件本番化済み**
- 2025年Y世代の一部は公式ページ上で「生産終了品」になっているため、現行30件とは分離
- 売り切り在庫でヨドバシ販売継続確認済み:
  - `GR-Y510FK`：既存本番維持
  - `GR-Y600FK`：batch 18で追加準備済み
- 販売鮮度監査継続: `GR-Y550FK`, `GR-Y460FK`, `GR-Y550FZ`, `GR-Y510FZ`, `GR-Y460FZ`

### SHARP
- `catalog-inventory-sharp.json`
- 現行R世代 18候補
- 仕様・ヨドバシ確認: **18 / 18完了**
- 現在本番配信済み: **8件**
- batch 15追加準備済み: **10件（staged-not-live）**
- `SJ-X373P` は旧P世代。最新の価格比較では販売店が1店舗のみでヨドバシが表示されないため、batch 18で**除外準備済み**
- `SJ-MF55R` は公式値545Lで登録

### AQUA
- `catalog-inventory-aqua.json`
- 2026年A/B世代の標準冷凍冷蔵庫を左右開き差分込み **28候補**として整理
- 現在本番配信済み: **13件**
- batch 16追加準備済み: **14件（staged-not-live）**
- ヨドバシ確認待ち: **`AQR-FD7B` 1件**
- `AQR-9A`（90L・1ドア）は標準冷凍冷蔵庫診断の対象外
- 600L以上の現行標準冷凍冷蔵庫は確認できていないため、無理に登録しない

## 残る販売確認
ヨドバシ現行取扱の直接・最新根拠がまだ取れていないため、推測せず保留する。

### 現行候補
1. Panasonic `NR-FVF45S3`
2. 日立 `R-H54Y`
3. AQUA `AQR-FD7B`

### 売り切り在庫監査
1. 東芝 `GR-Y550FK`
2. 東芝 `GR-Y460FK`
3. 東芝 `GR-Y550FZ`
4. 東芝 `GR-Y510FZ`
5. 東芝 `GR-Y460FZ`

## 次の優先順位
1. **Vercel build rate limit解消後、batch 15〜18を本番配信確認**
2. 上記現行3機種＋東芝売り切り5機種の販売確認
3. 本番登録全商品の `verifiedAt` 欠損・価格鮮度監査
4. 色違い・型番表記揺れ・左右差分の重複監査
5. 全メーカー横断の診断回帰テスト

## カタログファイル
- `data.js`
- `catalog-production-extension.js`
- `catalog-production-batch2.js` ～ `catalog-production-batch14.js`：本番配信確認済み
- `catalog-production-batch15.js`：SHARP、GitHub main準備済み / Vercel未配信
- `catalog-production-batch16.js`：AQUA、GitHub main準備済み / Vercel未配信
- `catalog-production-batch17.js`：Panasonic、GitHub main準備済み / Vercel未配信
- `catalog-production-batch18.js`：売り切り在庫監査補正、品質監査ブランチ準備済み / Vercel未配信

毎日の「冷蔵庫価格チェック」は `data.js` とすべての `catalog-production-*.js` を対象とする。
