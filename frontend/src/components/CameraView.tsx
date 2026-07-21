import { useEffect, useRef, useState } from 'react'
import StatusBadge from './StatusBadge'

function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraState, setCameraState] = useState<'loading' | 'active' | 'unavailable'>('loading')

  useEffect(() => {
    let stream: MediaStream | undefined

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraState('active')
      } catch {
        setCameraState('unavailable')
      }
    }

    void startCamera()

    return () => stream?.getTracks().forEach((track) => track.stop())
  }, [])

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="font-semibold text-white">Camera preview</h2>
          <p className="mt-0.5 text-sm text-slate-400">Your video is processed locally before analysis is available.</p>
        </div>
        <StatusBadge
          label={cameraState === 'active' ? 'Camera active' : cameraState === 'loading' ? 'Connecting camera' : 'Camera unavailable'}
          tone={cameraState === 'active' ? 'success' : cameraState === 'loading' ? 'info' : 'warning'}
        />
      </div>
      <div className="relative aspect-video bg-slate-900">
        <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" aria-label="Live camera preview" />
        {cameraState !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 px-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-slate-800 text-slate-300">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 fill-none stroke-current stroke-2"><path d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="m16 10 4-2v8l-4-2" /></svg>
            </div>
            <p className="font-medium text-white">{cameraState === 'loading' ? 'Requesting camera access…' : 'Camera access is required to continue monitoring.'}</p>
            {cameraState === 'unavailable' && <p className="mt-1 text-sm text-slate-400">Allow camera permission in your browser, then refresh this page.</p>}
          </div>
        )}
      </div>
    </section>
  )
}

export default CameraView
