FROM node:20-alpine

WORKDIR /app

# Копируем всё
COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src/

# Устанавливаем ВСЕ зависимости (включая devDependencies)
RUN npm install

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем TypeScript
RUN npm run build

EXPOSE 5174

CMD ["node", "dist/index.js"]