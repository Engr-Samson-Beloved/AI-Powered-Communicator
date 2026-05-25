'use client'

import React, { useState } from 'react'
import { SplineSceneBasic } from '@/components/spline-scene-basic'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, MessageSquare, Brain, Sparkles, Shield, Globe, UserCheck, ShieldAlert, Award } from 'lucide-react'
import { VoiceAuthModal } from '@/components/VoiceAuthModal'
import { SpeechTestingSuite } from '@/components/SpeechTestingSuite'
import { ClinicalDashboard } from '@/components/ClinicalDashboard'
import { ConsultationCabin } from '@/components/ConsultationCabin'

export default function Home() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'test-suite' | 'call-cabin'>('landing')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('Guest Speaker')

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
    <main className="min-h-screen overflow-x-hidden relative" style={{ backgroundColor: 'oklch(0.07 0.01 250)' }}>
      
      {/* ── Navigation Bar ─────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-center pt-4 px-4">
        <div className="glass rounded-2xl w-full max-w-5xl px-5 py-3 flex items-center justify-between"
          style={{ boxShadow: '0 8px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.5 0.1 250 / 0.15)' }}>
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => view !== 'landing' && setView('dashboard')}>
            <div className="icon-orb w-9 h-9 rounded-xl" style={{ boxShadow: '0 0 18px oklch(0.6 0.22 262 / 0.5)' }}>
              <Brain className="h-5 w-5" style={{ color: 'oklch(0.7 0.18 240)' }} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              VoicePath <span className="gradient-text-static">AI</span>
            </span>
          </div>

          {/* Dynamic auth badge & link navigation */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <UserCheck className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Voice ID: {username}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-xs text-white/50 hover:text-white rounded-xl border border-white/5"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true)
                }}
                className="btn-glow rounded-xl text-sm font-medium text-white gap-2 h-9 px-4"
              >
                Access Voice ID
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Main View Switcher ─────────────────────────────── */}
      <div className="pt-28 pb-16 px-4 md:px-8 relative z-10">
        {view === 'landing' && (
          <section className="relative min-h-[calc(100vh-120px)] overflow-hidden">
            <SplineSceneBasic>
              <div className="space-y-7 animate-fade-up">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 gradient-badge rounded-full px-4 py-1.5">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: 'oklch(0.72 0.18 240)' }} />
                  <span className="text-xs font-medium tracking-wide" style={{ color: 'oklch(0.75 0.12 240)' }}>
                    Immersive Speech Pathology Partner
                  </span>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold tracking-tight leading-[1.08] md:text-6xl lg:text-7xl text-white">
                    Unlock Your Voice<br />
                    <span className="gradient-text">With AI Pathology</span>
                  </h1>
                  <p className="max-w-md text-base leading-relaxed" style={{ color: 'oklch(0.65 0.02 250)' }}>
                    Practice articulation, pace, and breath control in an immersive workspace. Log in securely using your voiceprint, take diagnostic tests, and enter real-time consultation cabins with expert AI pathologists.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row animate-fade-up delay-200">
                  <Button
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-glow rounded-xl gap-2 text-white font-medium cursor-pointer"
                  >
                    Start Voice Authentication
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SplineSceneBasic>

            {/* Feature Cards Grid (Embedded on Landing) */}
            <div className="mx-auto max-w-6xl mt-20 relative z-20">
              <div className="mb-12 space-y-3 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Intelligent <span className="gradient-text">Speech Recovery Frameworks</span>
                </h2>
                <p className="text-sm max-w-lg mx-auto" style={{ color: 'oklch(0.6 0.02 250)' }}>
                  State-of-the-art pathology tools, fully integrated with real-time acoustic analysis.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    title: 'Biometric Voice Key',
                    desc: 'No passwords required. Authenticate, enroll, and verify your clinical progress files securely using cryptographic voice signature maps.',
                    glow: '262'
                  },
                  {
                    icon: Zap,
                    title: 'Interactive Speech Testing',
                    desc: 'Identify phonemic omissions, rate-of-speech fluctuations, and sustained vowel vocal stability in real-time diagnostic sessions.',
                    glow: '220'
                  },
                  {
                    icon: MessageSquare,
                    title: 'AI Consultation Cabin',
                    desc: 'A full-hour voice consult experience simulating expert therapists. Receive live acoustic coaching adjustments and SOAP reports.',
                    glow: '295'
                  }
                ].map(({ icon: Icon, title, desc, glow }) => (
                  <div key={title} className="glass-card p-6 group">
                    <div className="icon-orb mb-5" style={{ background: `oklch(0.2 0.06 ${glow} / 0.4)`, borderColor: `oklch(0.5 0.15 ${glow} / 0.25)` }}>
                      <Icon className="h-5 w-5" style={{ color: `oklch(0.72 0.18 ${glow})` }} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white tracking-tight">{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.58 0.02 250)' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
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
            © 2026 VoicePath Speech Systems. HIPAA-Compliant Encryption.
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
