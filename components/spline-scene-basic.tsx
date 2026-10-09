'use client'

import React from "react"
import { SpeechOrb } from '@/components/speech-orb'
import { Spotlight } from '@/components/ui/spotlight'

interface SplineSceneBasicProps {
  children: React.ReactNode
}

export function SplineSceneBasic({ children }: SplineSceneBasicProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: 'oklch(0.07 0.01 250)' }}>

      {/* Ambient background layers */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 20% 50%, oklch(0.5 0.2 262 / 0.1), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 80% 40%, oklch(0.55 0.18 295 / 0.08), transparent 60%)',
        }}
      />

      {/* Spotlights */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="oklch(0.7 0.18 240)"
      />
      <Spotlight
        className="-top-20 right-0 md:right-20"
        fill="oklch(0.65 0.2 295)"
      />

      {/* Dot grid with fade */}
      <div
        className="pointer-events-none absolute inset-0 dot-grid"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      {/* Layout */}
      <div className="flex min-h-screen items-center pt-24">

        {/* Left — text content */}
        <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center p-8 md:p-16 lg:pl-20">
          {children}
        </div>

        {/* Right — Spline 3D */}
        <div className="hidden lg:flex lg:w-1/2 relative h-full min-h-screen items-center">
          {/* Glow behind scene */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 70% at 50% 50%, oklch(0.6 0.22 262 / 0.08), transparent 70%)',
            }}
          />
          <div className="relative flex h-[min(72vh,680px)] w-full items-center justify-center">
            <SpeechOrb />
            <div className="absolute bottom-[13%] left-[9%] glass-float-card animate-float">
              <span className="glass-float-dot" />
              <span><strong>Voice practice</strong><small>Small steps, steady progress</small></span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, oklch(0.07 0.01 250))',
        }}
      />
    </div>
  )
}
