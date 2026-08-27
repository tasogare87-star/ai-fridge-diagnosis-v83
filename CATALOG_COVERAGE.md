# AI冷蔵庫診断 本番カタログ進捗

更新日: 2026-08-28

## 目的
ヨドバシ.comで現在販売中の Panasonic / 三菱電機 / 日立 / 東芝 / SHARP / AQUA の家庭用冷蔵庫を、メーカー公式仕様と照合しながら診断対象へ段階的に追加する。

## 現在のデプロイ状態
- Vercel本番は **batch 14まで** 配信確認済み。
- SHARP `batch 15` と AQUA `batch 16` はGitHub側で仕様・価格確認済みコードを準備しているが、Vercelの **build rate limit** により未配信。
- rate limit解消後、本番HTTP 200を確認して `staged-not-live` を `production-live` に切り替える。

## 全機種化の定義
1. ヨドバシ.comで現在販売中または現在注文可能であることを確認
2. 予約受付中・発売前・販売終了・取扱終了は本番候補から除外
3. 容量、幅、ドア方式、ドア数、主要冷凍容量、野菜室容量・位置、年間消費電力量、自動製氷、スマホ連携をメーカー公式情報で照合
4. 色違いだけでは候補数を増やさない
5. 右開き / 左開き、フレンチドア / どっちもドアなど診断上意味のある差は別型番として保持
6. 価格はヨドバシ.comの現行表示を優先し、取得不能時は推測しない
7. 各商品に `verifiedAt` を持たせる
8. GitHubにコードがあっても、本番URLで配信確認できるまでは `production-live` と扱わない

## メーカー別進捗

### Panasonic
- `catalog-inventory-panasonic.json`
- 現行候補 28件
- 本番 26件 / ヨドバシ確認待ち 2件

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
- 左開き差分込み30候補
- **30 / 30 本番化完了**
- batch 13 / 14まで本番配信確認済み

### SHARP
- `catalog-inventory-sharp.json`
- 現行R世代 18候補
- 仕様・ヨドバシ確認: **18 / 18完了**
- 現在本番配信済み: **8件**
- batch 15で追加準備済み: **10件（staged-not-live）**
- batch 15対象: `SJ-MF55R`, `SJ-FF50R`, `SJ-X504R`, `SJ-MF46R`, `SJ-MW46R`, `SJ-X374R`, `SJ-PT32R`, `SJ-BD23R`, `SJ-GD15R`, `SJ-TD15R`
- `SJ-MF55R` は公式値 **545L** で登録

### AQUA
- `catalog-inventory-aqua.json`
- 2026年A/B世代の標準冷凍冷蔵庫を、左右開き差分込み **28候補**として整理
- 現在本番配信済み: **13件**
- batch 16で追加準備済み: **14件（staged-not-live）**
- ヨドバシ確認待ち: **`AQR-FD7B` 1件**
- batch 16対象: `AQR-TZA52A`, `AQR-TZ42A`, `AQR-TXA50A`, `AQR-TX51A`, `AQR-36AL`, `AQR-S26A`, `AQR-SBS48A`, `AQR-VZA45AL`, `AQR-V46A`, `AQR-V46AL`, `AQR-S31A`, `AQR-31A`, `AQR-S36A`, `AQR-S36AL`
- `AQR-9A`（90L・1ドア）は標準冷凍冷蔵庫診断の対象外
- 600L以上の現行標準冷凍冷蔵庫は確認できていないため、無理に登録しない

## 容量帯カバレッジ（現在の本番配信）

| メーカー | ～199L | 200～299L | 300～399L | 400～449L | 450～499L | 500～599L | 600L以上 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Panasonic | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| 三菱電機 | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| 日立 | — | ○ | ○ | ○ | ○ | ○ | ○ |
| 東芝 | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| SHARP | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| AQUA | ○ | ○ | ○ | ○ | ○ | ○ | — |

## 次の優先順位
1. **Vercel build rate limit解消後、batch 15 / 16を本番配信確認**
2. `AQR-FD7B` のヨドバシ現行販売・価格確認
3. 日立 `R-H54Y` のヨドバシ確認
4. Panasonic残り2件のヨドバシ確認
5. 旧世代・現行外モデルの販売終了確認とカタログ整理

## カタログファイル
- `data.js`
- `catalog-production-extension.js`
- `catalog-production-batch2.js` ～ `catalog-production-batch14.js`：本番配信確認済み
- `catalog-production-batch15.js`：SHARP、GitHub準備済み / Vercel未配信
- `catalog-production-batch16.js`：AQUA、GitHub準備済み / Vercel未配信

毎日の「冷蔵庫価格チェック」は `data.js` とすべての `catalog-production-*.js` を対象とする。
