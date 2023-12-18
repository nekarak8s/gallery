import { Sky } from './Sky.js'

export function buildSky(scene: THREE.Scene) {
  const sky = new Sky()

  console.log(sky)
  sky.scale.setScalar(10)
  scene.add(sky)

  return sky
}
