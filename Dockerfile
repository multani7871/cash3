FROM node:8.11.1-alpine

RUN apk add --no-cache curl
RUN apk add --no-cache bash
RUN curl -s https://raw.githubusercontent.com/envkey/envkey-source/master/install.sh | bash
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . ./

CMD [ "npm", "start" ]