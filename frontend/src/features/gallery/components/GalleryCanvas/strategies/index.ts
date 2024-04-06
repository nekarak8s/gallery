import { PostItemData } from '@/features/post/types'
import { KeypadControls } from '@/libs/three-custom/controls/KeypadControls'

export type TGalleryStrategyProps = {
  scene: THREE.Scene
  controls: KeypadControls
  loadingManager: THREE.LoadingManager
  postList: PostItemData[]
}

export interface IGalleryStrategy {
  targets: THREE.Object3D[]
  obstacles: THREE.Object3D[]
  floors: THREE.Object3D[]
  build: (props: TGalleryStrategyProps) => Promise<void> | void
  update?: (delta: number) => void
  dispose: () => void
}
