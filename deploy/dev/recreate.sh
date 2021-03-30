./remove.sh
docker-compose --env-file .env.dev -f docker-dev.yml up -d --build --force-recreate -V
./log.sh