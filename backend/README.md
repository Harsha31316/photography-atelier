# Photography Atelier Backend

This folder contains the Spring Boot REST API. It is separate from the React application in `../frontend`.

## What each layer does

- `entity`: describes the `photography_packages` database table and its timestamp behavior.
- `repository`: provides database queries through Spring Data JPA.
- `service`: contains package operations, sorting rules, DTO mapping, and dashboard calculations.
- `controller`: exposes the REST endpoints and their HTTP status codes.
- `dto`: defines the request and response data sent through the API.
- `exception`: turns expected errors into useful JSON responses.
- `config`: configures frontend CORS access and the OpenAPI description.

## Requirements

- JDK 21
- Maven 3.9 or newer
- PostgreSQL listening on `localhost:5433`
- A database named `photography_atelier`

The application does not create or start PostgreSQL. Configure the database in pgAdmin first, then provide its password through the `DB_PASSWORD` environment variable.

## Troubleshooting PostgreSQL startup

The message `SQLState: 28P01` / `password authentication failed for user "postgres"` means PostgreSQL was reachable, but rejected the password supplied for that connection. Check that the `DB_PASSWORD` value in the same PowerShell terminal where Maven runs matches the password for the PostgreSQL `postgres` user. Do not add the password to `application.properties` or commit it to the project.

The message `SQLState: 3D000` / `database "photography_atelier" does not exist` is a different problem: create the database in pgAdmin, then start the application again.

## Run from the VS Code terminal

Open the `backend` folder in VS Code, open **Terminal > New Terminal**, and set the environment variable in PowerShell:

```powershell
$env:DB_PASSWORD = "your-postgres-password"
mvn spring-boot:run
```

The password is supplied through your terminal environment and is not stored in this project. Keep the terminal open while the application is running. To stop it, press `Ctrl+C`.

To run the tests and create the executable JAR:

```powershell
mvn clean test
mvn clean package
```

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/packages` | List packages |
| GET | `/api/packages?sortBy=price&direction=asc` | List packages by price |
| GET | `/api/packages/{id}` | Get one package |
| POST | `/api/packages` | Create a package |
| PUT | `/api/packages/{id}` | Replace a package |
| DELETE | `/api/packages/{id}` | Delete a package |
| GET | `/api/packages/search?name=wedding` | Search package names |
| GET | `/api/packages/category/Weddings` | Filter by category |
| GET | `/api/packages/dashboard` | Read package statistics |

Swagger UI is available at `http://localhost:8080/swagger-ui/index.html` after the application starts.

The frontend origin `http://localhost:5173` is allowed by the API's CORS configuration.
