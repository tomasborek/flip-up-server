FROM node:18-alpine

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]

EXPOSE 8080
