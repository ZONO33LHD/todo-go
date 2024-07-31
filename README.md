# todo-go
# TODOアプリケーション

このプロジェクトは、gRPC、GraphQL、React、Go、TypeScriptを使用したフルスタックのTODOアプリケーションです。

## 機能

- TODOアイテムの作成
- TODOリストの表示
- TODOアイテムの完了/未完了の切り替え

## 技術スタック

- バックエンド: Go、gRPC
- APIゲートウェイ: Node.js、GraphQL
- フロントエンド: React、TypeScript
- データベース: PostgreSQL

## プロジェクト構成

- `backend/`: Goで実装されたgRPCサーバー
- `graphql-gateway/`: Node.jsで実装されたGraphQLサーバー
- `frontend/`: Reactで実装されたフロントエンドアプリケーション

## セットアップ

### 前提条件

- Go 1.16以上
- Node.js 14以上
- PostgreSQL

### バックエンドのセットアップ

1. `backend/`ディレクトリに移動
2. 依存関係をインストール: `go mod tidy`
3. サーバーを起動: `go run cmd/server/main.go`

### GraphQLゲートウェイのセットアップ

1. `graphql-gateway/`ディレクトリに移動
2. 依存関係をインストール: `npm install`
3. サーバーを起動: `npm start`

### フロントエンドのセットアップ

1. `frontend/`ディレクトリに移動
2. 依存関係をインストール: `npm install`
3. アプリケーションを起動: `npm start`

## 使用方法

1. ブラウザで `http://localhost:3000` にアクセス
2. TODOアイテムを追加、表示、完了/未完了の切り替えを行う

## 開発者向け情報

- gRPCプロトコルの定義は `backend/proto/todo/todo.proto` にあります
- GraphQLスキーマは `graphql-gateway/src/schema/todo.graphql` にあります
