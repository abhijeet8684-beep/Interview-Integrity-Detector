/** Types that mirror the existing FastAPI API contract. */

export interface RootResponse {
  application: string
  version: string
  status: string
}

export interface HealthResponse {
  backend: string
  camera: string
  model: string
  uptime: string
}

export interface AnalyzeRequest {
  frame_id: number
  timestamp: string
  image: string
}

export interface SignalStatus {
  camera: string
  face_detection: string
  eye_tracking: string
  head_pose: string
  attention: string
}

export interface AnalyzeResponse {
  risk_score: number
  status: string
  signals: SignalStatus
  face_position: string
  face_distance: string
  recommendation: string
}
