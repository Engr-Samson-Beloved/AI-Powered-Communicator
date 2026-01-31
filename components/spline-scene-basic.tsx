'use client'

import React from "react"

import { SplineScene } from '@/components/ui/spline-scene'
import { Spotlight } from '@/components/ui/spotlight'

interface SplineSceneBasicProps {
  children: React.ReactNode
}

export function SplineSceneBasic({ children }: SplineSceneBasicProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex h-screen items-center">
        {/* Left content */}
        <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center p-8 md:p-16">
          {children}
        </div>

        {/* Right content - Spline 3D Scene */}
        <div className="hidden lg:flex lg:w-1/2 relative h-full">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
