
# Imagen base de Node.js
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --omit=dev

# Copiar el código del proyecto
COPY . .

# Crear directorio para logs y archivos subidos
RUN mkdir -p logs uploads

# Puerto de la API
EXPOSE 3000

# Verificar periódicamente el estado de la API
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Entorno de producción
ENV NODE_ENV=production

# Iniciar servidor
CMD ["npm", "start"]
