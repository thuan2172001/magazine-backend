FROM node:latest

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

RUN chmod -R 777 .

COPY . .