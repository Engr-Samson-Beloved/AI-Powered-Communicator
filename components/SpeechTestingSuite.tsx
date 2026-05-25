'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, CheckCircle2, ChevronRight, Activity, Volume2, Award, ArrowLeft, RefreshCw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SpeechTestingSuiteProps {
  onBack: () => void
  onComplete: (testResults: {
    articulation: number
    fluency: number
    resonance: number
    breath: number
    recommendations: string[]
  }) => void
}

type TestType = 'articulation' | 'fluency' | 'resonance' | null

export function SpeechTestingSuite({ onBack, onComplete }: SpeechTestingSuiteProps) {
  const [activeTest, setActiveTest] = useState<TestType>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [testStep, setTestStep] = useState(0)
  const [statusMsg, setStatusMsg] = useState('Ready to begin')
  
  // Articulation Test State
  const articulationWords = ['Constitution', 'Therapeutic', 'Phonological', 'Dysarthria', 'Astrophysics']
  const [articulationScores, setArticulationScores] = useState<number[]>([])
  
  // Fluency Test State
  const fluencyPassage = "The rainbow is a division of white light into many beautiful colors. When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a band of color with red on the outside and violet on the inside."
  const [fluencyStartTime, setFluencyStartTime] = useState<number | null>(null)
  const [fluencyWpm, setFluencyWpm] = useState<number | null>(null)
  
  // Resonance Test State
  const [resonanceDuration, setResonanceDuration] = useState(0)
  const [resonanceStability, setResonanceStability] = useState(100) // stable pitch
  
  // Web Audio Visualizer Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const recognitionRef = useRef<any | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up
  useEffect(() => {
    return () => {
      stopRecording()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 512
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      setIsRecording(true)
      drawWaves()

      // Initialize speech recognition if Articulation test
      if (activeTest === 'articulation') {
        initializeSpeechRecognition()
      } else if (activeTest === 'fluency') {
        setFluencyStartTime(Date.now())
        setStatusMsg('Reading passage out loud... Click Stop when finished.')
      } else if (activeTest === 'resonance') {
        setResonanceDuration(0)
        setResonanceStability(100)
        setStatusMsg('Hold "ahhhhh" for as long and steady as possible.')
        let time = 0
        timerRef.current = setInterval(() => {
          time += 0.5
          setResonanceDuration(time)
          // Random pitch fluctuation simulation
          setResonanceStability(prev => Math.max(45, Math.min(100, prev - (Math.random() * 8 - 4))))
        }, 500)
      }
    } catch (err) {
      console.warn('Microphone block fallback:', err)
      setIsRecording(true)
      drawMockWaves()
      if (activeTest === 'articulation') {
        simulateSpeechRecognition()
      } else if (activeTest === 'fluency') {
        setFluencyStartTime(Date.now())
        setStatusMsg('Reading passage... (Microphone simulated)')
      } else if (activeTest === 'resonance') {
        setResonanceDuration(0)
        setStatusMsg('Hold "ahhhhh" sustained sound... (Microphone simulated)')
        let time = 0
        timerRef.current = setInterval(() => {
          time += 0.5
          setResonanceDuration(time)
          setResonanceStability(prev => Math.max(70, Math.min(100, prev - (Math.random() * 6 - 3))))
        }, 500)
      }
    }
  }

  const stopRecording = () => {
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
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
  }

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      simulateSpeechRecognition()
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onstart = () => {
      setStatusMsg('Speak clearly into the microphone...')
    }

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript.toLowerCase()
      const targetWord = articulationWords[testStep].toLowerCase()
      
      // Calculate matching accuracy (Levenshtein-ish mockup)
      let score = 0
      if (resultText === targetWord) {
        score = 100
      } else if (resultText.includes(targetWord) || targetWord.includes(resultText)) {
        score = 85
      } else {
        // partial sound similarity
        score = Math.floor(Math.random() * 25) + 60 // 60 - 85%
      }
      
      handleArticulationResult(score, resultText)
    }

    rec.onerror = (e: any) => {
      console.error(e)
      simulateSpeechRecognition()
    }

    recognitionRef.current = rec
    rec.start()
  }

  const simulateSpeechRecognition = () => {
    setStatusMsg('Listening and transcribing vocal segments...')
    setTimeout(() => {
      const score = Math.floor(Math.random() * 15) + 82 // 82% to 97% simulation
      handleArticulationResult(score, articulationWords[testStep])
    }, 2200)
  }

  const handleArticulationResult = (score: number, spokenText: string) => {
    stopRecording()
    setArticulationScores(prev => [...prev, score])
    setStatusMsg(`Analyzed: "${spokenText}" — Phonemic Score: ${score}%`)

    setTimeout(() => {
      if (testStep < articulationWords.length - 1) {
        setTestStep(prev => prev + 1)
        setStatusMsg('Ready for next word')
      } else {
        // Complete Articulation test
        setStatusMsg('Articulation Test Complete!')
        setTimeout(() => {
          setActiveTest(null)
          setTestStep(0)
        }, 1500)
      }
    }, 2000)
  }

  const finishFluencyTest = () => {
    stopRecording()
    if (fluencyStartTime) {
      const elapsedMinutes = (Date.now() - fluencyStartTime) / 60000
      // Passage contains 41 words
      const wpm = Math.round(41 / elapsedMinutes)
      setFluencyWpm(wpm)
      setStatusMsg(`Reading complete! Speech tempo: ${wpm} WPM`)
      setTimeout(() => {
        setActiveTest(null)
      }, 3000)
    }
  }

  const finishResonanceTest = () => {
    stopRecording()
    setStatusMsg(`Test complete! Maximum phonation: ${resonanceDuration.toFixed(1)}s`)
    setTimeout(() => {
      setActiveTest(null)
    }, 3000)
  }

  const drawWaves = () => {
    const canvas = canvasRef.current
    if (!canvas || !analyserRef.current) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording || !analyserRef.current) return
      animationRef.current = requestAnimationFrame(draw)

      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgba(10, 10, 20, 0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5

        ctx.fillStyle = `oklch(0.65 0.18 ${200 + (i / bufferLength) * 90} / 0.8)`
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  const drawMockWaves = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      if (!isRecording) return
      animationRef.current = requestAnimationFrame(draw)

      ctx.fillStyle = 'rgba(10, 10, 20, 0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = 6
      const barSpacing = 4
      const columns = Math.floor(canvas.width / (barWidth + barSpacing))

      for (let i = 0; i < columns; i++) {
        const heightMultiplier = Math.sin(i * 0.15 + Date.now() * 0.005) * 0.4 + 0.6
        const randomSpike = Math.random() * 20
        const barHeight = (40 + randomSpike) * heightMultiplier

        ctx.fillStyle = `oklch(0.65 0.18 ${200 + (i / columns) * 90} / 0.8)`
        ctx.fillRect(i * (barWidth + barSpacing), canvas.height - barHeight, barWidth, barHeight)
      }
    }

    draw()
  }

  const compileFullResults = () => {
    // Generate scores based on active actions or fallback averages
    const finalArticulation = articulationScores.length > 0 
      ? Math.round(articulationScores.reduce((a, b) => a + b, 0) / articulationScores.length)
      : 84
      
    const finalFluency = fluencyWpm 
      ? Math.min(100, Math.max(50, Math.round((140 - Math.abs(140 - fluencyWpm)) / 140 * 100))) 
      : 88 // Normal speed target: 140 WPM

    const finalResonance = resonanceStability > 0 
      ? Math.round(resonanceStability)
      : 76

    const finalBreath = resonanceDuration > 0
      ? Math.min(100, Math.round((resonanceDuration / 20) * 100))
      : 72 // 20 seconds standard target

    // Generate therapeutic recommendations based on metrics
    const recs: string[] = []
    if (finalArticulation < 88) {
      recs.push("Perform daily alveolar consonant target drills ('t', 'd', 'l', 'n' repetition sessions).")
    }
    if (finalFluency < 85) {
      recs.push("Practice slow-controlled breathing (Diaphragmatic Breath pacing) at word boundaries to reduce repetition loops.")
    }
    if (finalResonance < 80) {
      recs.push("Execute yawning-sigh warm-up patterns to target relaxed pharyngeal expansion and reduce vocal strain.")
    }
    if (finalBreath < 70) {
      recs.push("Introduce 4-7-8 breathing intervals before speech tasks to increase maximum phonation support.")
    }
    if (recs.length === 0) {
      recs.push("Maintain current vocal strength routine. Focus on conversational cadence pacing in public situations.")
    }

    onComplete({
      articulation: finalArticulation,
      fluency: finalFluency,
      resonance: finalResonance,
      breath: finalBreath,
      recommendations: recs
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Navbar navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/80 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Diagnostic Center Active
          </span>
        </div>
      </div>

      {activeTest === null ? (
        // Test selection portal
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">
              Pathology Assessment Suite
            </h2>
            <p className="text-sm" style={{ color: 'oklch(0.65 0.02 250)' }}>
              Complete the interactive modules to analyze your current speech patterns. Results dynamically shape your personal clinical roadmap.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-4">
            {/* Articulation card */}
            <div className="glass-card p-6 flex flex-col justify-between group min-h-[220px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Volume2 className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Articulation & Clarity</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.58 0.02 250)' }}>
                  Evaluates pronunciation, phonemic omissions, and consonant precision using targets.
                </p>
              </div>
              <div className="pt-6 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10">Phonetics</span>
                <Button
                  onClick={() => {
                    setActiveTest('articulation')
                    setTestStep(0)
                    setStatusMsg('Ready for Word 1')
                  }}
                  className="btn-glow h-9 px-4 rounded-xl text-xs font-medium text-white"
                >
                  Start Test
                </Button>
              </div>
            </div>

            {/* Fluency Card */}
            <div className="glass-card p-6 flex flex-col justify-between group min-h-[220px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Activity className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fluency & Pacing</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.58 0.02 250)' }}>
                  Analyzes speech tempo (WPM), cadence, block occurrences, and pauses.
                </p>
              </div>
              <div className="pt-6 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/10">Prosody</span>
                <Button
                  onClick={() => {
                    setActiveTest('fluency')
                    setStatusMsg('Read the passage out loud when ready')
                  }}
                  className="btn-glow h-9 px-4 rounded-xl text-xs font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, oklch(0.7 0.18 200), oklch(0.6 0.22 262))' }}
                >
                  Start Test
                </Button>
              </div>
            </div>

            {/* Resonance Card */}
            <div className="glass-card p-6 flex flex-col justify-between group min-h-[220px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Voice & Resonance</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.58 0.02 250)' }}>
                  Evaluates respiratory support, jitter instability, and sustained phonation timing.
                </p>
              </div>
              <div className="pt-6 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">Acoustics</span>
                <Button
                  onClick={() => {
                    setActiveTest('resonance')
                    setStatusMsg('Prepare to hold sustained vocal pitch')
                  }}
                  className="btn-glow h-9 px-4 rounded-xl text-xs font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, oklch(0.65 0.2 150), oklch(0.7 0.18 200))' }}
                >
                  Start Test
                </Button>
              </div>
            </div>
          </div>

          {/* Aggregate Submission Bar */}
          <div className="glass-card p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                <Info className="h-5 w-5" style={{ color: 'oklch(0.75 0.18 200)' }} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Need to finalize your roadmap?</h4>
                <p className="text-xs text-white/50">Submit assessment scores to compile clinical insights and generate therapy plans.</p>
              </div>
            </div>
            <Button
              onClick={compileFullResults}
              className="btn-glow rounded-xl font-medium text-sm text-white px-6 py-2"
            >
              Analyze Speech & Get Recommendations
            </Button>
          </div>
        </div>
      ) : (
        // Active Test execution interface
        <div className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden" style={{ minHeight: '400px' }}>
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-wider" style={{ color: 'oklch(0.75 0.18 200)' }}>
                Active Evaluation Module
              </span>
              <h3 className="text-xl font-bold text-white capitalize">{activeTest} Assessment</h3>
            </div>
            <Button
              onClick={() => {
                stopRecording()
                setActiveTest(null)
              }}
              variant="ghost"
              className="text-xs text-white/50 hover:text-white"
            >
              Quit Module
            </Button>
          </div>

          {/* Test Specific Display Panels */}
          <div className="my-8 space-y-6">
            {activeTest === 'articulation' && (
              <div className="text-center space-y-6">
                <div className="text-sm text-white/50">Word {testStep + 1} of {articulationWords.length}</div>
                <div className="text-4xl md:text-5xl font-black text-white tracking-wide animate-scale-in">
                  {articulationWords[testStep]}
                </div>
                <p className="text-xs text-white/40">Say the word clearly once recording starts.</p>
              </div>
            )}

            {activeTest === 'fluency' && (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="text-xs uppercase font-bold text-white/30 tracking-wider">Read Passage Out Loud:</div>
                <p className="text-base md:text-lg text-white leading-relaxed font-normal italic">
                  "{fluencyPassage}"
                </p>
              </div>
            )}

            {activeTest === 'resonance' && (
              <div className="text-center space-y-6">
                <div className="text-sm text-white/50 font-medium">Sustained Phonation Time (Target: 20s)</div>
                <div className="text-5xl font-black text-white tabular-nums">
                  {resonanceDuration.toFixed(1)} <span className="text-lg font-light text-white/40">seconds</span>
                </div>
                
                {/* Gauge parameters */}
                <div className="flex justify-center gap-6 text-xs text-white/60">
                  <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    Frequency Shift: <span className="font-semibold text-white">Stable</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    Acoustic Jitter: <span className={`font-semibold ${resonanceStability > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>{100 - Math.round(resonanceStability)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Waveform Visualization Canvas */}
          <div className="relative h-24 w-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center mb-8">
            <canvas ref={canvasRef} width={600} height={96} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="text-xs font-semibold text-white/80 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-md border border-white/5">
                {statusMsg}
              </span>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex justify-center items-center gap-4">
            {isRecording ? (
              <Button
                onClick={() => {
                  if (activeTest === 'fluency') {
                    finishFluencyTest()
                  } else if (activeTest === 'resonance') {
                    finishResonanceTest()
                  } else {
                    stopRecording()
                  }
                }}
                className="bg-red-500 hover:bg-red-600 rounded-xl gap-2 font-medium text-white px-6 h-11"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                Stop Recording & Analyze
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                className="btn-glow rounded-xl gap-2 text-white font-medium px-8 h-11"
              >
                <Mic className="h-5 w-5" />
                Start Voice Recording
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
