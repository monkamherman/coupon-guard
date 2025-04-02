# Étape de build
FROM node:22-slim as builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --only=production
COPY . .

# Étape finale
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8080
CMD ["node", "src/app.ts"]