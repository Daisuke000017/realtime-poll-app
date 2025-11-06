# リアルタイム投票・アンケートアプリ

イベントやミーティングで使えるリアルタイム投票・アンケートアプリです。Firebase無料プラン（Sparkプラン）で動作します。

## 主な機能

- ✅ **QRコードで簡単参加** - QRコードをスキャンするだけで投票に参加
- ✅ **リアルタイム更新** - 投票結果がリアルタイムで更新
- ✅ **匿名投票対応** - プライバシーを保護した投票が可能
- ✅ **単一/複数選択** - 用途に応じた投票タイプを選択
- ✅ **管理画面** - 投票の開始/終了、結果の確認が可能
- ✅ **レスポンシブデザイン** - PC・スマートフォンに対応

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Firebase Realtime Database
- **認証**: Firebase Authentication (匿名認証)
- **ホスティング**: Firebase Hosting
- **グラフ表示**: Recharts
- **QRコード**: qrcode.react

## Firebase無料プランについて

このアプリはFirebaseの無料プラン（Sparkプラン）で動作します：

### 無料プランの制限

- **Realtime Database**: 1GB ストレージ、10GB/月 ダウンロード、同時接続100
- **Authentication**: 無制限
- **Hosting**: 10GB ストレージ、360MB/日 転送量

### 推奨される使用規模

- **小〜中規模のイベント**: 同時接続50人程度まで快適
- **投票データ**: 約10,000件の投票を保存可能
- **月間イベント数**: 20〜30回のイベント開催が可能

大規模イベント（100人以上）の場合は、有料プラン（Blazeプラン）への移行を推奨します。

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd realtime-poll-app
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: realtime-poll-app）
4. Google Analyticsは任意で有効化
5. プロジェクトを作成

### 4. Firebase Authentication の設定

1. Firebase Console で「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで「匿名」を有効化

### 5. Firebase Realtime Database の作成

1. Firebase Console で「Realtime Database」を選択
2. 「データベースを作成」をクリック
3. ロケーションを選択（例: asia-southeast1）
4. セキュリティルールは「ロックモード」で開始

### 6. Firebaseの設定情報を取得

1. Firebase Console で⚙️（設定）→「プロジェクトの設定」
2. 「全般」タブで「マイアプリ」セクションまでスクロール
3. 「</>」（ウェブアプリ）をクリック
4. アプリのニックネームを入力（例: web-app）
5. 「アプリを登録」をクリック
6. 表示される設定情報をコピー

### 7. 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成：

```bash
cp .env.example .env
```

`.env` ファイルを編集して、Firebaseの設定情報を入力：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

### 8. Firebase CLI のインストールとログイン

```bash
npm install -g firebase-tools
firebase login
```

### 9. Firebase プロジェクトの初期化

`.firebaserc` ファイルを編集して、プロジェクトIDを設定：

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 10. セキュリティルールのデプロイ

```bash
firebase deploy --only database
```

### 11. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## デプロイ（本番環境）

### 1. ビルド

```bash
npm run build
```

### 2. Firebase Hosting にデプロイ

```bash
firebase deploy --only hosting
```

デプロイが完了すると、URLが表示されます（例: https://your-project.firebaseapp.com）

## 使い方

### 投票の作成

1. トップページで「新しい投票を作成」をクリック
2. タイトル、説明、選択肢を入力
3. 投票タイプ（単一/複数選択）を選択
4. 「投票を作成」をクリック
5. 管理画面が表示され、QRコードが生成されます

### 投票への参加

参加者は以下の方法で投票できます：

- **QRコード**: 管理画面に表示されるQRコードをスキャン
- **URL**: 投票用URLを直接アクセス

### 結果の確認

- **リアルタイム表示**: 結果画面で投票がリアルタイムに更新
- **グラフ表示**: 棒グラフとパーセンテージで視覚的に表示

### 管理機能

管理画面（adminKey必要）では以下が可能：

- 投票の開始/終了
- QRコードの表示・ダウンロード
- リアルタイム結果の確認
- 投票の削除

## プロジェクト構造

```
realtime-poll-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # トップページ
│   │   ├── create/            # 投票作成
│   │   └── poll/[id]/         # 投票・結果・管理画面
│   ├── components/            # UIコンポーネント
│   ├── hooks/                 # Custom Hooks
│   └── lib/                   # ユーティリティ関数
│       ├── firebase.ts        # Firebase設定
│       ├── database.ts        # DB操作
│       ├── auth.ts           # 認証
│       ├── types.ts          # 型定義
│       └── utils.ts          # 汎用関数
├── public/                    # 静的ファイル
├── firebase.json              # Firebase設定
├── database.rules.json        # セキュリティルール
└── README.md
```

## データベース構造

```json
{
  "polls": {
    "poll_id": {
      "title": "投票のタイトル",
      "description": "説明",
      "type": "single",
      "status": "active",
      "allowAnonymous": true,
      "createdAt": 1699123456789,
      "createdBy": "user_id",
      "adminKey": "secret_key",
      "totalVotes": 42,
      "options": {
        "option_1": {
          "id": "option_1",
          "text": "選択肢1",
          "votes": 15
        }
      }
    }
  },
  "votes": {
    "poll_id": {
      "user_id": {
        "optionId": "option_1",
        "votedAt": 1699123456789,
        "isAnonymous": true
      }
    }
  },
  "userPolls": {
    "user_id": {
      "poll_id": true
    }
  }
}
```

## セキュリティ

- **匿名認証**: Firebase Authenticationで安全に認証
- **重複投票防止**: ユーザーIDベースで1回のみ投票可能
- **セキュリティルール**: データベースルールでアクセス制御
- **管理者キー**: 管理画面へのアクセスにadminKeyが必要

## トラブルシューティング

### Firebase接続エラー

- `.env` ファイルの設定情報が正しいか確認
- Firebase Consoleでプロジェクトが有効化されているか確認

### 投票が保存されない

- Realtime Databaseのセキュリティルールがデプロイされているか確認
- Firebase Authenticationで匿名認証が有効か確認

### QRコードが表示されない

- ブラウザのコンソールでエラーを確認
- `qrcode.react` パッケージが正しくインストールされているか確認

## ライセンス

MIT License

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

© 2024 リアルタイム投票アプリ - Firebase無料プランで動作
