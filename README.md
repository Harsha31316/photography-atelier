# The Photography Atelier

A full-stack photography package management application. The React frontend presents photography packages and studio statistics, while a Spring Boot REST API validates and manages package data stored in PostgreSQL.

## Project overview

The application is split into two independently runnable parts:

- **Frontend** — a responsive React single-page application built with Vite and Bootstrap. It uses React Router for navigation and Axios to call the backend.
- **Backend** — a Java 21 / Spring Boot REST API. Spring Data JPA and Hibernate persist package records in PostgreSQL.

The frontend provides home, package listing, package detail, and dashboard pages. Package creation, editing, and deletion use the backend API. Name search is performed by the API; category, active status, album availability, and the available sort choices are applied to the package list in the frontend.

## Features

- Photography-themed homepage with a responsive navigation bar and package highlights.
- Package listing with name search, category/status/album filters, sorting, and a clear-filters action.
- Package details page.
- Create, edit, and delete package workflows with validation and user feedback.
- Dashboard statistics loaded from the backend, including package count, average price, album count, and total included hours.
- REST API validation and centralized exception handling.
- Swagger UI / OpenAPI documentation.
- Docker Compose deployment with a dedicated PostgreSQL service, health check, and named persistent volume.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, Bootstrap, Axios, React Router |
| Backend | Java 21, Spring Boot 3.5.7, Spring Web, Spring Data JPA, Jakarta Validation |
| Database | PostgreSQL, Hibernate |
| API documentation | Springdoc OpenAPI / Swagger UI |
| Container deployment | Docker, Docker Compose, Nginx |
| Build and tests | npm, Maven, ESLint, JUnit / Spring Boot Test |

## Architecture

### Frontend

`frontend/src/main.jsx` loads Bootstrap and the app styles, then mounts the application inside React Router. `App.jsx` defines the Home, Packages, Package Details, and Dashboard routes. Pages call the shared service in `src/services/packageService.js`, which uses the Axios client configured in `src/services/api.js`. Reusable components render the navigation/layout, package cards, forms, and loading/error states.

### Backend

The backend follows a layered structure under `com.photographyatelier.backend`:

- `controller` maps HTTP requests to service operations.
- `service` contains package operations, sorting/search rules, response mapping, and dashboard calculations.
- `repository` uses Spring Data JPA for database access.
- `entity` maps the package model to the `photography_packages` table.
- `dto` defines validated API requests and response payloads.
- `exception` contains not-found handling and API error responses.
- `config` configures CORS and OpenAPI metadata.

## Project structure

```text
.
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/photographyatelier/backend/
│       │   │   ├── config/
│       │   │   ├── controller/
│       │   │   ├── dto/
│       │   │   ├── entity/
│       │   │   ├── exception/
│       │   │   ├── repository/
│       │   │   ├── service/
│       │   │   └── PhotographyAtelierApplication.java
│       │   └── resources/application.properties
│       └── test/java/com/photographyatelier/backend/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── App.css
│       └── index.css
├── .env.example
├── docker-compose.yml
├── DOCKER.md
└── README.md
```

## Database and package entity

The `PhotographyPackage` entity maps to the `photography_packages` table. Its fields are:

| Field | Type | Details |
| --- | --- | --- |
| `id` | `Long` | Auto-generated primary key |
| `packageName` | `String` | Required package name |
| `description` | `String` | Required description |
| `hoursIncluded` | `Integer` | Required positive number of hours |
| `price` | `Double` | Required positive price |
| `albumAvailable` | `Boolean` | Whether an album is included |
| `category` | `String` | Required category |
| `active` | `Boolean` | Whether the package is active |
| `createdAt` | `LocalDateTime` | Set when a record is created |
| `updatedAt` | `LocalDateTime` | Set on creation and updated on modification |

Hibernate is configured with `ddl-auto=update`; SQL logging is enabled in the application configuration.

### Local database configuration

For local backend development, `application.properties` points to PostgreSQL at `localhost:5433`, using the database name `Photography Atelier` (URL-encoded in the JDBC URL) and the `postgres` username. The database password is read from the `DB_PASSWORD` environment variable; it is not included in this README or source configuration.

### Docker database configuration

Docker Compose starts a **separate** PostgreSQL 18 container, by default with database `photography_atelier` and user `postgres`. The backend connects to the Compose service at `db:5432`. The password is supplied through the root `.env` file, which should not be committed. Docker data is stored in the Compose `postgres_data` named volume and is separate from any PostgreSQL installation on the host.

## REST API

The controller is rooted at `/api/packages`.

