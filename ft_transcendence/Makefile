# Make rules
up				:
					sudo docker compose -f ./srcs/docker-compose.yml up -d

stop			:
					sudo docker compose -f ./srcs/docker-compose.yml stop

start			:
					sudo docker compose -f ./srcs/docker-compose.yml start

prune			:
					sudo docker system prune --volumes --all

down			:
					sudo docker compose down

build			:
					sudo docker compose build

clean			:	prune

.PHONY	=		up start down build stop prune clean