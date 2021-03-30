docker-compose --env-file .env.dev -f docker-dev.yml stop
docker-compose --env-file .env.dev -f docker-dev.yml rm --force
docker volume prune --force