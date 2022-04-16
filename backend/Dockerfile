FROM node:latest

RUN     mkdir -p usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY . .
RUN  yarn

EXPOSE 3001

CMD [ "yarn", "start:dev"]
