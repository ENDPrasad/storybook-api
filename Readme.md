# 📚 Storybook API

Backend API for the **AI Personalized Storybook Platform**, where parents can upload their child's photo, choose or provide a story, and receive a professionally generated and printed personalized storybook featuring their child as the main character.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM** _(Coming Soon)_
- **Docker**
- **Pino Logger**
- **BullMQ** _(Coming Soon)_
- **Redis** _(Coming Soon)_
- **AWS S3** _(Coming Soon)_

---

## 📂 Project Structure

```text
storybook-api/
│
├── docker/
│   ├── dev/
│   └── prod/
│
├── src/
│   ├── app/
│   ├── config/
│   ├── controller/
│   ├── integrations/
│   │   └── aws/
│   ├── routes/
│   │   ├── public/
│   │   └── protected/
│   └── service/
│
├── tests/
├── docs/
│
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠 Prerequisites

- Node.js 22+
- Docker Desktop
- Docker Compose
- Git

---

## ⚙️ Installation

Clone the repository.

```bash
git clone <repository-url>
cd storybook-api
```

Install dependencies.

```bash
npm install
```

Create your environment file.

```bash
cp .env.example .env
```

---

## ▶️ Running Locally

```bash
npm run dev
```

Application:

```
http://localhost:3000
```

Health Check:

```
GET /api/public/health
```

S3 Status Check:

```bash
GET /api/protected/s3/status
```

---

## 🐳 Running with Docker (Development)

Build and start containers.

```bash
docker compose -f docker-compose.dev.yml up --build
```

Stop containers.

```bash
docker compose -f docker-compose.dev.yml down
```

---

## 🚀 Running Production Containers

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Stop production containers.

```bash
docker compose -f docker-compose.prod.yml down
```

---

## 🌍 Environment Variables

Example:

```env
PORT=3000

NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/storybook

AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET=storybook-api-bucket
AWS_S3_PREFIX=uploads
```

The app loads `.env` first and falls back to `.env.example` for local development if `.env` is missing.

---

## 📋 API Response Standard

Every API should return the same response structure.

Success

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {},
  "meta": null
}
```

S3 Status Success

```json
{
  "success": true,
  "message": "S3 connection successful",
  "data": {
    "bucket": "storybook-api-bucket",
    "region": "eu-north-1"
  },
  "meta": null
}
```

S3 Status Error

```json
{
  "success": false,
  "message": "S3 connection failed",
  "data": null,
  "meta": null
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

---

## 📌 Development Principles

- Thin Controllers
- Business Logic inside Services
- Database access only through Repositories
- Layer-based architecture with public/protected routes
- Centralized error handling
- Structured logging using Pino
- Validation before business logic
- Async processing for long-running jobs
- RESTful API conventions
- Type-safe development using TypeScript

---

## 📦 Planned Modules

- Authentication
- Customer
- Child
- Story Templates
- Custom Stories
- Orders
- Payments
- Uploads
- Notifications
- Shipping
- Admin

---

## 🗺 MVP Roadmap

### Phase 1

- Project Setup
- Docker
- PostgreSQL
- Health Check API
- Logging
- Error Handling
- Validation

### Phase 2

- Story Templates
- Customer
- Child Details
- Upload APIs

### Phase 3

- Orders
- Payments
- Email Notifications

### Phase 4

- AI Worker
- Story Generation
- Image Generation
- PDF Generation

### Phase 5

- Admin Dashboard
- Shipping Integration

---

## 🧪 Testing

Testing will be added using:

- Vitest
- Supertest

Run tests.

```bash
npm test
```

---

## 📖 Documentation

API documentation will be available in the `docs/` directory and will later be exposed through Swagger/OpenAPI.

---

## 🤝 Contributing

1. Create a feature branch.
2. Follow the existing project structure.
3. Ensure all tests pass.
4. Submit a Pull Request.

---

## 📄 License

This project is currently private and proprietary.
