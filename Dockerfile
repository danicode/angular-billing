FROM node:18-alpine

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package.json /home/app

RUN npm install

COPY . /home/app/

RUN npm install -g @angular/cli

CMD ["ng", "serve", "--host", "0.0.0.0"]