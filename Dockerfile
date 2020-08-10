FROM node:slim

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN echo "DB_HOST=db"> ./env

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/server.js"]