'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Shield, Sparkles, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (username: string) => void
}

export function VoiceAuthModal({ isOpen, onClose, onSuccess }: VoiceAuthModalProps) {
  const [authMode, setAuthMode] = useState<'enroll' | 'verify'>('verify')
  const [isRecording, setIsRecording] = useState(false)
  const [enrollStep, setEnrollStep] = useState(1) // 1, 2, 3 voice samples
  const [statusText, setStatusText] = useState('Click mic and say the passphrase')
  const [processingState, setProcessingState] = useState<'idle' | 'recording' | 'analyzing' | 'complete' | 'error'>('idle')
  const [username, setUsername] = useState('Guest Speaker')
  const [confidence, setConfidence] = useState<number | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const PASSPHRASE = "My voice is my password, verify my access on VoicePath"

  // Clean up audio
  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      setIsRecording(true)
      setProcessingState('recording')
      setStatusText('Listening to voiceprint cadence...')
      drawOscilloscope()
    } catch (err) {
      console.error('Microphone access denied:', err)
      // Fallback for visual mock animation if mic blocked
      setIsRecording(true)
      setProcessingState('recording')
      setStatusText('Simulating mic input (Permission blocked)...')
      drawMockWave()
    }
  }

  const stopAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsRecording(false)
  }

  const drawOscilloscope = () => {
    const canvas = canvasRef.current
    if (!canvas || !analyserRef.current) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording || !analyserRef.current) return
      animationRef.current = requestAnimationFrame(draw)

      analyserRef.current.getByteTimeDomainData(dataArray)

      ctx.fillStyle = 'rgba(10, 10, 20, 0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 3
      // Gradient line
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, 'oklch(0.75 0.18 200)') // Cyan
      gradient.addColorStop(0.5, 'oklch(0.6 0.22 262)') // Blue
      gradient.addColorStop(1, 'oklch(0.6 0.22 295)') // Purple
      ctx.strokeStyle = gradient

      ctx.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()
  }

  const drawMockWave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let phase = 0
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      ctx.fillStyle = 'rgba(10, 10, 20, 0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 3
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, 'oklch(0.75 0.18 200)')
      gradient.addColorStop(0.5, 'oklch(0.6 0.22 262)')
      gradient.addColorStop(1, 'oklch(0.6 0.22 295)')
      ctx.strokeStyle = gradient

      ctx.beginPath()
      const segments = 100
      const width = canvas.width
      const height = canvas.height

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width
        const progress = i / segments
        // Bell curve envelope to pinch the ends
        const envelope = Math.sin(progress * Math.PI)
        const y = (height / 2) + Math.sin(progress * 12 + phase) * 25 * envelope * (Math.random() * 0.4 + 0.8)
        
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      phase += 0.15
    }
    draw()
  }

  const handleMicClick = () => {
    if (isRecording) {
      // Trigger evaluation
      stopAudio()
      evaluateVoice()
    } else {
      startAudio()
    }
  }

  const evaluateVoice = () => {
    setProcessingState('analyzing')
    setStatusText('Extracting spectral resonance features...')
    
    // Simulate feature extraction processing sequence
    setTimeout(() => {
      setStatusText('Mapping formant tracks (F1, F2, F3)...')
      setTimeout(() => {
        setStatusText('Aligning Mel-Frequency Cepstral Coefficients (MFCCs)...')
        setTimeout(() => {
          if (authMode === 'enroll') {
            if (enrollStep < 3) {
              setEnrollStep(prev => prev + 1)
              setProcessingState('idle')
              setStatusText(`Voice Sample ${enrollStep} stored. Say passphrase again.`)
            } else {
              setProcessingState('complete')
              setStatusText('Voiceprint lock established successfully!')
              setTimeout(() => {
                onSuccess(username)
                onClose()
              }, 1500)
            }
          } else {
            // Verify mode
            const generatedConfidence = Math.floor(Math.random() * 8) + 91 // 91% - 98%
            setConfidence(generatedConfidence)
            if (generatedConfidence >= 88) {
              setProcessingState('complete')
              setStatusText(`Voice Signature Match: ${generatedConfidence}% (Confidence High)`)
              setTimeout(() => {
                onSuccess(username)
                onClose()
              }, 1500)
            } else {
              setProcessingState('error')
              setStatusText('Authentication mismatch. Please try again.')
            }
          }
        }, 1000)
      }, 1000)
    }, 1000)
  }

  const resetAuth = () => {
    setProcessingState('idle')
    setEnrollStep(1)
    setConfidence(null)
    setStatusText('Click mic and say the passphrase')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg overflow-hidden glass rounded-3xl p-8"
        style={{
          boxShadow: '0 20px 50px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.5 0.1 250 / 0.2)',
          backgroundImage: 'radial-gradient(circle at top right, oklch(0.6 0.22 262 / 0.08), transparent 50%)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 gradient-badge rounded-full mb-2">
            <Shield className="h-3.5 w-3.5" style={{ color: 'oklch(0.75 0.18 200)' }} />
            <span className="text-xs font-semibold text-white/90">Biometric Identity Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {authMode === 'enroll' ? 'Enroll Speech Signature' : 'Verify Voice ID'}
          </h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.02 250)' }}>
            {authMode === 'enroll' 
              ? 'Establish your secure cryptographic voice key' 
              : 'Unlock your clinical profile and voice tests'}
          </p>
        </div>

        {/* Content Box */}
        <div className="space-y-6">
          {/* Form fields for enrollment */}
          {authMode === 'enroll' && processingState === 'idle' && enrollStep === 1 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 block">Your Name / Persona ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm"
                placeholder="Enter speaker name..."
              />
            </div>
          )}

          {/* Passphrase Display */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="absolute top-2 left-3 text-[10px] uppercase font-bold text-white/30 tracking-wider">Passphrase to speak</div>
            <p className="text-base md:text-lg font-medium text-white italic mt-2">
              "{PASSPHRASE}"
            </p>
          </div>

          {/* Canvas Waveform */}
          <div className="relative h-28 w-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} width={420} height={112} className="w-full h-full" />
            
            {/* Status overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="text-xs font-medium text-white/80 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                {statusText}
              </span>
            </div>

            {/* Micro-loader */}
            {processingState === 'analyzing' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xs">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-7 w-7 text-primary animate-spin" style={{ color: 'oklch(0.75 0.18 200)' }} />
                  <span className="text-xs font-semibold text-white/90 animate-pulse">{statusText}</span>
                </div>
              </div>
            )}
            
            {processingState === 'complete' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xs">
                <div className="flex flex-col items-center gap-2 text-emerald-400">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-xs font-semibold">{statusText}</span>
                </div>
              </div>
            )}

            {processingState === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xs">
                <div className="flex flex-col items-center gap-2 text-rose-400">
                  <AlertCircle className="h-8 w-8" />
                  <span className="text-xs font-semibold">{statusText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Record Button & Steps */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Record halo pulse */}
              {isRecording && (
                <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping pointer-events-none" style={{ backgroundColor: 'oklch(0.6 0.22 262 / 0.15)' }} />
              )}
              
              <button
                onClick={handleMicClick}
                disabled={processingState === 'analyzing' || processingState === 'complete'}
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
                  isRecording 
                    ? 'bg-rose-500 hover:bg-rose-600 scale-105' 
                    : 'bg-primary hover:bg-primary/90 hover:scale-105'
                }`}
                style={{
                  background: isRecording 
                    ? 'linear-gradient(135deg, oklch(0.65 0.25 25), oklch(0.55 0.24 15))'
                    : 'linear-gradient(135deg, oklch(0.6 0.22 262), oklch(0.75 0.18 200))',
                  boxShadow: isRecording
                    ? '0 0 25px oklch(0.6 0.24 25 / 0.4)'
                    : '0 0 25px oklch(0.6 0.22 262 / 0.4)'
                }}
              >
                {isRecording ? (
                  <div className="w-5 h-5 rounded-xs bg-white animate-pulse" />
                ) : (
                  <Mic className="h-7 w-7" />
                )}
              </button>
            </div>
            
            <span className="text-xs text-white/50">
              {isRecording ? 'Tap mic to submit verification' : 'Tap mic to start speaking'}
            </span>
          </div>

          {/* Multi-step progress visual for enrollment */}
          {authMode === 'enroll' && (
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    enrollStep > step
                      ? 'w-10 bg-emerald-500'
                      : enrollStep === step
                      ? 'w-10 bg-primary animate-pulse'
                      : 'w-4 bg-white/10'
                  }`}
                  style={{
                    backgroundColor: enrollStep > step 
                      ? 'oklch(0.65 0.2 150)' 
                      : enrollStep === step 
                      ? 'oklch(0.75 0.18 200)' 
                      : undefined
                  }}
                />
              ))}
            </div>
          )}

          {/* Toggle Modes */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <button
              onClick={() => {
                setAuthMode(authMode === 'verify' ? 'enroll' : 'verify')
                resetAuth()
              }}
              className="text-xs font-semibold text-primary hover:underline"
              style={{ color: 'oklch(0.75 0.18 200)' }}
            >
              {authMode === 'verify' ? 'Create new voice profile' : 'Use existing voice profile'}
            </button>
            
            {processingState !== 'idle' && (
              <button
                onClick={resetAuth}
                className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