| Method | Endpoint | Purpose | Success response |
| --- | --- | --- | --- |
| `GET` | `/api/packages` | List all packages | `200 OK`, package array |
| `GET` | `/api/packages?sortBy=price&direction=asc` | List packages sorted by price | `200 OK`, package array |
| `GET` | `/api/packages/{id}` | Get one package | `200 OK`, package object |
| `POST` | `/api/packages` | Create a package | `201 Created`, created package |
| `PUT` | `/api/packages/{id}` | Update a package | `200 OK`, updated package |
| `DELETE` | `/api/packages/{id}` | Delete a package | `204 No Content` |
| `GET` | `/api/packages/search?name=wedding` | Search package names, case-insensitively | `200 OK`, matching package array |
| `GET` | `/api/packages/category/{category}` | Find packages by category, case-insensitively | `200 OK`, matching package array |
| `GET` | `/api/packages/dashboard` | Read package statistics | `200 OK`, dashboard object |

The backend's `sortBy` option currently accepts `price`; `direction` accepts `asc` or `desc` and defaults to `asc`. The package request body requires all package fields: `packageName`, `description`, `hoursIncluded`, `price`, `albumAvailable`, `category`, and `active`. The dashboard object contains `totalPackages`, `averagePackagePrice`, `packagesWithAlbums`, and `totalPhotographyHours`.

## Prerequisites

For local development:

- Java Development Kit 21
- Maven 3.9 or newer
- Node.js and npm
- PostgreSQL available at `localhost:5433` with a database matching the local JDBC URL in `backend/src/main/resources/application.properties`

For container deployment:

- Docker Desktop (or Docker Engine) with Docker Compose v2
- Host ports `5173` and `8080` available

## Installation and local development

### 1. Start/configure PostgreSQL

Create and start the PostgreSQL database for local development. The backend's `application.properties` specifies the local host, port, database name, and username. Set `DB_PASSWORD` in the same PowerShell terminal that will run Maven; do not put the password in the source files.

### 2. Run the backend

Open a PowerShell terminal from the project root:

```powershell
Set-Location .\backend
$env:DB_PASSWORD = Read-Host "Enter the PostgreSQL password"
mvn spring-boot:run
```

Keep the backend terminal open while using the app. To run backend tests in another terminal:

```powershell
Set-Location .\backend
mvn test
```

### 3. Run the frontend

In a second PowerShell terminal from the project root:

```powershell
Set-Location .\frontend
npm ci
npm run dev
```

The frontend's default Axios base URL is `http://localhost:8080/api`. The backend CORS configuration allows `http://localhost:5173` and `http://127.0.0.1:5173`.

Useful frontend checks:

```powershell
Set-Location .\frontend
npm run lint
npm run build
```

## Run with Docker Compose

Docker Compose runs the frontend, backend, and its own PostgreSQL database. It does not use or modify the local PostgreSQL database described above.

From the project root, create a local environment file from the non-secret template and replace the placeholder password with a strong password:

```powershell
Copy-Item .env.example .env
notepad .env
```

Then build and start the services:

```powershell
docker compose up --build -d
docker compose ps
```

The backend starts after the PostgreSQL health check succeeds. Nginx serves the frontend and proxies `/api`, `/swagger-ui`, and `/v3/api-docs` to the backend. For additional deployment guidance:

```powershell
Get-Content .\DOCKER.md
```

View service logs or stop the containers:

```powershell
docker compose logs -f
docker compose down
```

`docker compose down` preserves the named database volume. Do not use `docker compose down --volumes` if you want to retain the Docker database data.

## Access the application

| Service | Local development | Docker Compose |
| --- | --- | --- |
| Frontend | `http://localhost:5173` | `http://localhost:5173` |
| Backend API | `http://localhost:8080/api/packages` | `http://localhost:8080/api/packages` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` | `http://localhost:8080/swagger-ui/index.html` |
| Swagger UI via frontend proxy | — | `http://localhost:5173/swagger-ui/index.html` |

## Screenshots

Add current screenshots to `docs/screenshots/` and update these placeholder paths when the images are available.

| Page | Screenshot |
| --- | --- |
| Home | ![Home page screenshot placeholder](docs/screenshots/home.png) |
| Packages | ![Packages page screenshot placeholder](docs/screenshots/packages.png) |
| Dashboard | ![Dashboard page screenshot placeholder](docs/screenshots/dashboard.png) |

## Future enhancements

Possible follow-up work—not currently implemented—could include:

- Pagination for larger package collections.
- Persisted or server-side category, active-status, and album filters.
- Authentication and role-based access.
- Automated end-to-end tests.
- Production deployment, monitoring, and database backup guidance.

## Author and repository

The project source does not currently identify an author or GitHub repository URL. Replace these placeholders when the project is published:

- **Author:** _Add project author name_
- **GitHub repository:** _Add repository URL_
