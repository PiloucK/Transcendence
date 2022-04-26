FROM node:18

RUN mkdir -p usr/src/app/websocks

WORKDIR /usr/src/app/websocks

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD [ "npm", "run", "dev"]
# change for "npm run start" when development is finished
