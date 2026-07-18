# ---------- Build Stage ----------

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma client before compiling TypeScript
RUN npx prisma generate

RUN npm run build

# ---------- Runtime Stage ----------

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client (lives outside src/, not included in dist/)
COPY --from=builder /app/prisma/generated ./prisma/generated

EXPOSE 3000

CMD ["npm", "run", "start"]
