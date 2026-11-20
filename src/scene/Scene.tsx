import { Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef } from 'react'
import type { Group } from 'three'
import { Planet } from './Planet'
import { planet } from './scrollState'
import { SolarSystem } from './SolarSystem'

function Starfield() {
  const ref = useRef<Group>(null!)
  // Slow parallax: stars turn a little as you scroll.
  useFrame(() => {
    ref.current.rotation.y = planet.spin * 0.04
    ref.current.rotation.x = planet.spin * 0.015
  })
  return (
    <group ref={ref}>
      <Stars radius={80} depth={60} count={5000} factor={3.5} saturation={0.4} fade speed={0.6} />
    </group>
  )
}

export function Scene() {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      aria-hidden
    >
      <color attach="background" args={['#03060d']} />
      <Starfield />
      <SolarSystem />
      <Planet />
      <EffectComposer multisampling={8}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.9} luminanceSmoothing={0.2} radius={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
