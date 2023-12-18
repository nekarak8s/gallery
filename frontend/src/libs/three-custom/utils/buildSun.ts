import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Water } from 'three/examples/jsm/objects/Water.js'

/*eslint-disable */
export function buildSun(
  renderer: THREE.WebGLRenderer,
  sky: Sky,
  water: Water,
  scene: THREE.Scene
) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const sun = new THREE.Vector3()

  // Defining the x, y and z value for our 3D Vector
  const theta = Math.PI * (0.49 - 0.5)
  const phi = 2 * Math.PI * (0.205 - 0.5)
  sun.x = Math.cos(phi)
  sun.y = Math.sin(phi) * Math.sin(theta)
  sun.z = Math.sin(phi) * Math.cos(theta)

  sky.material.uniforms['sunPosition'].value.copy(sun)
  water.material.uniforms['sunDirection'].value.copy(sun).normalize()
  console.log(scene)

  return sun
}
