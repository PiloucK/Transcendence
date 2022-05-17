FROM node:18

RUN mkdir -p usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${BACKEND_PORT}

CMD [ "npm", "run", "start:dev"]
# change for "npm run start" when development is finished?
