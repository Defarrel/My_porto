import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { planet, planetPos, target, type Pose } from './scrollState'

const vertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vPos = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const noise = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 7; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`

// K2-18b as a hycean world: mostly deep ocean, a few green islands,
// drifting clouds, sun glint on the water and a soft blue rim.
const planetFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSunDir;
  uniform vec3 uDeep, uShallow, uLand, uLand2, uAtmo;
  varying vec3 vPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  ${noise}
  void main() {
    vec3 n = normalize(vWorldNormal);
    float h = fbm(vPos * 2.6 + 3.7) + (fbm(vPos * 11.0) - 0.5) * 0.14;
    float land = smoothstep(0.555, 0.559, h); // crisp coastline
    float d = smoothstep(0.3, 0.555, h);
    vec3 ocean = mix(uDeep, uShallow, d * d);
    ocean = mix(ocean, uShallow * 1.25, smoothstep(0.535, 0.555, h) * 0.7); // shallow reef band

    float g = fbm(vPos * 16.0);
    vec3 ground = mix(uLand, uLand2, g);
    ground = mix(ground, vec3(0.42, 0.38, 0.28), smoothstep(0.64, 0.72, h)); // highlands
    vec3 col = mix(ocean, ground, land);
    // fake terrain relief on land
    vec3 bn = normalize(n + (vec3(g, fbm(vPos * 16.0 + 5.1), fbm(vPos * 16.0 + 9.7)) - 0.5) * 0.6 * land);

    vec3 drift = vec3(uTime * 0.025, 0.0, uTime * 0.01);
    float c = fbm(vPos * 3.0 + drift) + (fbm(vPos * 13.0 + drift * 2.0) - 0.5) * 0.3;
    float clouds = smoothstep(0.56, 0.68, c);
    col = mix(col, vec3(0.92, 0.96, 1.0), clouds * 0.85);

    float ndl = dot(mix(bn, n, clouds), uSunDir);
    float light = smoothstep(-0.12, 0.6, ndl);
    col *= light * 1.05; // night side ~black, so the eclipse is a dark disc

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float glint = pow(max(dot(reflect(-uSunDir, n), viewDir), 0.0), 220.0);
    col += vec3(0.8, 0.92, 1.0) * glint * (1.0 - land) * (1.0 - clouds) * step(0.0, ndl) * 1.5;

    // rim only where sunlit; >1 so only the limb blooms, not the surface
    float fres = pow(1.0 - max(dot(viewDir, n), 0.0), 4.0);
    col += uAtmo * fres * light * 1.8;
    gl_FragColor = vec4(col, 1.0);
  }
`

// Back-faced shell around the planet: glows on the lit limb, and all
// the way round when the sun is behind (eclipse).
const atmoFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uAtmo;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float falloff = pow(max(-dot(n, viewDir), 0.0), 2.2);
    vec3 screenN = normalize(n - viewDir * dot(n, viewDir));
    float side = smoothstep(-0.6, 1.0, dot(screenN, uSunDir));
    float backlit = pow(max(dot(uSunDir, -viewDir), 0.0), 3.0);
    float glow = falloff * (side * 1.8 + backlit * 4.5);
    gl_FragColor = vec4(uAtmo * glow, glow);
  }
`

const KEYS: (keyof Pose)[] = ['x', 'y', 'scale', 'sun', 'spin', 'orbit', 'tilt']

export function Planet() {
  const group = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Mesh>(null!)
  const size = useThree((s) => s.size)
  const reduceMotion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0, 0, 1) },
      uDeep: { value: new THREE.Color('#06245c') },
      uShallow: { value: new THREE.Color('#1c8fd1') },
      uLand: { value: new THREE.Color('#1f6b3a') },
      uLand2: { value: new THREE.Color('#5fae55') },
      uAtmo: { value: new THREE.Color('#4cb8ff') },
    }),
    [],
  )

  useFrame((state, dt) => {
    // Ease toward the scroll target instead of jumping to it.
    for (const k of KEYS) planet[k] = reduceMotion ? target[k] : THREE.MathUtils.damp(planet[k], target[k], 3, dt)

    // On narrow screens keep the planet closer to the centre and a bit smaller.
    const k = Math.min(1, size.width / size.height / 1.5)
    group.current.position.set(planet.x * k, planet.y - (1 - planet.intro) * 2.5, 0)
    planetPos.copy(group.current.position)
    group.current.scale.setScalar(planet.scale * (0.7 + 0.3 * k))
    body.current.rotation.y = planet.spin + (reduceMotion ? 0 : state.clock.elapsedTime * 0.04)
    uniforms.uTime.value += reduceMotion ? 0 : dt
    uniforms.uSunDir.value.set(Math.sin(planet.sun), 0.25, Math.cos(planet.sun)).normalize()
  })

  return (
    <group ref={group} rotation={[0, 0, 0.35]}>
      <mesh ref={body}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial vertexShader={vertex} fragmentShader={planetFragment} uniforms={uniforms} />
      </mesh>
      <mesh scale={1.22}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={atmoFragment}
          uniforms={uniforms}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
