import React, { useEffect } from 'react'
import dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WallMesh } from './wallMesh'
import AquaTexture from '@/assets/images/home-section-1/ocean.png'
import floorTexture from '@/assets/images/home-section-3/white-wall.jpg'

const FLOOR_X = 40,
  FLOOR_Y = 30,
  FLOOR_HEIGHT = 10,
  SURFACE = 5

export default function Aquarium() {
  useEffect(() => {
    const canvas = document.querySelector(
      '#aquarium-canvas'
    ) as HTMLCanvasElement
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      // alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)

    // Scene
    const scene = new THREE.Scene()

    // Camera - Perspective camera
    const camera = new THREE.PerspectiveCamera(
      65, // 시야각
      window.innerWidth / window.innerHeight, // 종횡비
      0.1, // near
      1000 // far
    )
    camera.position.set(3, 45, 30)
    scene.add(camera)

    // Light
    const ambientLight = new THREE.AmbientLight('white', 3)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight('white', 1)
    directionalLight.position.set(1, 0, 2)
    // directionalLight.position.z = 2
    scene.add(directionalLight)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)

    // Floor
    const textureLoader = new THREE.TextureLoader() // Texture loader
    const floorTex = textureLoader.load(floorTexture)
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(FLOOR_X, FLOOR_Y),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: floorTex,
      })
    )
    floorMesh.rotation.x = -THREE.MathUtils.degToRad(90)
    scene.add(floorMesh)

    // Walls
    const backWall = new WallMesh(FLOOR_X, FLOOR_HEIGHT, 0.2).getMesh()
    backWall.position.set(0, SURFACE, -FLOOR_Y / 2)

    const frontWall = new WallMesh(13, FLOOR_HEIGHT, 0.2).getMesh()
    frontWall.position.set(13.6, SURFACE, FLOOR_Y / 2)

    const leftWall = new WallMesh(FLOOR_Y, FLOOR_HEIGHT, 0.2).getMesh()
    leftWall.rotation.y = -THREE.MathUtils.degToRad(90)
    leftWall.position.set(-FLOOR_X / 2, SURFACE, 0)

    const rightWall = leftWall.clone()
    leftWall.position.x = FLOOR_X / 2

    scene.add(frontWall, backWall, leftWall, rightWall)

    // Partitons
    const partition1 = new WallMesh(6, FLOOR_HEIGHT, 0.2).getMesh()
    partition1.position.set(17, SURFACE, 8)

    const partition2 = new WallMesh(15, FLOOR_HEIGHT, 0.2).getMesh()
    partition2.rotation.y = -THREE.MathUtils.degToRad(90)
    partition2.position.set(7.2, SURFACE, 7.5)

    const partition3 = partition1.clone()
    partition3.position.set(10.2, SURFACE, 0.1)

    const partition4 = partition1.clone()
    partition4.rotation.y = -THREE.MathUtils.degToRad(90)
    partition4.position.set(13.1, SURFACE, -2.9)

    const partition5 = new WallMesh(10, FLOOR_HEIGHT, 0.2).getMesh()
    partition5.rotation.y = -THREE.MathUtils.degToRad(90)
    partition5.position.set(-6, SURFACE, -10)

    scene.add(partition1, partition2, partition3, partition4, partition5)

    // Aquarium
    const AquaTex = textureLoader.load(AquaTexture)

    const AquaMesh = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_X - 13 + 0.3, FLOOR_HEIGHT, FLOOR_Y / 3),
      new THREE.MeshStandardMaterial({
        map: AquaTex,
      })
    )
    AquaMesh.position.set(-6.49, FLOOR_HEIGHT / 2, 19.95)

    // Cylindrical Aquarium
    // const cylinAquarium = new THREE.Mesh(
    //   new THREE.CylinderGeometry(3, 3, 20, 32),
    //   new THREE.MeshStandardMaterial({
    //     map: AquaTex,
    //   })
    // )

    scene.add(AquaMesh)

    renderer.render(scene, camera)

    // Dat
    const gui = new dat.GUI()
    gui.add(AquaMesh.position, 'x', -30, 30, 0.01).name('x')
    gui.add(AquaMesh.position, 'z', -30, 30, 0.01).name('z')

    // Draw
    // const clock = new THREE.Clock()
    function draw() {
      // const time = clock.getElapsedTime()

      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)
    }

    // handle window resize
    const handleWindowResize = function resize() {
      camera.aspect = window.innerWidth / window.innerHeight
      // 카메라에 투영된 값에 변화가 있을 경우 실행
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
    }
    window.addEventListener('resize', handleWindowResize)

    draw()
  }, [])

  return <canvas id="aquarium-canvas" />
}
