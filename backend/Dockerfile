FROM node:18

RUN mkdir -p usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "start:dev"]
# change for "npm run start" when development is finished?
