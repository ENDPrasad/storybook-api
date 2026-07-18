FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma client (prisma/generated is gitignored so must be built here)
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
