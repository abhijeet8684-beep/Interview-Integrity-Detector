# Interview Integrity Detector Backend

FastAPI backend for the Interview Integrity Detector. It accepts Base64 JPEG frames captured by the browser and uses Google MediaPipe Face Detection to return the existing monitoring response contract. It never opens a local webcam. It does not include face recognition, eye tracking, head-pose estimation, or AI risk scoring.

## Project structure

```text
backend/
├── app/
│   ├── api/routes.py              HTTP endpoints
│   ├── models/                    Pydantic request and response schemas
│   ├── services/                  Monitoring orchestration and rule engine
│   ├── utils/logger.py            Logging configuration
│   ├── vision/frame_decoder.py    Base64 JPEG browser-frame decoder
│   ├── vision/face_detector.py    MediaPipe face-count adapter
│   ├── config.py                  Application settings and future model paths
│   └── main.py                    FastAPI application setup
├── requirements.txt
└── README.md
```

## Installation

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run locally

```powershell
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` for interactive API documentation.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/` | Application name, version, and running status |
| GET | `/health` | Placeholder backend and dependency health state |
| POST | `/analyze` | Analyzes one Base64 JPEG browser frame and returns dynamic face-monitoring data |

Example request:

```json
{
  "frame_id": 1,
  "timestamp": "2026-07-21T12:00:00Z",
  "image": "base64-encoded-jpeg-data"
}
```

The CORS configuration allows the React development application at `http://localhost:5173`.

## Browser-frame behavior

The browser is the only camera owner. The frontend downsizes each preview frame to a maximum of approximately 640×480, encodes it as JPEG at 78% quality, and sends its Base64 content with `/analyze`. The backend never calls `cv2.VideoCapture()`.

Implemented face states are `No Face`, `One Face Detected`, and `Multiple Faces`. Eye tracking, head pose, and attention intentionally remain `Pending`.

## Future roadmap

1. Add authenticated session management.
2. Connect the React frontend through versioned API contracts.
3. Add real signal-processing modules behind the existing service interfaces.
4. Add persistent storage, observability, and deployment configuration.

Any future monitoring implementation must retain human review as the final decision point.
