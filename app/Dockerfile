FROM node:20-bullseye
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

EXPOSE 4000
CMD npm run dev
