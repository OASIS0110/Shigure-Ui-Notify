#!/bin/bash

# データベースコンテナ再構築スクリプト
# PostgreSQLコンテナを完全に削除して再作成し、init.sqlで初期化します

set -e  # エラーが発生した場合にスクリプトを停止

echo "🔄 PostgreSQLコンテナを再構築しています..."

# コンテナ名とサービス名
CONTAINER_NAME="postgres-db"
SERVICE_NAME="db"

echo "🛑 既存のPostgreSQLコンテナを停止中..."
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    docker stop $CONTAINER_NAME
    echo "✅ コンテナを停止しました"
else
    echo "ℹ️  コンテナは既に停止されています"
fi

echo "🗑️  既存のPostgreSQLコンテナを削除中..."
if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
    docker rm $CONTAINER_NAME
    echo "✅ コンテナを削除しました"
else
    echo "ℹ️  削除するコンテナがありません"
fi

echo "🧹 PostgreSQLボリュームを削除中..."
if docker volume ls -q | grep -q "shigure-ui-notify_postgres_data"; then
    docker volume rm shigure-ui-notify_postgres_data 2>/dev/null || echo "⚠️  ボリューム削除をスキップ（使用中の可能性）"
    echo "✅ ボリュームを削除しました"
else
    echo "ℹ️  削除するボリュームがありません"
fi

echo "🚀 PostgreSQLコンテナを再作成中..."
docker compose up -d $SERVICE_NAME

echo "⏳ PostgreSQLの起動を待機中..."
# PostgreSQLが完全に起動するまで待機
for i in {1..30}; do
    if docker exec $CONTAINER_NAME pg_isready -U shigure >/dev/null 2>&1; then
        echo "✅ PostgreSQLが起動しました"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQLの起動がタイムアウトしました"
        exit 1
    fi
    echo "   起動チェック $i/30..."
    sleep 2
done

echo "🔍 データベースの状態を確認中..."
docker exec -it $CONTAINER_NAME psql -U shigure -d ui_shigure_notify -c "\dt"

echo "📊 作成されたテーブルを詳細確認..."
docker exec -it $CONTAINER_NAME psql -U shigure -d ui_shigure_notify -c "
    SELECT 
        schemaname as スキーマ,
        tablename as テーブル名,
        tableowner as 所有者
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
"

echo ""
echo "✅ PostgreSQLコンテナの再構築が完了しました！"
echo ""
echo "📋 コンテナ情報:"
docker ps --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "📊 次のコマンドでデータベースに接続できます:"
echo "   docker exec -it $CONTAINER_NAME psql -U shigure -d ui_shigure_notify"
echo ""
echo "🎯 次のコマンドでテーブル構造を確認できます:"
echo "   docker exec -it $CONTAINER_NAME psql -U shigure -d ui_shigure_notify -c '\d+ table_name'"
echo ""
echo "🔧 ログを確認する場合:"
echo "   docker logs $CONTAINER_NAME"