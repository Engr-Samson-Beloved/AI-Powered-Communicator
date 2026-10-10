'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

function Orb() {
  const mesh = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = clock.elapsedTime * 0.12
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.08
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.018
    mesh.current.scale.setScalar(pulse)
  })

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.35, 5]} />
        <meshPhysicalMaterial color="#c4df8d" roughness={0.16} metalness={0.12} transmission={0.62} thickness={1.2} ior={1.25} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh scale={1.52}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#c4df8d" wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  )
}

export function SpeechOrb() {
  return (
    <div className="speech-orb-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 36 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.4} />
        <pointLight position={[3, 3, 4]} intensity={24} color="#eff3e5" />
        <pointLight position={[-4, -2, 1]} intensity={16} color="#a4be80" />
        <Orb />
      </Canvas>
    </div>
  )
}
