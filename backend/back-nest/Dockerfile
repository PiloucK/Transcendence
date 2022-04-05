FROM node:latest

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN  yarn build

EXPOSE 3001

CMD [ "yarn", "start:dev"]
