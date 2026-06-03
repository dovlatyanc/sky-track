FROM node:20-alpine

WORKDIR /app

# Копируем package.json и dist (уже собран локально)
COPY package*.json ./
COPY prisma ./prisma/
COPY dist ./dist/

# Устанавливаем только production зависимости
RUN npm install --omit=dev

# Генерируем Prisma Client
RUN npx prisma generate

EXPOSE 5174

CMD ["node", "dist/index.js"]