docker compose down --rmi all
dotenvx decrypt -f .env.local --stdout > ./decrypted_env/.env.local
docker compose build
docker compose up -d