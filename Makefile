NAME	= Transcendence

COMPOSE	= docker-compose -p $(NAME)

all: $(NAME)

$(NAME):
	$(COMPOSE) up --build

start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down -v

rebuild: stop all

restart: stop start

prune:
	$(COMPOSE) down -v
	docker system prune --volumes --force --all
	docker image prune --all --force

clean: down

fclean: clean

re: fclean all

.PHONY: all $(NAME) start stop clean fclean re prune down rebuild restart
