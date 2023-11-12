// import { Camera } from 'three'

// export class KeypadControls {
//   object: Camera
//   domElement: HTMLElement | Document
//   movementSpeed: number = 1.0
//   lookSpeed: number = 0.005

//   // internals

//   #pointerX: number = 0
//   #pointerY: number = 0

//   #moveForward: boolean = false
//   #moveBackward: boolean = false
//   #moveLeft: boolean = false
//   #moveRight: boolean = false

//   constructor(object: Camera, domElement: HTMLElement | Document) {
//     this.object = object
//     this.domElement = domElement
//   }

//   onKeyDown(event: KeyboardEvent) {
//     switch (event.code) {
//       // forward
//       case 'ArrowUp':
//       case 'KeyW':
//         this.moveForward = true
//         break

//       case 'ArrowLeft':
//       case 'KeyA':
//         this.moveLeft = true
//         break

//       case 'ArrowDown':
//       case 'KeyS':
//         this.moveBackward = true
//         break

//       case 'ArrowRight':
//       case 'KeyD':
//         this.moveRight = true
//         break
//     }
//   }

//   onKeyUp(event: KeyboardEvent) {
//     switch (event.code) {
//       case 'ArrowUp':
//       case 'KeyW':
//         this.moveForward = false
//         break

//       case 'ArrowLeft':
//       case 'KeyA':
//         this.moveLeft = false
//         break

//       case 'ArrowDown':
//       case 'KeyS':
//         this.moveBackward = false
//         break

//       case 'ArrowRight':
//       case 'KeyD':
//         this.moveRight = false
//         break
//     }
//   }

//   lookAt ( x, y, z ) {

//     if ( x.isVector3 ) {

//       _target.copy( x );

//     } else {

//       _target.set( x, y, z );

//     }

//     this.object.lookAt( _target );

//     setOrientation( this );

//     return this;

//   };
// }
