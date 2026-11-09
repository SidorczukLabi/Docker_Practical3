
FROM node:22-alpine

WORKDIR /app

# Копіюємо файли залежностей backend
COPY backend/package*.json ./

# Встановлюємо залежності
RUN npm install --omit=dev

# Копіюємо backend
COPY backend/ ./

# Копіюємо frontend
COPY frontend/ ./frontend/

# Порт вебзастосунку
EXPOSE 3000

# Запуск сервера
CMD ["node", "server.js"]
