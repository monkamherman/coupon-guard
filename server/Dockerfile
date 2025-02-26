FROM node:22-alpine
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
EXPOSE 10000
COPY . .
CMD ["yarn", "start"]
