import { Vector3 } from 'three'

// One pose per section. The scroll timeline tweens `target` between these;
// the 3D scene eases `planet` toward `target` every frame, so motion never snaps.
// `orbit` is K2-18b's angle along its orbit round the star (0 = star right behind it: eclipse);
// it only ever increases, so scrolling moves the planet forward along its orbit.
// `tilt` is how far above the orbital plane we look from (higher = star rises out of view).
export type Pose = { x: number; y: number; scale: number; sun: number; spin: number; orbit: number; tilt: number }

export const POSES = {
  hero: { x: 0, y: -1.45, scale: 2.1, sun: -0.8, spin: 0, orbit: -0.42, tilt: 0.3 },
  about: { x: 2.1, y: 0, scale: 1.25, sun: -1.4, spin: 1.4, orbit: -0.28, tilt: 0.3 },
  work: { x: -2.4, y: 0.1, scale: 0.85, sun: 1.1, spin: 2.8, orbit: -0.12, tilt: 0.45 },
  // sun = PI puts the light straight behind the planet; low tilt hides the star behind it: eclipse
  contact: { x: 0, y: 0, scale: 1.35, sun: Math.PI, spin: 4.2, orbit: 0, tilt: 0.17 },
} satisfies Record<string, Pose>

export const target: Pose = { ...POSES.hero }
export const planet = { ...POSES.hero, intro: 0 }
// K2-18b's on-screen position, written by Planet each frame; the solar system hangs off it.
export const planetPos = new Vector3()
