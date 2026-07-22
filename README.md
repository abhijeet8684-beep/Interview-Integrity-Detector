# Interview Integrity Detector

> Zero-install browser-based interview integrity monitoring system powered by React, FastAPI, and MediaPipe.

Built for the InCruiter Hackathon challenge: **Catch the Invisible AI Cheater**.

## 🎯 Project Overview

Interview Integrity Detector is a prototype for supporting structured review of remote interview sessions. A candidate grants browser-camera permission, and the React application periodically captures a resized JPEG frame from the live preview. The frame is sent to the FastAPI backend, which performs face-count monitoring and returns an explainable risk response to the dashboard.

The system is deliberately browser-owned: the backend never opens a local webcam. It receives Base64-encoded JPEG frames through a REST endpoint, decodes them, uses Google MediaPipe Face Detection to count faces, and applies transparent rule-based scoring. The resulting score is a review signal, not a final decision.

Current monitoring is limited to face presence and face count. It is designed to help a human reviewer notice conditions that may warrant attention, such as a missing face or multiple faces in a frame.

## 🧩 Problem Statement

Remote interviews make it harder to establish consistent interview conditions. Candidates may use a range of tools or receive assistance that is not visible to the reviewer, while interview teams still need a fair, privacy-conscious, and practical review process.

This prototype explores one narrow part of that challenge: browser-based face-presence monitoring with no candidate-side installation. It does **not** claim to directly identify AI interview assistants, and it cannot guarantee detection of every form of suspicious behaviour.

## ✨ Key Features

- Zero-install browser workflow for the interview participant
- Consent-first camera access flow
- Live browser webcam preview
- Browser-captured JPEG frames sent to the backend every five seconds
- Base64 frame transfer over the existing REST API
- Google MediaPipe Face Detection for face counting
- Detection states for no face, one face, and multiple faces
- Transparent rule-based integrity risk score and recommendation
- Responsive reviewer dashboard with monitoring cards, event log, and risk panel
- Loading, backend-error, and retry states in the dashboard
- CORS configuration for the React development server at `http://localhost:5173`

## 🏗️ System Architecture

```text
Browser Camera
      |
      v
React CameraView
      |
      v
Resize frame (max ~640 x 480) + JPEG encode (78% quality)
      |
      v
Base64 image in POST /analyze
      |
      v
FastAPI Backend
      |
      v
Frame Decoder (Base64 JPEG -> OpenCV BGR frame)
      |
      v
MediaPipe Face Detection
      |
      v
Rule-Based Risk Engine
      |
      v
AnalyzeResponse
      |
      v
React Reviewer Dashboard
```

> The backend does not use `cv2.VideoCapture()` and never attempts to access a local webcam. The browser remains the only camera owner.

## 🔄 Detection Workflow

1. The candidate starts an interview and provides camera-monitoring consent.
2. The browser requests webcam permission and displays the local preview.
3. While the interview page is mounted, the frontend captures a current preview frame every five seconds.
4. The frame is downscaled to a maximum of approximately 640×480, JPEG-encoded at 78% quality, and Base64-encoded.
5. The frontend sends `frame_id`, `timestamp`, and `image` to `POST /analyze`.
6. FastAPI decodes the JPEG payload into an OpenCV frame.
7. MediaPipe Face Detection counts faces in that frame.
8. The rule engine maps the face-count state to a risk score, status, and recommendation.
9. The dashboard displays the returned score, signals, and recommendation without changing the response schema.

## 🛠️ Technologies Used

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Routing | React Router |
| API client | Axios |
| Backend | FastAPI, Pydantic, Uvicorn |
| Computer vision | OpenCV, Google MediaPipe Face Detection, NumPy |
| Communication | JSON REST API with Base64 JPEG payloads |
| Containerization | Docker, Docker Compose |

## 📁 Project Structure

```text
Interview-Integrity-Detector/
├── frontend/
│   ├── src/
│   │   ├── api/                 Axios client and endpoint functions
│   │   ├── components/          Reusable dashboard and camera UI
│   │   ├── hooks/               Five-second monitoring polling hook
│   │   ├── pages/               Landing, consent, and interview pages
│   │   └── types/               API contract TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── api/                 FastAPI routes
│   │   ├── models/              Pydantic request and response models
│   │   ├── services/            Monitoring orchestration and risk rules
│   │   ├── utils/               Logging utility
│   │   ├── vision/              Frame decoder and MediaPipe detector
│   │   ├── config.py            Application configuration
│   │   └── main.py              FastAPI application setup
│   ├── requirements.txt
│   └── README.md
├── docs/
├── presentation/
├── screenshots/
├── tests/
├── docker-compose.yml
└── README.md
```

## 🚀 Installation

### Prerequisites

- Node.js 20 or later
- Python 3.11 or later
- A browser with webcam permission support

### Backend setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend is available at `http://localhost:8000`, with interactive OpenAPI documentation at `http://localhost:8000/docs`.

### Frontend setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

### Optional Docker setup

```bash
docker compose up --build
```

This serves the frontend on `http://localhost:5173` and the backend on `http://localhost:8000`.

## 🔌 API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Returns application name, version, and running status. |
| `GET` | `/health` | Returns the current scaffold health payload. |
| `POST` | `/analyze` | Accepts one browser-captured JPEG frame and returns monitoring signals. |

### `POST /analyze`

Request body:

```json
{
  "frame_id": 1,
  "timestamp": "2026-07-22T12:00:00Z",
  "image": "base64-encoded-jpeg-data"
}
```

Response body:

```json
{
  "risk_score": 10,
  "status": "System Ready",
  "signals": {
    "camera": "Active",
    "face_detection": "One Face Detected",
    "eye_tracking": "Pending",
    "head_pose": "Pending",
    "attention": "Pending"
  },
  "recommendation": "Monitoring"
}
```

## 📊 Risk Scoring Logic

The current risk engine is deterministic and face-count based. Scores are clamped between 0 and 100.

| Face detection result | Risk score | Status | Recommendation |
| --- | ---: | --- | --- |
| One Face Detected | 10 | System Ready | Monitoring |
| No Face | 40 | Attention Required | Review Session |
| Multiple Faces | 60 | High Risk | Investigate |

## ✅ Current Capabilities

Today, the project can capture a webcam preview in the browser, package current frames efficiently for REST transfer, and use MediaPipe Face Detection on the server to identify whether there are zero, one, or multiple faces. The dashboard reflects the returned face signal, risk score, status, and recommendation during its five-second polling cycle.

The landing page, consent page, interview monitoring workspace, timer, event log, signal cards, and risk sidebar are all implemented. The browser owns the camera, while the backend processes only the image data it receives.

## 🔮 Future Enhancements

- Eye tracking and gaze estimation
- Head-pose estimation
- Object and phone detection
- Audio behaviour and speech-pattern analysis
- Additional behaviour analytics
- Learned risk-prediction models
- Session persistence, authentication, and reviewer workflows
- Test coverage and production observability

## ⚠️ Limitations

- This is a hackathon prototype, not a complete production integrity platform.
- Current analysis is limited to face presence and face count in individual submitted frames.
- Camera permission is required for browser-frame monitoring.
- The current health endpoint still returns a static scaffold payload.
- A human reviewer should make the final decision using full interview context.
- The system cannot guarantee detection of every cheating method or directly identify AI interview assistants.

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss a proposed change, then submit a focused pull request with clear context and appropriate tests where available.

## 📄 License

MIT License — placeholder. Add a `LICENSE` file before distributing the project.

## 👤 Author

**Abhijeet**  
ME Embedded Systems  
BITS Pilani, Goa Campus  
Hackathon Submission
