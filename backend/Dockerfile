FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY dist ./dist/
COPY src/data ./dist/data 

RUN npm install --omit=dev
RUN npx prisma generate

EXPOSE 5174

CMD ["node", "dist/index.js"]