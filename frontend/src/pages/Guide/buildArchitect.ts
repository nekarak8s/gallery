import * as THREE from 'three'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import floorNormImg from '@/assets/textures/granite/Granite_001_NORM.jpg'
import floorAmbientImg from '@/assets/textures/granite/Granite_001_OCC.jpg'

type buildArchitectProps = {
  scene: THREE.Scene
  loadingManager: THREE.LoadingManager
}

export function buildArchitect(props: buildArchitectProps) {
  // Loaders
  const textureLoader = new THREE.TextureLoader(props.loadingManager)

  // Light
  const ambientLight = new THREE.AmbientLight(0x676767)
  props.scene.add(ambientLight)

  const directLight = new THREE.DirectionalLight('white', 1)
  directLight.position.set(0, 110, -110)
  directLight.shadow.camera.left = -60
  directLight.shadow.camera.right = 60
  directLight.shadow.camera.top = 60
  directLight.shadow.camera.bottom = -100
  directLight.castShadow = true
  props.scene.add(directLight)

  // Floor
  const floorGeometry = new THREE.BoxGeometry(50, 50, 50)

  const floorBaseTex = textureLoader.load(floorBaseImg)
  floorBaseTex.wrapS = THREE.RepeatWrapping
  floorBaseTex.wrapT = THREE.RepeatWrapping
  floorBaseTex.repeat.x = 10
  floorBaseTex.repeat.y = 10
  const floorAmbientTex = textureLoader.load(floorAmbientImg)
  floorAmbientTex.wrapS = THREE.RepeatWrapping
  floorAmbientTex.wrapT = THREE.RepeatWrapping
  floorAmbientTex.repeat.x = 10
  floorAmbientTex.repeat.y = 10
  const floorNormTex = textureLoader.load(floorNormImg)
  floorNormTex.wrapS = THREE.RepeatWrapping
  floorNormTex.wrapT = THREE.RepeatWrapping
  floorNormTex.repeat.x = 10
  floorNormTex.repeat.y = 10

  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0xdddddd,
    map: floorBaseTex,
    normalMap: floorNormTex,
    aoMap: floorAmbientTex,
  })

  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.set(0, -23, 0)
  floor.castShadow = true
  floor.receiveShadow = true
  floor.name = 'floor'

  props.scene.add(floor)

  return floor
}
