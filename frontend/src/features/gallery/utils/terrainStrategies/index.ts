import { PostItemData } from '@/features/post/types'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { IControls } from '@/libs/three-custom/controls'

export type TGalleryStrategyProps = {
  scene: THREE.Scene
  camera: DefaultCamera
  controls: IControls
  renderer: THREE.WebGLRenderer
  loadingManager: THREE.LoadingManager
  postList: PostItemData[]
}

export interface IGalleryStrategy {
  targets: THREE.Object3D[]
  obstacles: THREE.Object3D[]
  floors: THREE.Object3D[]
  build: (props: TGalleryStrategyProps) => Promise<void>
  update?: (delta: number) => void
  dispose: () => void
}
