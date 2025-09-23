call docker compose down --rmi all
mkdir decrypted_env
call dotenvx decrypt -f .env.local --stdout > ./decrypted_env/.env.local
call docker compose build --no-cache
call docker compose up -d