# JavaScript マインスイーパー

このリポジトリは JavaScript で実装したマインスイーパーゲームです。GitHub Pages でホスティングできます。

## 概要 (Overview)

このプロジェクトは、HTML、CSS、JavaScript を使用して実装したシンプルなマインスイーパーゲームです。
以下の機能を備えています：

- 3つの難易度レベル（初級、中級、上級）
- タイマー機能
- 残りの地雷数表示
- フラグ機能（右クリックで地雷の位置をマーク）

## 遊び方 (How to Play)

1. ブラウザで `index.html` を開くか、GitHub Pages でホストされたバージョンにアクセスします
2. 難易度を選択します（デフォルトは初級）
3. マスを左クリックして開きます
4. 地雷だと思われるマスを右クリックしてフラグを立てます
5. 地雷以外のすべてのマスを開くとゲームクリアです

## ローカルでの実行方法 (Running Locally)

```bash
# リポジトリをクローン
git clone https://github.com/your-username/minesweeper-js.git
cd minesweeper-js

# index.html をブラウザで開く
```

## GitHub Pages での公開方法 (Deploying to GitHub Pages)

1. GitHub にリポジトリを作成または既存のリポジトリを使用します
2. リポジトリにコードをプッシュします

```bash
git add .
git commit -m "Add Minesweeper game"
git push origin main
```

3. GitHub のリポジトリページに移動します
4. 「Settings」タブをクリックします
5. 左側のメニューから「Pages」を選択します
6. 「Source」セクションで、「Branch」を「main」（または「master」）に設定し、「/(root)」フォルダを選択します
7. 「Save」ボタンをクリックします
8. 数分後、GitHub Pages のURLが表示されます（通常は `https://your-username.github.io/repository-name/`）

## ファイル構成 (File Structure)

- `index.html` - メインのHTMLファイル
- `css/style.css` - ゲームのスタイル
- `js/minesweeper.js` - ゲームのロジック

## ライセンス (License)

MIT
