FROM node:18-alpine

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]

EXPOSE 8080