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

### `npm run deploy`

gh-pages を利用してデプロイする
gh-pages ブランチが作成され、Github Pages で公開される

- [参考サイト](https://tukkytech.com/blog/react-github-deploy/)

## メモ

- 2026年11月に Create React App から Vite へ移行した（CRA は非推奨化され、依存パッケージの脆弱性が解消できなくなったため）
- `package.json` に `"type": "module"` を付けないこと。付けると Vite 8 の CommonJS 互換ルールが厳密になり、`react-ga4` の default import が壊れて画面が真っ白になる
