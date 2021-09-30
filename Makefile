docker/up:
	docker-compose -f docker/docker-compose.yml up --build

docker/app/up:
	docker-compose -f docker/docker-compose.yml up -d latteswap-api

docker/up-cache:
	docker-compose -f docker/docker-compose.yml up

docker/logs:
	docker-compose -f docker/docker-compose.yml logs -f

docker/down:
	docker-compose -f docker/docker-compose.yml down
