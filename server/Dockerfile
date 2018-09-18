FROM node:8.11.1-alpine

RUN npm install -g nodemon
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . ./