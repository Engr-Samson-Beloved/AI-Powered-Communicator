'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneOff, Mic, MicOff, Volume2, ShieldAlert, Award, BrainCircuit, RefreshCw, Sparkles, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConsultationCabinProps {
  username: string
  onEndSession: (sessionStats: {
    articulation: number
    fluency: number
    resonance: number
    breath: number
    soapNote: {
      subjective: string
      objective: string
      assessment: string
      plan: string
    }
  }) => void
}

interface TranscriptItem {
  sender: 'ai' | 'user'
  text: string
  time: string
}

export function ConsultationCabin({ username, onEndSession }: ConsultationCabinProps) {
  const [callState, setCallState] = useState<'connecting' | 'active' | 'soap-summary'>('connecting')
  const [isMuted, setIsMuted] = useState(false)
  const [aiSpeakingState, setAiSpeakingState] = useState<'idle' | 'speaking' | 'listening'>('idle')
  
  // Real-time acoustic metrics
  const [acousticMetrics, setAcousticMetrics] = useState({
    pitch: 125,
    clarity: 92,
    tempo: 135,
    jitter: 0.12
  })

  // Transcripts list
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    { sender: 'ai', text: `Hello ${username}. I am Dr. Evelyn, your speech partner. Today we will focus on conversational rhythm and articulation. How has your speech clarity felt this week?`, time: '0:05' }
  ])
  const [userSpeechInput, setUserSpeechInput] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const recognitionRef = useRef<any | null>(null)

  // Simulation AI conversation tracks
  const aiResponses = [
    "That is really interesting. Let's practice a breathing drill. Take a deep breath and say: 'The evening breeze was cooling.' Focus on sustained articulation.",
    "Excellent! I noticed a small drop in tongue elevation on the 'l' sound in 'cooling'. Let's isolate the 'l' phoneme: say 'la-la-la-la' four times.",
    "Very consistent. Your pitch jitter was only 0.14%, indicating good laryngeal stability. Now let's try a cadence pacing check. Let's talk about your hobbies. Keep a relaxed tempo.",
    "I appreciate you sharing that. Your speech rate was exactly 132 WPM, which sits in the perfect range for clarity. I think we have made excellent progress today."
  ]
  const responseIndexRef = useRef(0)

  useEffect(() => {
    // Simulate connection phase
    const connTimer = setTimeout(() => {
      setCallState('active')
      setAiSpeakingState('listening')
      startAudioStream()
      initializeRecognition()
    }, 3000)

    return () => {
      clearTimeout(connTimer)
      stopAudioStream()
    }
  }, [])

  const startAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 64
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      drawVoiceOrb()
    } catch (err) {
      console.warn('Microphone stream blocked - falling back to simulated orb pulse')
      drawMockVoiceOrb()
    }
  }

  const stopAudioStream = () => {
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
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const initializeRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const text = result[0].transcript
      if (result.isFinal) {
        addUserMessage(text)
      }
    }

    recognitionRef.current = rec
    rec.start()
  }

  const drawVoiceOrb = () => {
    const canvas = canvasRef.current
    if (!canvas || !analyserRef.current) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (callState !== 'active' || !analyserRef.current) return
      animationRef.current = requestAnimationFrame(draw)

      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate voice energy volume average
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const averageVolume = sum / bufferLength

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      // Determine orb size based on speaking state
      let baseRadius = 60
      if (aiSpeakingState === 'speaking') {
        // AI Speaking gets automatic wave oscillation
        baseRadius = 60 + Math.sin(Date.now() * 0.008) * 15
      } else if (aiSpeakingState === 'listening') {
        // Listening gets mic volume reaction
        baseRadius = 60 + (averageVolume / 255) * 45
      }

      // Draw layered glowing paths
      const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.2, centerX, centerY, baseRadius * 1.5)
      
      // Custom color schemes based on speaking states
      if (aiSpeakingState === 'speaking') {
        gradient.addColorStop(0, 'oklch(0.75 0.18 200 / 0.85)') // Cyan core
        gradient.addColorStop(0.5, 'oklch(0.6 0.22 262 / 0.45)') // Blue body
        gradient.addColorStop(1, 'transparent')
      } else {
        gradient.addColorStop(0, 'oklch(0.6 0.22 262 / 0.85)') // Blue core
        gradient.addColorStop(0.5, 'oklch(0.6 0.22 295 / 0.45)') // Purple body
        gradient.addColorStop(1, 'transparent')
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Draw inner core circle
      ctx.fillStyle = aiSpeakingState === 'speaking' ? 'oklch(0.85 0.1 200)' : 'oklch(0.75 0.18 262)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }

    draw()
  }

  const drawMockVoiceOrb = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      if (callState !== 'active') return
      animationRef.current = requestAnimationFrame(draw)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      const speedFactor = aiSpeakingState === 'speaking' ? 0.012 : 0.005
      const waveOffset = Math.sin(Date.now() * speedFactor) * 12
      const baseRadius = 60 + waveOffset

      const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.2, centerX, centerY, baseRadius * 1.5)
      
      if (aiSpeakingState === 'speaking') {
        gradient.addColorStop(0, 'oklch(0.75 0.18 200 / 0.8)')
        gradient.addColorStop(0.5, 'oklch(0.6 0.22 262 / 0.4)')
        gradient.addColorStop(1, 'transparent')
      } else {
        gradient.addColorStop(0, 'oklch(0.6 0.22 262 / 0.8)')
        gradient.addColorStop(0.5, 'oklch(0.6 0.22 295 / 0.4)')
        gradient.addColorStop(1, 'transparent')
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = aiSpeakingState === 'speaking' ? 'oklch(0.85 0.1 200)' : 'oklch(0.75 0.18 262)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 0.75, 0, Math.PI * 2)
      ctx.fill()
    }

    draw()
  }

  const handleSpeakInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userSpeechInput.trim()) return
    addUserMessage(userSpeechInput)
    setUserSpeechInput('')
  }

  const addUserMessage = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTranscripts(prev => [...prev, { sender: 'user', text, time }])
    setAiSpeakingState('idle')

    // Simulate acoustic markers fluctuation based on speech input
    setAcousticMetrics({
      pitch: Math.floor(Math.random() * 20) + 115, // 115Hz - 135Hz
      clarity: Math.floor(Math.random() * 8) + 89,    // 89% - 97%
      tempo: Math.floor(Math.random() * 25) + 125,   // 125WPM - 150WPM
      jitter: parseFloat((Math.random() * 0.08 + 0.1).toFixed(2))
    })

    // Simulate AI clinical feedback response
    setTimeout(() => {
      setAiSpeakingState('speaking')
      const replyText = aiResponses[responseIndexRef.current % aiResponses.length]
      responseIndexRef.current += 1

      setTranscripts(prev => [...prev, { sender: 'ai', text: replyText, time }])
      
      // AI stops speaking after a simulated duration matching character length
      setTimeout(() => {
        setAiSpeakingState('listening')
      }, replyText.length * 40)
    }, 1800)
  }

  const terminateCall = () => {
    stopAudioStream()
    setCallState('soap-summary')
  }

  const confirmSummaryAndClose = () => {
    // Pass completed diagnostics and clinical note object back to parent
    onEndSession({
      articulation: 91,
      fluency: 94,
      resonance: 82,
      breath: 88,
      soapNote: {
        subjective: `${username} reports progress in managing conversational tempo. Expresses increased clarity in public communication.`,
        objective: "Sustained vowel resonance duration: 16.2 seconds. Articulation accuracy: 91%. Speech rate: 134 words per minute.",
        assessment: "Patient displays solid articulatory control. Phonemic placement is correct. Vocal stability is improving.",
        plan: "Practice isolated 'l' phoneme repetition exercises daily. Schedule second consulting session in 5 days."
      }
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {callState === 'connecting' && (
        <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[480px] space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping" style={{ backgroundColor: 'oklch(0.75 0.18 200 / 0.15)' }} />
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <BrainCircuit className="h-10 w-10 text-primary animate-pulse" style={{ color: 'oklch(0.75 0.18 200)' }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">Establishing Clinical Cabin Tunnel</h3>
            <p className="text-sm" style={{ color: 'oklch(0.65 0.02 250)' }}>Initialising live speech analyzer nodes and model synthesis...</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Connecting to Dr. Evelyn, Clinical SLP...</span>
          </div>
        </div>
      )}

      {callState === 'active' && (
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Visual Call Space: Large Left Panel */}
          <div className="md:col-span-2 glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between min-h-[500px]">
            
            {/* Connection Top strip */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-2.5 h-2.5 rounded-full bg-emerald-500">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dr. Evelyn (AI Pathologist)</h4>
                  <p className="text-[10px] text-white/40 uppercase font-semibold">Active Diagnostics Cabin</p>
                </div>
              </div>
              <span className="text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">00:04:12</span>
            </div>

            {/* Glowing Orb Canvas Space */}
            <div className="flex flex-col items-center justify-center flex-grow py-8 relative">
              <canvas ref={canvasRef} width={280} height={280} className="w-72 h-72 rounded-full" />
              
              <span className="absolute bottom-4 text-xs font-semibold text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/5">
                {aiSpeakingState === 'speaking' ? 'Dr. Evelyn Speaking...' : aiSpeakingState === 'listening' ? 'Listening to voice...' : 'Waiting...'}
              </span>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                className={`rounded-xl border border-white/5 ${isMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-white/5 text-white/80'}`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isMuted ? 'Muted' : 'Mute mic'}
              </Button>

              <Button
                onClick={terminateCall}
                className="bg-rose-500 hover:bg-rose-600 rounded-xl gap-2 font-semibold text-xs text-white px-5"
              >
                <PhoneOff className="h-4 w-4" />
                End Consultation
              </Button>
            </div>
          </div>

          {/* Metrics & Transcripts Right Column */}
          <div className="space-y-6">
            
            {/* Live Acoustical Metrics */}
            <div className="glass p-5 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-white tracking-tight uppercase border-b border-white/5 pb-2">
                Live Speech Profiler
              </h4>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase font-semibold">Pitch Frequency</div>
                  <div className="text-base font-black text-white mt-1">{acousticMetrics.pitch} Hz</div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase font-semibold">Clarity Rating</div>
                  <div className="text-base font-black text-white mt-1">{acousticMetrics.clarity}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase font-semibold">Tempo (WPM)</div>
                  <div className="text-base font-black text-white mt-1">{acousticMetrics.tempo}</div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase font-semibold">Acoustic Jitter</div>
                  <div className="text-base font-black text-white mt-1">{acousticMetrics.jitter}%</div>
                </div>
              </div>
            </div>

            {/* Conversation Log & Text Entry */}
            <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between min-h-[300px]">
              <h4 className="text-xs font-bold text-white tracking-tight uppercase border-b border-white/5 pb-2 mb-3">
                Session Transcript
              </h4>

              {/* Scrollable messages area */}
              <div className="flex-grow overflow-y-auto space-y-3.5 max-h-[220px] pr-2 text-xs">
                {transcripts.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] text-white/30">{msg.sender === 'user' ? username : 'Dr. Evelyn'} · {msg.time}</span>
                    <div
                      className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary/20 text-white border border-primary/10 rounded-tr-none'
                          : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                      }`}
                      style={{
                        backgroundColor: msg.sender === 'user' ? 'oklch(0.6 0.22 262 / 0.15)' : undefined,
                        borderColor: msg.sender === 'user' ? 'oklch(0.6 0.22 262 / 0.2)' : undefined
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Text Input Fallback */}
              <form onSubmit={handleSpeakInputSubmit} className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={userSpeechInput}
                  onChange={(e) => setUserSpeechInput(e.target.value)}
                  className="flex-grow bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  placeholder={aiSpeakingState === 'listening' ? "Speak or type response..." : "Wait for AI to finish speaking..."}
                  disabled={aiSpeakingState === 'speaking'}
                />
                <Button
                  type="submit"
                  disabled={!userSpeechInput.trim() || aiSpeakingState === 'speaking'}
                  className="h-8 rounded-xl text-xs font-semibold px-3 py-1 btn-glow text-white"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {callState === 'soap-summary' && (
        <div className="glass rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Consultation Completed</h3>
              <p className="text-xs text-white/50">Clinical S.O.A.P. Summary Sheet Generated</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary" style={{ color: 'oklch(0.75 0.18 200)' }}>
                [S] Subjective Observations
              </span>
              <p className="text-xs text-white/70 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                {username} reports progress in managing conversational tempo. Expresses increased clarity in public communication.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary" style={{ color: 'oklch(0.75 0.18 200)' }}>
                [O] Objective Diagnostic Data
              </span>
              <p className="text-xs text-white/70 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                Sustained vowel resonance duration: 16.2 seconds. Articulation accuracy: 91%. Speech rate: 134 words per minute.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary" style={{ color: 'oklch(0.75 0.18 200)' }}>
                [A] Clinical Assessment
              </span>
              <p className="text-xs text-white/70 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                Patient displays solid articulatory control. Phonemic placement is correct. Vocal stability is improving.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary" style={{ color: 'oklch(0.75 0.18 200)' }}>
                [P] Therapy Plan & Steps
              </span>
              <p className="text-xs text-white/70 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                Practice isolated 'l' phoneme repetition exercises daily. Schedule second consulting session in 5 days.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end">
            <Button
              onClick={confirmSummaryAndClose}
              className="btn-glow rounded-xl font-semibold text-xs text-white px-6 h-10"
            >
              Sign off SOAP Notes & Sync Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
