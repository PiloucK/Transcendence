NAME	= Transcendence

COMPOSE	= docker-compose -p $(NAME)

all: $(NAME)

$(NAME):
	$(COMPOSE) up --build

start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

clean:
	$(COMPOSE) down -v
	docker system prune --volumes --force --all
	docker image prune --all --force

fclean: clean

re: fclean all

.PHONY: all $(NAME) start stop clean fclean re
