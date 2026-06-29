FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci

FROM node:20-alpine AS backend-build
WORKDIR /app
COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS frontend-deps
WORKDIR /app
COPY app/package*.json ./
RUN npm ci

FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY app/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=frontend-deps /app/node_modules ./node_modules
COPY --from=frontend-build /app/dist ./frontend-dist
RUN npm install -g serve
CMD ["sh", "-c", "node dist/index.js & serve -s frontend-dist -l 3001"]
