FROM node:latest

RUN     mkdir -p usr/src/app/websocks

WORKDIR /usr/src/app/websocks

COPY . .
RUN  yarn

EXPOSE 3003

CMD [ "yarn", "start:dev"]
