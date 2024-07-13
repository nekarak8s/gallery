export const disposeRenderer = (renderer: THREE.WebGLRenderer) => {
  renderer.renderLists.dispose()
  renderer.getRenderTarget()?.dispose()
  renderer.dispose()
}
