import axios from 'axios'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  HealthResponse,
  RootResponse,
} from '../types/api'

/** Shared Axios client for the existing FastAPI backend. */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 10_000,
})

export async function getApplicationStatus(): Promise<RootResponse> {
  const response = await apiClient.get<RootResponse>('/')
  return response.data
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/health')
  return response.data
}

export async function analyzeFrame(payload: AnalyzeRequest, signal?: AbortSignal): Promise<AnalyzeResponse> {
  const response = await apiClient.post<AnalyzeResponse>('/analyze', payload, { signal })
  return response.data
}
