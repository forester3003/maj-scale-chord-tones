# maj-scale-chord-tones

ジャズギター練習用のWebアプリ（React + TypeScript + [Vite](https://vite.dev/)）。

## Available Scripts

In the project directory, you can run:

### `npm start`（または `npm run dev`）

開発サーバーの起動
5001ポートで起動するようにしている（`vite.config.mts` の `server.port`）
http://localhost:5001/maj-scale-chord-tones/ で開ける

### `npm test`

Vitest でテストを実行する（ウォッチモード）。1回だけ実行する場合は `npx vitest run`

### `npm run build`

型チェック（`tsc -b`）のあと、本番用ファイルを `build/` に出力する
`npm run preview` でビルド結果をローカル確認できる

## デプロイ

`main` ブランチにマージすると、GitHub Actions（`.github/workflows/deploy.yml`）がテスト・ビルドして GitHub Pages に自動で公開する

- PR ではテストとビルドだけ実行する（公開はしない）
- 手動で公開し直したいときは、Actions タブの「Build and Deploy」から「Run workflow」を押す
- 前提：リポジトリの Settings → Pages → Build and deployment の Source を「GitHub Actions」にしておくこと

## メモ

- 2026年11月に Create React App から Vite へ移行し、デプロイを `gh-pages` パッケージから GitHub Actions に切り替えた（CRA は非推奨化され、依存パッケージの脆弱性が解消できなくなったため）
- `package.json` に `"type": "module"` を付けないこと。付けると Vite 8 の CommonJS 互換ルールが厳密になり、`react-ga4` の default import が壊れて画面が真っ白になる
