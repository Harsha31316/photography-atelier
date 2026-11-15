# Docker deployment

Docker Compose runs the frontend, Spring Boot API, and a dedicated PostgreSQL 18 container. Its database uses a named Docker volume and is separate from any PostgreSQL installation already running on your computer. The compose setup does not import, overwrite, or delete your existing local database.

## Prerequisites

- Docker Desktop with Docker Compose v2
- Ports `5173` and `8080` available on the host

## Configure credentials

From the project root in PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

Replace `POSTGRES_PASSWORD` in `.env` with a strong password. `.env` is ignored by Git and excluded from both image build contexts. Do not put credentials in the Dockerfiles or commit `.env`.

The compose file defaults to a Docker database named `photography_atelier` and user `postgres`. These can be changed in `.env` before the database volume is initialized. PostgreSQL initialization variables apply when the volume is first created; changing them later does not change credentials inside an existing database volume.

## Build and start

From the project root:

```powershell
docker compose up --build -d
docker compose ps
```

Compose waits for PostgreSQL's `pg_isready` health check before starting the backend. The backend connects to the `db` service on the Docker network (`db:5432`), not `localhost`. The frontend is served by Nginx, which forwards `/api` requests to the backend; the browser therefore uses the same-origin API URL and does not need a browser-to-container hostname.

- Frontend: <http://localhost:5173>
- API: <http://localhost:8080/api/packages>
- Swagger UI: <http://localhost:8080/swagger-ui/index.html>
- Swagger UI through Nginx: <http://localhost:5173/swagger-ui/index.html>

The database port is not published to the host. This avoids collisions with local PostgreSQL and keeps the database accessible only to services on the Compose network.

## View logs and stop

```powershell
docker compose logs -f
docker compose down
```

`docker compose down` stops and removes the containers and network but preserves the named PostgreSQL volume. Do not add `--volumes`/`-v` if you want to keep the Docker database data. This deployment creates a separate Docker database; it does not automatically connect to or migrate the PostgreSQL instance running on your host.

## Validate Compose configuration

The example file contains only a placeholder password and can be used to check the Compose syntax:

```powershell
docker compose --env-file .env.example config --quiet
```

For normal builds and starts, configure `.env` as described above, then use `docker compose up --build -d`.
