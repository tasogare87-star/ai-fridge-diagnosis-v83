# AI冷蔵庫診断 本番カタログ進捗

更新日: 2026-08-28

## 目的
ヨドバシ.comで現在販売中または現在注文可能な Panasonic / 三菱電機 / 日立 / 東芝 / SHARP / AQUA の家庭用冷蔵庫を、メーカー公式仕様と照合しながら診断対象へ追加する。

メーカーの「現行商品」と、生産終了後もヨドバシで販売が続く「売り切り在庫」は別ステータスで管理する。

## 現在のデプロイ状態
- Vercel本番は **batch 14まで** 配信確認済み。
- `batch 15` ～ `batch 19` は **GitHub mainへ反映済み**だが、Vercelの **build rate limit** により未配信。
- GitHub登録済みとVercel本番配信済みを分離し、本番URLでHTTP 200と読込を確認するまでは `production-live` と扱わない。

### GitHub mainに準備済みの未配信batch
- `batch 15`: SHARP 現行R世代10機種追加
- `batch 16`: AQUA 現行14機種追加
- `batch 17`: Panasonic `NR-C33JS2L` 追加
- `batch 18`: 東芝 `GR-Y600FK` 売り切り在庫追加 / SHARP `SJ-X373P` 除外
- `batch 19`: 初期登録10機種の販売鮮度更新、日立HWS47スマホ連携確定、`NR-F55HY3-N` 価格更新

## 自動カタログ検証
GitHub Actions `Catalog validation` を導入済み。

2026-08-28現在のmain相当データで:
- 総商品数: **151機種**
- AQUA: 27
- HITACHI: 20
- MITSUBISHI ELECTRIC: 27
- Panasonic: 27
- SHARP: 18
- TOSHIBA: 32
- 構文・必須項目・完全同一型番重複・batch18監査条件: **PASS**
- `verifiedAt` 欠損 / スマホ連携未確定などのカタログ警告: **0件**

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
- `NR-C33JS2L`: batch17でGitHub main追加済み / Vercel未配信
- ヨドバシ確認待ち: `NR-FVF45S3` **1件**
- batch19で `NR-E47BR3/BR3L`, `NR-F55HY3` の販売鮮度を更新し、`NR-F55HY3-N` は **287,100円**へ更新

### 三菱電機
- `catalog-inventory-mitsubishi.json`
- 発売済み現行候補 27件
- **27 / 27 本番化完了**
- batch19で `MR-MZ49N-H` のヨドバシ販売状態を再確認

### 日立
- `catalog-inventory-hitachi.json`
- 標準冷凍冷蔵庫 21候補
- **20件本番 / `R-H54Y` 1件ヨドバシ確認待ち**
- batch19で `R-HWS47X / R-HWS47XL` のスマホ連携を公式仕様に基づき **false** へ確定し、販売鮮度を更新
- `R-K11R`（冷凍庫）と `R-MR7S`（ミニバー）は対象外

### 東芝
- `catalog-inventory-toshiba.json`
- メーカー現行商品一覧基準: **30候補 / 30件本番化済み**
- 売り切り在庫でヨドバシ販売継続確認済み:
  - `GR-Y510FK`: 既存本番維持、batch19で確認日を更新
  - `GR-Y600FK`: batch18でGitHub main追加済み / Vercel未配信
- 販売鮮度監査継続: `GR-Y550FK`, `GR-Y460FK`, `GR-Y550FZ`, `GR-Y510FZ`, `GR-Y460FZ`

### SHARP
- `catalog-inventory-sharp.json`
- 現行R世代 18候補
- 仕様・ヨドバシ確認: **18 / 18完了**
- 現在本番配信済み: **8件**
- batch15で追加10件をGitHub mainへ反映済み / Vercel未配信
- `SJ-X373P`: ヨドバシ現行販売なしと判定しbatch18で除外済み（GitHub側）
- `SJ-MF43R-H`: batch19で販売鮮度を更新
- `SJ-MF55R`: 公式値545Lで登録

### AQUA
- `catalog-inventory-aqua.json`
- 2026年A/B世代の標準冷凍冷蔵庫を左右開き差分込み **28候補**として整理
- 現在本番配信済み: **13件**
- batch16追加14件をGitHub mainへ反映済み / Vercel未配信
- `AQR-V43A / V43AL`: batch19で販売鮮度を更新
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
1. **Vercel build rate limit解消後、batch15～19を本番配信確認**
2. 上記現行3機種＋東芝売り切り5機種の販売確認
3. 型番表記揺れ・左右差分・シリーズ間重複の意味的監査
4. 本番反映後、全メーカー横断の診断回帰テスト

## カタログファイル
- `data.js`
- `catalog-production-extension.js`
- `catalog-production-batch2.js` ～ `catalog-production-batch14.js`: 本番配信確認済み
- `catalog-production-batch15.js` ～ `catalog-production-batch19.js`: GitHub main反映済み / Vercel未配信
- `validate-catalog.mjs`: カタログ自動検証
- `.github/workflows/catalog-validate.yml`: mainおよびcatalog系ブランチで検証実行

毎日の「冷蔵庫価格チェック」は `data.js` とすべての `catalog-production-*.js` を対象とする。
