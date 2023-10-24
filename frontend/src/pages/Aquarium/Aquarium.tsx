import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import dat from 'dat.gui'

import { WallMesh } from './wallMesh'
import texture from '@/assets/images/home-section-1/ocean.png'

const FLOOR_X = 30,
  FLOOR_Y = 20,
  FLOOR_HEIGHT = 5,
  SURFACE = 2.5

export default function Aquarium() {
  useEffect(() => {
    const canvas = document.querySelector(
      '#aquarium-canvas'
    ) as HTMLCanvasElement
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
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
    camera.position.x = 1
    camera.position.y = 5
    camera.position.z = 15
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
    const textureLoader = new THREE.TextureLoader()
    // 로드 완료, 로드 중, 로드 에러 콜백함수 넣을 수 있음 (참고)
    const floorTexture = textureLoader.load(texture)
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(FLOOR_X, FLOOR_Y),
      new THREE.MeshStandardMaterial({
        color: 'lightgray',
        side: THREE.DoubleSide,
        map: floorTexture,
      })
    )
    floorMesh.rotation.x = -THREE.MathUtils.degToRad(90)
    scene.add(floorMesh)

    // Wall Meshes
    const backWall = new WallMesh(FLOOR_X, FLOOR_HEIGHT, 0.2).getMesh()
    backWall.position.set(0, SURFACE, -FLOOR_Y / 2)

    const leftWall = new WallMesh(FLOOR_Y, FLOOR_HEIGHT, 0.2).getMesh()
    leftWall.rotation.y = -THREE.MathUtils.degToRad(90)
    leftWall.position.set(-FLOOR_X / 2, SURFACE, 0)
    const rightWall = leftWall.clone()
    leftWall.position.x = FLOOR_X / 2
    scene.add(backWall, leftWall, rightWall)

    renderer.render(scene, camera)

    // Dat
    // const gui = new dat.GUI()
    // gui.add(wallMesh.position, 'y', -5, 5, 0.1)
    // gui.add(wallMesh.position, 'x', -5, 5, 0.1)
    // gui.add(wallMesh.position, 'z', -5, 5, 0.1)

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
