FROM node:latest

RUN mkdir -p usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY . .
RUN npm install

EXPOSE 3001

CMD [ "npm", "run", "start:dev"]
