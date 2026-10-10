'use client'

import React from "react"
import './hero.css'
import { SpeechOrb } from '@/components/speech-orb'

interface SplineSceneBasicProps {
  children: React.ReactNode
}

export function SplineSceneBasic({ children }: SplineSceneBasicProps) {
  return (
    <div className="communication-hero relative min-h-screen w-full overflow-hidden">

      {/* Quiet technical grid and slowly moving orbit rings keep the backdrop
          dimensional without washing the whole page in gradients. */}
      <div className="pointer-events-none absolute inset-0 hero-pattern" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      {/* Secondary dot texture */}
      <div
        className="pointer-events-none absolute inset-0 dot-grid"
        style={{
          opacity: 0.24,
        }}
      />

      <svg className="hero-waveform" viewBox="0 0 1600 500" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 270 C95 270 95 270 130 270 S165 230 185 270 210 330 230 270 255 185 275 270 300 365 322 270 345 225 365 270 390 310 410 270 430 125 452 270 475 390 498 270 520 235 540 270 560 305 580 270 602 160 622 270 645 350 668 270 690 205 710 270 735 325 755 270 780 100 802 270 825 390 850 270 875 220 898 270 920 310 945 270 968 170 990 270 1015 355 1040 270 1060 220 1080 270 1105 320 1125 270 1150 130 1175 270 1200 380 1225 270 1250 210 1275 270 1300 315 1325 270 1350 170 1375 270 1400 350 1425 270 1450 230 1475 270 1500 300 1525 270 1560 270 1600 270" />
        <path d="M0 270 C120 270 145 250 175 270 S220 305 250 270 300 235 330 270 380 300 410 270 470 245 500 270 560 295 590 270 650 250 680 270 740 290 770 270 830 250 860 270 920 295 950 270 1010 245 1040 270 1100 290 1130 270 1190 250 1220 270 1280 295 1310 270 1380 245 1410 270 1480 290 1510 270 1560 270 1600 270" />
      </svg>

      {/* Layout */}
      <div className="relative flex min-h-screen items-center pt-0">

        {/* Left — text content */}
        <div className="relative z-10 flex w-full flex-col justify-center p-8 md:px-16 md:py-10 lg:w-[68%] lg:pl-20 lg:pt-10">
          {children}
        </div>

        {/* Right — animated speech orb */}
        <div className="absolute right-0 top-[20%] z-0 flex h-[42vh] w-[78%] items-center justify-center lg:inset-y-0 lg:h-auto lg:w-[62%]">
          <div className="relative flex h-full w-full items-center justify-center lg:h-[min(72vh,680px)]">
            <SpeechOrb />
            <div className="absolute bottom-[13%] left-[9%] glass-float-card animate-float">
              <span className="glass-float-dot" />
              <span><strong>Voice practice</strong><small>Small steps, steady progress</small></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
