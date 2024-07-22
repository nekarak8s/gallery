type CursorInitMsg = {
  type: 'init'
  canvas: OffscreenCanvas
}

type CursorResizeMsg = {
  type: 'resize'
  width: number
  height: number
}

type CursorPositionMsg = {
  type: 'position'
  scale: number
  x: number
  y: number
}

type CursorStopMsg = {
  type: 'stop'
}

type CurosrMsg = CursorInitMsg | CursorResizeMsg | CursorPositionMsg | CursorStopMsg

const CURSOR_SIZE = 6

self.onmessage = async function (e: MessageEvent<InitMessage>) {
  const { canvas } = e.data
  const ctx = canvas.getContext('2d')!

  let animationFrameId: number
  let x = 0
  let y = 0
  let scale = 1

  let width = canvas.width
  let height = canvas.height

  let curScale = scale
  const draw = () => {
    curScale += (scale - curScale) * 0.2
    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(curScale, curScale)

    // Draw cursor
    ctx.beginPath()
    ctx.arc(0, 0, CURSOR_SIZE, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()

    ctx.restore()

    animationFrameId = requestAnimationFrame(draw)
  }

  draw()

  // Change onmessage handler
  self.onmessage = function (e: MessageEvent<CurosrMsg>) {
    const data = e.data

    switch (data.type) {
      case 'resize':
        width = data.width
        height = data.height
        canvas.width = data.width
        canvas.height = data.height
        break

      case 'position':
        scale = data.scale
        x = data.x
        y = data.y
        break

      case 'stop':
        animationFrameId && cancelAnimationFrame(animationFrameId)
        self.close()
        break
    }
  }
}
