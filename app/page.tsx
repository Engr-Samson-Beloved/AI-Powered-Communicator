'use client'

import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SplineSceneBasic } from '@/components/spline-scene-basic'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { ProductVision } from '@/components/ProductVision'
import { VoiceAuthModal } from '@/components/VoiceAuthModal'
import { SpeechTestingSuite } from '@/components/SpeechTestingSuite'
import { ClinicalDashboard } from '@/components/ClinicalDashboard'
import { ConsultationCabin } from '@/components/ConsultationCabin'

export default function Home() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'test-suite' | 'call-cabin'>('landing')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('Guest Speaker')
  const prefersReducedMotion = useReducedMotion()

  // Clinical profile state
  const [clinicalScores, setClinicalScores] = useState({
    articulation: 78,
    fluency: 82,
    resonance: 71,
    breath: 65
  })
  
  const [recommendations, setRecommendations] = useState<string[]>([
    "Complete initial baseline speech tests to profile phonetic parameters.",
    "Schedule your introductory consultation with Dr. Evelyn to configure voice targets.",
    "Practice sustained vowel articulation drills for 5 minutes daily."
  ])

  const handleAuthSuccess = (name: string) => {
    setUsername(name || 'Speaker')
    setIsAuthenticated(true)
    setView('dashboard')
  }

  const handleTestComplete = (results: {
    articulation: number
    fluency: number
    resonance: number
    breath: number
    recommendations: string[]
  }) => {
    setClinicalScores({
      articulation: results.articulation,
      fluency: results.fluency,
      resonance: results.resonance,
      breath: results.breath
    })
    setRecommendations(results.recommendations)
    setView('dashboard')
  }

  const handleCabinComplete = (stats: {
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
  }) => {
    // Incrementally adjust scores and update recommendations based on SOAP note plan
    setClinicalScores({
      articulation: Math.min(100, Math.round((clinicalScores.articulation + stats.articulation) / 2)),
      fluency: Math.min(100, Math.round((clinicalScores.fluency + stats.fluency) / 2)),
      resonance: Math.min(100, Math.round((clinicalScores.resonance + stats.resonance) / 2)),
      breath: Math.min(100, Math.round((clinicalScores.breath + stats.breath) / 2))
    })
    
    setRecommendations([
      stats.soapNote.plan,
      "Observe controlled diaphragmatic spacing during daily activities.",
      "Track your conversational tempo in low-stress public environments."
    ])
    setView('dashboard')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('Guest Speaker')
    setView('landing')
  }

  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* ── Navigation Bar ─────────────────────────────────── */}
      <SiteHeader
        landing={view === 'landing'}
        authenticated={isAuthenticated}
        username={username}
        onHome={() => setView(isAuthenticated ? 'dashboard' : 'landing')}
        onStart={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* ── Main View Switcher ─────────────────────────────── */}
      <div className={`${view === 'landing' ? 'pt-20' : 'pt-28'} pb-16 px-4 md:px-8 relative z-10`}>
        {view === 'landing' && (
          <section className="relative min-h-[calc(100vh-120px)] overflow-hidden">
            <SplineSceneBasic>
              <div className="hero-copy animate-fade-up -translate-y-[5vh] space-y-8">
                
                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="hero-title text-white">
                    Find your<br />
                    <span>own rhythm.</span>
                  </h1>
                  <p className="hero-description max-w-md text-base leading-relaxed">
                    A calmer way to practice speaking. Work on clarity, pacing, and breath, one conversation at a time.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row animate-fade-up delay-200">
                  <Button
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hero-start rounded-xl gap-2 font-medium cursor-pointer"
                  >
                    Begin with your voice
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SplineSceneBasic>

            <section id="how-it-works" className="how-it-works mx-auto max-w-6xl px-2 pb-8 pt-16 md:px-6 md:pt-24" aria-labelledby="how-it-works-title">
              <div className="mb-12 max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/70">A simple way to begin</p>
                <h2 id="how-it-works-title" className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  Practice, one step at a time.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 md:text-base">
                  Start with a short voice check, follow a guided prompt, then use your feedback to choose what to practice next.
                </p>
              </div>

              <div className="how-steps relative grid gap-5 md:grid-cols-3">
                {[
                  {
                    number: '01',
                    title: 'Choose a practice',
                    description: 'Pick clarity, fluency, or voice support. Each activity gives you a clear place to start.',
                    visual: 'voice-check',
                  },
                  {
                    number: '02',
                    title: 'Speak at your pace',
                    description: 'Follow a word, reading passage, or sustained sound prompt in a focused session.',
                    visual: 'speech-prompt',
                  },
                  {
                    number: '03',
                    title: 'See what comes next',
                    description: 'Review your practice feedback and return to your roadmap for another small step.',
                    visual: 'progress-note',
                  },
                ].map((step, index) => (
                  <motion.article
                    key={step.number}
                    className="how-step glass-card p-5 md:p-6"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
                  >
                    <div className={`how-step-visual ${step.visual}`} aria-hidden="true">
                      {index === 0 && (
                        <>
                          <div className="mini-window-top"><span /><span /><span /><b>VOICE CHECK</b></div>
                          <div className="mini-check-row"><i>◌</i><span>Articulation</span><b>Start</b></div>
                          <div className="mini-check-row muted"><i>◌</i><span>Fluency</span><b>02</b></div>
                          <div className="mini-check-row muted"><i>◌</i><span>Voice</span><b>03</b></div>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <span className="prompt-caption">SAY THIS WORD</span>
                          <strong className="prompt-word">buttercup</strong>
                          <div className="mini-wave" aria-hidden="true">
                            {Array.from({ length: 27 }, (_, bar) => <i key={bar} style={{ height: `${8 + ((bar * 7) % 22)}px`, animationDelay: `${bar * -0.07}s` }} />)}
                          </div>
                          <span className="prompt-status"><i /> Listening when you’re ready</span>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <div className="progress-orbit"><span>3</span><small>MIN</small></div>
                          <div className="progress-copy"><b>Your next step</b><span>Try a short clarity drill</span><i><em /></i></div>
                        </>
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="how-step-number">{step.number}</span>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/55">{step.description}</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <ProductVision onBegin={() => setIsAuthModalOpen(true)} />
          </section>
        )}

        {view === 'dashboard' && (
          <ClinicalDashboard
            username={username}
            scores={clinicalScores}
            recommendations={recommendations}
            onStartTest={() => setView('test-suite')}
            onEnterCabin={() => setView('call-cabin')}
            onLogout={handleLogout}
          />
        )}

        {view === 'test-suite' && (
          <SpeechTestingSuite
            onBack={() => setView('dashboard')}
            onComplete={handleTestComplete}
          />
        )}

        {view === 'call-cabin' && (
          <ConsultationCabin
            username={username}
            onEndSession={handleCabinComplete}
          />
        )}
      </div>

      {/* ── Ambient Backgrounds (Dashboard/Assessment Modals) ──────────────── */}
      {view !== 'landing' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="ambient-orb-blue w-96 h-96 -top-20 left-1/4 opacity-40" />
          <div className="ambient-orb-purple w-80 h-80 top-40 right-1/4 opacity-30" />
          <div className="absolute inset-0 dot-grid opacity-10" />
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-6 mt-12">
        <div className="gradient-divider mb-10" />
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="icon-orb w-8 h-8 rounded-lg">
              <Brain className="h-4 w-4" style={{ color: 'oklch(0.7 0.18 240)' }} />
            </div>
            <span className="text-sm font-semibold text-white">VoicePath AI</span>
          </div>
          <p className="text-xs" style={{ color: 'oklch(0.42 0.02 250)' }}>
            © 2026 VoicePath AI. A space to practice communication.
          </p>
        </div>
      </footer>

      {/* ── Biometric Authentication Modal ─────────────────── */}
      <VoiceAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  )
}
