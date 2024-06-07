type InitMessage = {
  canvas: OffscreenCanvas
  imgBitmap: ImageBitmap
}

type ResizeMessage = {
  type: 'resize'
  width: number
}

type StopMessage = {
  type: 'stop'
}

type Message = ResizeMessage | StopMessage

self.onmessage = async function (e: MessageEvent<InitMessage>) {
  // Change onmessage handler
  self.onmessage = function (e: MessageEvent<Message>) {
    switch (e.data.type) {
      case 'resize':
        imgWidth = e.data.width
        break

      case 'stop':
        animationFrameId && cancelAnimationFrame(animationFrameId)
        self.close()
        break
    }
  }

  const { canvas, imgBitmap } = e.data
  const ctx = canvas.getContext('2d')!

  const width = canvas.width
  const height = canvas.height
  let imgWidth = 64

  let animationFrameId: number
  const drawAndRotateImage = (img: ImageBitmap) => {
    let angle = 0
    let cnt = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate((angle * Math.PI) / 180)
      ctx.drawImage(img, -imgWidth / 2, -imgWidth / 2, imgWidth, imgWidth)
      ctx.restore()

      cnt += 0.012
      angle += 2.8 * (Math.sin(cnt) + 1)
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()
  }

  drawAndRotateImage(imgBitmap)
}
