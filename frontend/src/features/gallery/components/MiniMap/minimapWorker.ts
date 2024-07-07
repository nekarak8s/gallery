type InitMsg = {
  type: 'init'
  canvas: OffscreenCanvas
}

type ResizeMsg = {
  type: 'resize'
  width: number
  height: number
}

type MarkMsg = {
  type: 'mark'
  x: number
  y: number
  angle: number
}

type StopMsg = {
  type: 'stop'
}

type Msg = InitMsg | ResizeMsg | MarkMsg | StopMsg

self.onmessage = async function (e: MessageEvent<InitMessage>) {
  const { canvas } = e.data
  const ctx = canvas.getContext('2d')!

  let animationFrameId: number
  let x = 0
  let y = 0
  let angle = 0
  let width = canvas.width

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.translate(x, y)
    ctx.scale(width / 250, width / 250) // 250 is the width of the desktop minimap
    ctx.rotate(angle)
    ctx.translate(-12, -12) // 12 is half of the width of the minimap marker

    // Move to the starting point
    ctx.beginPath()
    ctx.moveTo(12, 4)

    // Draw the path based on the given commands
    ctx.bezierCurveTo(13.5913, 4, 15.1174, 4.63214, 16.2426, 5.75736)
    ctx.bezierCurveTo(17.3679, 6.88258, 18, 8.4087, 18, 10)
    ctx.bezierCurveTo(18, 14, 12, 20.75, 12, 20.75)
    ctx.bezierCurveTo(12, 20.75, 6, 14, 6, 10)
    ctx.bezierCurveTo(6, 8.4087, 6.63214, 6.88258, 7.75736, 5.75736)
    ctx.bezierCurveTo(8.88258, 4.63214, 10.4087, 4, 12, 4)

    // Close the path and fill it
    ctx.closePath()
    ctx.fillStyle = 'red'
    ctx.fill()

    ctx.restore()

    animationFrameId = requestAnimationFrame(draw)
  }

  draw()

  // Change onmessage handler
  self.onmessage = function (e: MessageEvent<Msg>) {
    const data = e.data

    switch (data.type) {
      case 'mark':
        x = data.x
        y = data.y
        angle = data.angle
        break

      case 'resize':
        width = data.width
        canvas.width = data.width
        canvas.height = data.width
        break

      case 'stop':
        animationFrameId && cancelAnimationFrame(animationFrameId)
        self.close()
        break
    }
  }
}
