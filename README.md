# amazonq-test

このリポジトリはAmazon Qでゲーム開発するためのテストです。

## 概要 (Overview)

このプロジェクトは、Amazon Q Developerを使用したゲーム開発のテスト用リポジトリです。シンプルなゲームクラスを実装しています。

## インストール方法 (Installation)

```bash
# リポジトリをクローン
git clone https://github.com/hide-G/amazonq-test.git
cd amazonq-test

# 依存関係のインストール
pip install -r requirements.txt

# パッケージのインストール
pip install -e .
```

## 使用方法 (Usage)

```python
from src.game import Game

# ゲームのインスタンスを作成
game = Game("My Awesome Game")

# ゲームを開始
game.start()

# スコアを更新
game.update_score(10)

# ゲームを終了
final_score = game.end()
print(f"Final score: {final_score}")
```

## テスト実行方法 (Running Tests)

```bash
pytest tests/
```

## ライセンス (License)

MIT
