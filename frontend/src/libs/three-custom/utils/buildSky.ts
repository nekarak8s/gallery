import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

export function buildSky(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  const sky = new Sky()
  sky.scale.setScalar(1000)
  scene.add(sky)

  const skyUniforms = sky.material.uniforms

  skyUniforms['turbidity'].value = 10
  skyUniforms['rayleigh'].value = 2
  skyUniforms['mieCoefficient'].value = 0.005
  skyUniforms['mieDirectionalG'].value = 0.8

  const parameters = {
    elevation: 2,
    azimuth: 180,
  }

  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const sceneEnv = new THREE.Scene()

  let renderTarget

  function updateSun(sky: Sky) {
    const sun = new THREE.Vector3()

    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
    const theta = THREE.MathUtils.degToRad(parameters.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    // sky.material.uniforms['sunPosition'].value.copy(sun)

    // if (renderTarget !== undefined) renderTarget.dispose()

    sceneEnv.add(sky)
    renderTarget = pmremGenerator.fromScene(sceneEnv)
    scene.add(sky)

    scene.environment = renderTarget.texture
  }

  updateSun(sky)

  return sky
}
