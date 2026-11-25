
# Etapa 1: instalar dependencias de producción
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# Etapa 2: imagen final de ejecución
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copiar dependencias de producción
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

# Copiar archivos necesarios para ejecutar la API
COPY --chown=node:node package*.json ./
COPY --chown=node:node src ./src

# Crear directorios y asignar permisos
RUN mkdir -p logs uploads && \
    chown -R node:node /app/logs /app/uploads

# Ejecutar sin privilegios de root
USER node

EXPOSE 3000

# Healthcheck de la API
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
