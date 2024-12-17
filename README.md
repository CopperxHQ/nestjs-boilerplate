# NestJS Starter

A production-ready NestJS starter template with TypeORM, PostgreSQL, Swagger, Pino Logger, and CLI commands support.

## Features

- 🚀 NestJS v10
- 📦 TypeORM with PostgreSQL
- 📝 Swagger API Documentation
- 🔍 Type checking with TypeScript
- 🔒 Environment validation using envalid
- 📋 ESLint + Prettier
- 🐳 Docker & Docker Compose
- 🪵 Pino Logger Integration
- ⚡ CLI Commands Support (nest-commander)
- ⏰ Scheduler/Cron Jobs
- 🏥 Health Checks
- 🧪 Jest Testing Setup

## Requirements

- Node.js >= 22
- npm >= 10
- PostgreSQL

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nestjs-starter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start PostgreSQL:

   ```bash
   docker-compose up postgres
   ```

5. Run the application:

   ```bash
   npm run dev
   ```

## Available Scripts

```bash
# Development
npm run dev                  # Run in development mode
npm run start:debug         # Run in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Run in production mode

# CLI Commands
npm run command            # Run CLI commands (production)
npm run command:dev        # Run CLI commands (development)
npm run command:dev basic -- -s10 # Run basic hello command (development)

# Scheduler
npm run scheduler:dev      # Run scheduler in development
npm run scheduler:debug    # Run scheduler in debug mode
npm run scheduler:prod     # Run scheduler in production

# Database Migrations
npm run migration:run      # Run migrations
npm run migration:generate # Generate migration
npm run migration:create   # Create new migration
npm run migration:revert   # Revert last migration

# Code Quality
npm run fix               # Run ESLint and Prettier fixes
npm run lint              # Run ESLint
npm run format            # Run Prettier

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate test coverage
npm run test:debug        # Run tests in debug mode
npm run test:e2e          # Run end-to-end tests
```

## Environment Variables

Required environment variables:

```env
PORT=3000
APP_VERSION=v0.0.0
SWAGGER_ENABLED=true
LOG_LEVEL=debug
CORS=true
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

## Project Structure

```
src/
├── commands/           # CLI commands
├── common/            # Shared utilities, filters, etc.
│   ├── dto/          # Data Transfer Objects
│   ├── entities/     # Base entities
│   ├── filters/      # Exception filters
│   ├── helpers/      # Helper functions
│   ├── interfaces/   # TypeScript interfaces
│   ├── logger/       # Logger setup
│   ├── services/     # Base services
│   ├── swagger/      # Swagger configuration
│   └── validators/   # Custom validators
├── config/           # Configuration
├── database/         # Database configuration & migrations
├── health/           # Health check endpoint
├── app.controller.ts
├── app.module.ts
├── commander.ts      # CLI entry point
├── main.ts          # Main application entry
└── scheduler.ts     # Scheduler entry point
```

## Docker Support

Build and run using Docker:

```bash
# Build the image
docker build -t nestjs-starter .

# Run the container
docker run -p 3000:3000 nestjs-starter
```

Using Docker Compose:

```bash
# Start all services
docker-compose up

# Start only PostgreSQL
docker-compose up postgres
```

## API Documentation

When running in development mode with `SWAGGER_ENABLED=true`, Swagger documentation is available at:

```
http://localhost:3000/api/docs
```

## Health Check

The application includes a health check endpoint at:

```
http://localhost:3000/healthcheck
```

## License

[UNLICENSED](LICENSE)

## Author

Tarun Mangukiya
