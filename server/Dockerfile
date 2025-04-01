# Étape unique (sans multi-stage pour tester)
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN yarn install --only=production
COPY . .
EXPOSE 8080
CMD ["node", "src/app.ts"]