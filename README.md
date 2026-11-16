# yonago.dev

鳥取県米子市のエンジニアコミュニティ「yonago.dev」のサイトです。

- サイト：https://yonago.dev/
- connpass：https://yonago-dev.connpass.com/

## 中身

ビルドはありません。ページは`index.html`の1枚です。「次の集まり」の欄だけ、`api/events.mjs`がconnpassのグループから読んできます。日程をHPに書く必要はありません。

| ファイル | 役割 |
|---|---|
| `index.html` | ページ本体。スタイルとスクリプトも中に入っています |
| `api/events.mjs` | connpassのグループの新着フィードから、これからの集まりを返す（Vercelの関数） |
| `og.png` | SNSやLINEにURLを貼ったときの画像 |
| `og.html` | `og.png`の元 |
| `icon.png`、`favicon.svg` | アイコン |
| `brand/` | ロゴの元（`logo.html`）と書き出した画像 |
| `robots.txt`、`sitemap.xml` | 検索エンジン向け |
| `scripts/check.mjs` | 公開前の確認 |

## 手元で見る

`index.html`をブラウザで開くだけです。最初のアニメーションをもう一度見るときは、URLの末尾に`?intro`を付けます。

「次の集まり」の欄は、手元では出ません。プルリクエストの確認用URLで見てください。

## 公開のしかた

`main`に入った内容が、Vercelでそのまま https://yonago.dev/ に公開されます。プルリクエストには、確認用のURLが付きます。

プッシュとプルリクエストのたびに、GitHub Actionsで`scripts/check.mjs`が動きます。手元では次のとおりです。

```
node scripts/check.mjs
```

## 直したい所を見つけたら

誤字でも、企画の案でも、プルリクエストやIssueを歓迎します。

## 画像の作り直し

`og.png`とロゴは、HTMLをChromeで撮って作っています。

```
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=og.png "file://$PWD/og.html"
"$CHROME" --headless=new --hide-scrollbars --window-size=800,800 --screenshot=brand/logo-text.png "file://$PWD/brand/logo.html"
"$CHROME" --headless=new --hide-scrollbars --window-size=800,800 --screenshot=brand/logo-plain.png "file://$PWD/brand/logo.html?plain"
```

## 写真の出典

最初のアニメーションの写真は、NASA Blue Marble（NASA EOSDIS GIBS）と、国土地理院の地理院タイル（全国最新写真）です。
