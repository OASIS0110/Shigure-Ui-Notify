#!/bin/sh

set -eu
docker compose down --rmi all
dotenvx decrypt -f .env.local --stdout > ./decrypted_env/.env.local
docker compose build --no-cache
docker compose up -d