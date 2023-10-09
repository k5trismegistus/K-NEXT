FROM node:20-bullseye
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

RUN apt-get update && apt-get upgrade -y && apt-get install ffmpeg -y

EXPOSE 4000
CMD npm run dev
