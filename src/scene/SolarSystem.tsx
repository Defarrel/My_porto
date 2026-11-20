import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { planet, planetPos } from './scrollState'

// The K2-18 system: one orbital plane, concentric orbits round a red dwarf.
// The camera rides with K2-18b, so as scrolling moves it along its orbit
// the star and the other planets swing round it.
const HOME_R = 70 // K2-18b's orbit radius
const BODIES = [
  { r: 10, size: 0.5, speed: 0.05, phase: 1.2, color: '#9c8f86' },
  { r: 18, size: 0.9, speed: 0.032, phase: 3.9, color: '#c98a5a' },
  { r: 30, size: 2.0, speed: 0.02, phase: 5.2, color: '#d9b98a', ring: true },
  { r: 46, size: 0.8, speed: 0.012, phase: 2.4, color: '#9ec9e6' },
].map((b) => ({ ...b, kepler: (HOME_R / b.r) ** 1.5 })) // inner planets sweep faster

function circle(r: number) {
  return Array.from({ length: 257 }, (_, i) => {
    const a = (i / 256) * Math.PI * 2
    return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)
  })
}

export function SolarSystem() {
  const sys = useRef<THREE.Group>(null!)
  const orbits = useRef<THREE.Group[]>([])
  const rings = useMemo(() => BODIES.map((b) => circle(b.r)), [])
  const homeRing = useMemo(() => circle(HOME_R), [])
  const reduceMotion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const home = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    sys.current.rotation.set(planet.tilt, 0, 0)

    // K2-18b sits at angle `orbit` on its ring; place the star so that holds.
    home.set(Math.sin(planet.orbit), 0, Math.cos(planet.orbit)).multiplyScalar(HOME_R).applyEuler(sys.current.rotation)
    sys.current.position.copy(planetPos).sub(home)

    const t = reduceMotion ? 0 : state.clock.elapsedTime
    orbits.current.forEach((o, i) => {
      const b = BODIES[i]
      o.rotation.y = b.phase + t * b.speed + planet.orbit * b.kepler
    })
  })

  return (
    <group ref={sys}>
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        {/* HDR colour (>1) so only the star feeds the bloom */}
        <meshBasicMaterial color={[2.4, 0.75, 0.25]} toneMapped={false} />
      </mesh>
      <pointLight color="#ffb184" intensity={3} decay={0} />

      <Line points={homeRing} color="#6fd0ff" lineWidth={1} transparent opacity={0.22} />
      {BODIES.map((b, i) => (
        <group key={b.r}>
          <Line points={rings[i]} color="#6fd0ff" lineWidth={1} transparent opacity={0.1} />
          <group ref={(g) => { if (g) orbits.current[i] = g }}>
            <group position={[b.r, 0, 0]}>
              <mesh>
                <sphereGeometry args={[b.size, 48, 48]} />
                <meshStandardMaterial color={b.color} roughness={0.9} />
              </mesh>
              {b.ring && (
                <mesh rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
                  <ringGeometry args={[b.size * 1.4, b.size * 2.3, 96]} />
                  <meshStandardMaterial color="#cdb68f" side={THREE.DoubleSide} transparent opacity={0.55} />
                </mesh>
              )}
            </group>
          </group>
        </group>
      ))}
    </group>
  )
}
