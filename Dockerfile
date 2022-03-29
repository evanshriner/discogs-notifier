FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD [ "node", "index.js" ]
