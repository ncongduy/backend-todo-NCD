FROM node:16

EXPOSE 5000

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "src/server.js"]
