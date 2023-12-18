import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'
import waterNomals from '@/assets/textures/water/waternormals.jpg'

export function buildWater(scene: THREE.Scene) {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(waterNomals, function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    }),
    alpha: 1.0,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  })
  water.rotation.x = -Math.PI / 2
  scene.add(water)

  const waterUniforms = water.material.uniforms
  return water
}
