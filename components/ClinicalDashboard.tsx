'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Play, Shield, Calendar, Phone, Activity, Sparkles, UserCheck, MessageSquare, ChevronRight, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClinicalDashboardProps {
  username: string
  scores: {
    articulation: number
    fluency: number
    resonance: number
    breath: number
  }
  recommendations: string[]
  onStartTest: () => void
  onEnterCabin: () => void
  onLogout: () => void
}

export function ClinicalDashboard({
  username,
  scores,
  recommendations,
  onStartTest,
  onEnterCabin,
  onLogout
}: ClinicalDashboardProps) {
  // Metric labels helper
  const stats = [
    { label: 'Articulation', val: scores.articulation, color: 'oklch(0.6 0.22 295)' }, // Purple
    { label: 'Fluency Index', val: scores.fluency, color: 'oklch(0.75 0.18 200)' },  // Cyan
    { label: 'Vocal Resonance', val: scores.resonance, color: 'oklch(0.6 0.22 262)' }, // Blue
    { label: 'Breath Control', val: scores.breath, color: 'oklch(0.65 0.2 150)' }     // Green
  ]

  // Daily exercise deck helper
  const dailyExercises = [
    {
      title: 'Articulation Flex',
      desc: 'Tongue-tip drills and alveolar consonants targeting precision.',
      duration: '5 min',
      difficulty: 'Easy',
      type: 'articulation'
    },
    {
      title: 'Diaphragmatic Flow',
      desc: 'Resonance exercises holding sustained vowel sounds with paced breathing.',
      duration: '10 min',
      difficulty: 'Medium',
      type: 'resonance'
    },
    {
      title: 'Tempo Tracking',
      desc: 'Read passages out loud while matching standard 140 WPM rhythm guidelines.',
      duration: '7 min',
      difficulty: 'Hard',
      type: 'fluency'
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* ── Dashboard Navigation ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="gradient-text-static">{username}</span>
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Voice ID Verified</span>
            </div>
          </div>
          <p className="text-xs text-white/50">Clinical Pathologist ID: <span className="text-white/80">#VP-9824A</span> · Active Care Roadmap</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="text-xs text-white/50 hover:text-white rounded-xl border border-white/5 bg-white/5"
          >
            Lock Profile
          </Button>
          <Button
            onClick={onStartTest}
            className="btn-glow text-xs font-semibold text-white px-5 rounded-xl h-10"
          >
            Take Speech Test
          </Button>
        </div>
      </div>

      {/* ── Main Layout grid ───────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left 2 columns: Clinical metrics & exercises */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Clinical Scorecard */}
          <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" style={{ color: 'oklch(0.75 0.18 200)' }} />
                <h3 className="text-lg font-bold text-white tracking-tight">Diagnostic Metrics</h3>
              </div>
              <span className="text-[10px] text-white/40">Last assessment: Today</span>
            </div>

            {/* Circular score meters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ label, val, color }) => (
                <div key={label} className="flex flex-col items-center text-center space-y-3">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* SVG ring background */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-white/5 fill-transparent"
                        strokeWidth="7"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="fill-transparent transition-all duration-1000 ease-out"
                        strokeWidth="7"
                        stroke={color}
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * val) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-xl font-black text-white tabular-nums">{val}%</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90">{label}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Exercise Plan */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight pl-1">Daily Rehabilitation Tasks</h3>
            <div className="grid gap-4">
              {dailyExercises.map((ex) => (
                <div
                  key={ex.title}
                  className="glass-card p-5 flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-1.5 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{ex.title}</h4>
                      <span className="text-[9px] uppercase font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {ex.difficulty}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/50">{ex.desc}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-white/40 font-medium whitespace-nowrap">{ex.duration}</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                      <Play className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Mentorship recommendation & call schedule */}
        <div className="space-y-6">
          
          {/* Immersive Session cabin card */}
          <div
            className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[280px]"
            style={{
              backgroundImage: 'radial-gradient(ellipse at bottom right, oklch(0.6 0.22 262 / 0.15), transparent 75%)'
            }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary" style={{ color: 'oklch(0.75 0.18 200)' }}>
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Clinical Cabin</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                  1-Hour Pathology Consultation
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Enter an immersive virtual session with Dr. Evelyn. Engage in live, conversational evaluations and speech patterns practice.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Session Scheduled</span>
                </div>
                <span className="font-semibold text-white">Today, 3:30 PM</span>
              </div>

              <Button
                onClick={onEnterCabin}
                className="btn-glow w-full rounded-xl gap-2 font-semibold text-sm text-white py-5 h-11"
              >
                <Phone className="h-4 w-4" />
                Enter Consult Cabin
              </Button>
            </div>
          </div>

          {/* Recommendations checklist */}
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight uppercase border-b border-white/5 pb-3">
              Mentorship Guidelines
            </h3>
            
            <div className="space-y-3.5">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" style={{ backgroundColor: 'oklch(0.75 0.18 200)' }} />
                  <p className="text-xs text-white/70 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
