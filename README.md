# Interview Integrity Detector

Production-quality foundation for the InCruiter Interview Integrity Challenge.

## Phase 1 status

The repository currently contains only the application scaffold: a React + Vite + TypeScript frontend, a FastAPI backend, documentation and delivery folders, and container configuration. No interview-integrity features have been implemented yet.

## Prerequisites

- Node.js 20 or later (includes npm)
- Python 3.11 or later
- Docker Desktop (optional, for containers)

## Local setup

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Vite serves the frontend at \`http://localhost:5173\`.

### Backend

\`\`\`bash
cd backend
python -m venv .venv
\`\`\`

Activate the virtual environment:

\`\`\`powershell
.\.venv\Scripts\Activate.ps1
\`\`\`

Install dependencies and start the server:

\`\`\`bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
\`\`\`

The API starts at \`http://localhost:8000\`; its OpenAPI documentation is available at \`/docs\`.

## Docker setup

\`\`\`bash
docker compose up --build
\`\`\`

This starts the frontend at \`http://localhost:5173\` and the backend at \`http://localhost:8000\`.

## Repository layout

\`\`\`text
frontend/     React + Vite + TypeScript application
backend/      FastAPI application
docs/         Project documentation
presentation/ Presentation assets
screenshots/  Screenshot assets
tests/        Cross-application tests
\`\`\`

## Next phase

Phase 2 will add the agreed interview-integrity functionality.
