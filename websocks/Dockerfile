FROM node:latest

RUN mkdir -p usr/src/app/websocks

WORKDIR /usr/src/app/websocks

COPY . .
RUN npm install

EXPOSE 3002

CMD [ "npm", "run", "dev"]
# change for "npm run start" when development is finished
