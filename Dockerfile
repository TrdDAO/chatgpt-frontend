FROM node:16.18.0

WORKDIR /usr/src/app

COPY package*.json /usr/src/app
RUN npm install -g pnpm
RUN pnpm install

COPY . /usr/src/app

RUN npm run build

EXPOSE 5000

ENTRYPOINT ["npm", "run"]
CMD ["server"]