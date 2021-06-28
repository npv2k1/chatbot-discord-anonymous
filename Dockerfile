
FROM node:latest

ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./


RUN npm install

COPY . .



CMD ["npm","run","dev"]
