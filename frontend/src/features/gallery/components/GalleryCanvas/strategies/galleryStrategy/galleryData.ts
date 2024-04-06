import { degToRad } from 'three/src/math/MathUtils'

export const FLOORS_DATA = [
  {
    x: 20.4,
    y: 2,
    z: 6.09,
    width: 30,
    height: 5,
    depth: 50,
  },
  {
    x: 32.9,
    y: 2,
    z: 56.09,
    width: 5,
    height: 10,
    depth: 10,
  },
]

export const GLASS_FLOORS_DATA = [
  {
    x: 50.4,
    y: 2,
    z: 6.09,
    width: 10,
    height: 0.5,
    depth: 35.4,
  },
]

export const WALL_INFO = {
  depth: 0.3,
}

export const WALLS_DATA = [
  // left top
  {
    x: 20.55,
    y: 2,
    z: 9.17,
    width: 6,
    height: 12,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 20.55,
    y: 2,
    z: 16.18,
    width: 4,
    height: 8,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 20.55,
    y: 11,
    z: 15.17,
    width: 5.01,
    height: 3,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  // right top
  {
    x: 55.4,
    y: -1,
    z: 4.69,
    width: 5,
    height: 11,
    depth: WALL_INFO.depth,
  },
  {
    x: 31.47,
    y: 2,
    z: 11.14,
    width: 10,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 41.27,
    y: 2,
    z: 15.71,
    width: 10,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 31.47,
    y: 7.5,
    z: 11.14,
    width: 10,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 41.27,
    y: 7.5,
    z: 15.71,
    width: 10,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 50.25,
    y: 2,
    z: 19.8,
    width: 8,
    height: 9.5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  // Middle
  {
    x: 32.91,
    y: 2,
    z: 33.19,
    width: 5,
    height: 3,
    depth: WALL_INFO.depth,
  },
  {
    x: 32.4,
    y: 2,
    z: 43.88,
    width: 6,
    height: 5.5,
    depth: WALL_INFO.depth,
  },

  // Sea
  {
    x: 18.06,
    y: -1,
    z: 36.15,
    width: 7,
    height: 10,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 62.98,
    y: -1,
    z: 27.4,
    width: 15.9,
    height: 9,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 54.83,
    y: -1,
    z: 43.15,
    width: 8,
    height: 9,
    depth: WALL_INFO.depth,
  },
  // Entrance
  {
    x: 20.4,
    y: 2,
    z: 55.94,
    width: 12.5,
    height: 8,
    depth: WALL_INFO.depth,
  },
  {
    x: 37.9,
    y: 2,
    z: 55.94,
    width: 12.5,
    height: 8,
    depth: WALL_INFO.depth,
  },
]

export const GLASS_WALL = [
  {
    x: 31.52,
    y: 2,
    z: 11.15,
    width: 20.66,
    height: 9.5,
    depth: 0.2,
    rotationY: degToRad(-25),
  },
]

export const CEILING_DATA = [
  {
    x: 32.4,
    y: 7.5,
    z: 33.03,
    width: 6,
    height: 0.2,
    depth: 11,
  },
]

export const PLANT_DATA = [
  // lef top
  {
    type: 2,
    x: 21.12,
    y: 2,
    z: 9.07,
    rotation: 1,
    scale: 2,
  },
  {
    type: 1,
    x: 21.12,
    y: 2,
    z: 10.41,
    rotation: 0.8,
    scale: 2.1,
  },
  {
    type: 1,
    x: 22,
    y: 2,
    z: 9.97,
    rotation: 2.1,
    scale: 2,
  },
  {
    type: 1,
    x: 21.12,
    y: 2,
    z: 13.65,
    rotation: 1.5,
    scale: 2.1,
  },
  {
    type: 2,
    x: 21.12,
    y: 2,
    z: 14.77,
    rotation: 1.4,
    scale: 2.2,
  },
  {
    type: 2,
    x: 21.12,
    y: 2,
    z: 15.92,
    rotation: 2,
    scale: 2.05,
  },
  {
    type: 1,
    x: 21.12,
    y: 2,
    z: 17.07,
    rotation: 2.5,
    scale: 2.15,
  },
  {
    type: 0,
    x: 22.24,
    y: 2,
    z: 14.37,
    rotation: 2.3,
    scale: 1.7,
  },
  {
    type: 2,
    x: 22.24,
    y: 2,
    z: 15.57,
    rotation: 2,
    scale: 1.8,
  },
  {
    type: 0,
    x: 22.24,
    y: 2,
    z: 16.58,
    rotation: 0.3,
    scale: 1.73,
  },
  // right top
  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 20.2,
    scale: 2,
    rotation: 0.8,
  },

  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 21.16,
    scale: 2.2,
    rotation: 1,
  },
  {
    type: 0,
    x: 48.89,
    y: 2,
    z: 22.36,
    scale: 1.7,
    rotation: 1,
  },
  {
    type: 1,
    x: 48.1,
    y: 2,
    z: 20.76,
    scale: 1.7,
    rotation: 2,
  },

  {
    type: 0,
    x: 48.1,
    y: 2,
    z: 21.96,
    scale: 2,
    rotation: 2,
  },
  {
    type: 0,
    x: 48.89,
    y: 2,
    z: 25,
    scale: 1.7,
    rotation: 1,
  },
  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 26.23,
    scale: 2.1,
    rotation: 1.8,
  },

  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 27.4,
    scale: 2.05,
    rotation: 0.6,
  },
  {
    type: 0,
    x: 48.1,
    y: 2,
    z: 25.8,
    scale: 2,
    rotation: 2,
  },
  {
    type: 1,
    x: 48.1,
    y: 2,
    z: 27,
    scale: 1.7,
    rotation: 2.9,
  },
  // middle
  {
    type: 2,
    x: 33.4,
    y: 2,
    z: 44.7,
    scale: 3,
    rotation: 3,
  },
  {
    type: 2,
    x: 37,
    y: 2,
    z: 44.7,
    scale: 3.1,
    rotation: 2,
  },
]

