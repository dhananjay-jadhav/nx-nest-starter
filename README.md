# Nx + Nest Starter

<div align="center">
  <a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br>

A production-ready starter template for building scalable applications with [Nx](https://nx.dev) and [NestJS](https://nestjs.com). This monorepo is configured with a NestJS API application, shared utility libraries, end-to-end testing, health checks, structured logging, and GitHub Actions CI/CD.

## ✨ Features

-   🏗️ **Nx Monorepo** - Efficient build system with caching and task orchestration
-   🚀 **NestJS API** - Production-ready REST API with modular architecture
-   ❤️ **Health Checks** - Kubernetes-ready liveness and readiness probes
-   📝 **Structured Logging** - Powered by Pino for high-performance logging
-   🧪 **Testing** - Unit tests with Jest and E2E tests configured
-   🔧 **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks
-   🔄 **CI/CD** - GitHub Actions workflow for automated testing and building

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Yarn](https://yarnpkg.com/getting-started/install) (v4.12.0+)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/dhananjay-jadhav/nx-nest-starter.git
    cd nx-nest-starter
    ```

2. **Install dependencies:**
    ```sh
    yarn install
    ```

## 🛠️ Development

This workspace is structured with a main application (`api`) and shared libraries (`utils`).

### Running the Development Server

To start the NestJS API in development mode with hot-reloading:

```sh
yarn start:api
```

The API will be available at `http://localhost:3000`.

### Available Scripts

| Script           | Description                       |
| ---------------- | --------------------------------- |
| `yarn start:api` | Start the API in development mode |
| `yarn build:api` | Build the API for production      |
| `yarn e2e:api`   | Run end-to-end tests              |
| `yarn lint`      | Lint all projects                 |
| `yarn all:test`  | Run unit tests for all projects   |
| `yarn all:build` | Build all projects                |
| `yarn format`    | Format code using Prettier        |

### Nx Commands

```sh
# Serve the API with hot reload
yarn nx serve api

# Build a specific project
yarn nx build api

# Run tests for a specific project
yarn nx test utils

# Run affected commands (only changed projects)
yarn nx affected:test
yarn nx affected:build

# View the project graph
yarn nx graph
```

## 🏥 Health Endpoints

The API includes Kubernetes-ready health check endpoints powered by `@nestjs/terminus`:

| Endpoint                | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `GET /health/liveness`  | Basic liveness probe - checks if app is running           |
| `GET /health/readiness` | Readiness probe - checks if app is ready to serve traffic |

The readiness endpoint includes a graceful shutdown indicator to support zero-downtime deployments.

## 📁 Workspace Structure

```
nx-nest-starter/
├── apps/
│   ├── api/                    # NestJS main application
│   │   └── src/
│   │       ├── main.ts         # Application entry point
│   │       └── app/
│   │           └── app.module.ts
│   └── api-e2e/                # End-to-end tests for the API
│       └── src/
│           ├── api/
│           │   └── health.spec.ts
│           └── support/
├── libs/
│   └── utils/                  # Shared utility library
│       └── src/lib/
│           └── health/         # Health check module
│               ├── health.controller.ts
│               ├── health.module.ts
│               ├── shutdown-health-indicator.ts
│               └── shutdown-service.service.ts
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow
├── nx.json                     # Nx workspace configuration
├── tsconfig.base.json          # Base TypeScript configuration
└── package.json                # Project dependencies
```

## 🔧 Tech Stack

| Technology  | Purpose               |
| ----------- | --------------------- |
| Nx 22.x     | Monorepo build system |
| NestJS 11.x | Backend framework     |
| TypeScript  | Type-safe development |
| Jest 30.x   | Testing framework     |
| Pino        | Structured logging    |
| ESLint 9.x  | Code linting          |
| Husky       | Git hooks             |

## 🚢 CI/CD

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/ci.yml`. The workflow is triggered on every push and pull request to the `main` branch.

**Pipeline Steps:**

1. ✅ Install dependencies
2. ✅ Run linting for all projects
3. ✅ Run unit tests for all projects
4. ✅ Build all projects

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ✨ Learn More

-   **Nx:** [Official Documentation](https://nx.dev/getting-started/intro)
-   **NestJS:** [Official Documentation](https://docs.nestjs.com/)
-   **Terminus (Health Checks):** [NestJS Terminus](https://docs.nestjs.com/recipes/terminus)
-   **Pino Logger:** [nestjs-pino](https://github.com/iamolegga/nestjs-pino)
