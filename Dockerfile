FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY . .
ENTRYPOINT [ "node", "index.js" ]