export const FRAME_INFO = {
  depth: 0.2,
}

export const FRAMES_DATA = [
  {
    // 1
    x: 35.4,
    y: 4.5,
    z: 43.98,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
  },
  {
    // 2
    x: 18.16,
    y: 5,
    z: 39.64,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 3
    x: 20.65,
    y: 4,
    z: 18.18,
    width: 1.8,
    height: 1.8,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 4
    x: 20.65,
    y: 4.25,
    z: 12.16,
    width: 2.5,
    height: 2.5,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 5
    x: 50.15,
    y: 5,
    z: 23.78,
    width: 4,
    height: 4,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    // 6
    x: 35.4,
    y: 3.6,
    z: 33.29,
    width: 1.5,
    height: 1.5,
    depth: FRAME_INFO.depth,
  },
  {
    // 7
    x: 35.4,
    y: 4.5,
    z: 43.78,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(180),
  },
  {
    // 8
    x: 58.83,
    y: 5,
    z: 43.05,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(180),
  },
  {
    // 9
    x: 62.88,
    y: 5,
    z: 36.52,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(-90),
  },

  {
    // 10
    x: 57.9,
    y: 4,
    z: 4.79,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
  },
]

export const EDGES_DATA = [
  {
    width: 0.1,
    height: 10,
    depth: 50,
    x: 20.4,
    y: 5,
    z: 31.09,
  },
  {
    width: 40,
    height: 10,
    depth: 0.1,
    x: 40.4,
    y: 5,
    z: 6.09,
  },
  {
    width: 0.1,
    height: 10,
    depth: 35.4,
    x: 60.4,
    y: 5,
    z: 23.79,
  },
  {
    width: 10,
    height: 10,
    depth: 0.1,
    x: 55.4,
    y: 5,
    z: 41.49,
  },
  {
    width: 0.1,
    height: 10,
    depth: 14.6,
    x: 50.4,
    y: 5,
    z: 48.79,
  },
  {
    width: 0.1,
    height: 10,
    depth: 10,
    x: 37.9,
    y: 5,
    z: 61.09,
  },
  {
    width: 5,
    height: 10,
    depth: 0.1,
    x: 35.4,
    y: 5,
    z: 66.1,
  },
  {
    width: 0.1,
    height: 10,
    depth: 10,
    x: 32.9,
    y: 5,
    z: 61.09,
  },
]
