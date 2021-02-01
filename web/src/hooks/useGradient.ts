// NOTE(teddy): No longer using this fancy gradient because of imperfections, but leaving it here since it's dope and I want to come back to it.
import * as React from 'react'

export default function useGradient(canvas: HTMLCanvasElement | undefined) {
  React.useEffect(() => {
    const context = canvas?.getContext('2d')
    if (!context) {
      return
    }

    let time = 0
    const color = function (
      x: number,
      y: number,
      r: number,
      g: number,
      b: number
    ) {
      context.fillStyle = `rgb(${r}, ${g}, ${b})`
      context.fillRect(x, y, 5, 5)
    }

    const red = function (x: number, y: number, time: number) {
      return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + time))
    }

    const green = function (x: number, y: number, time: number) {
      return Math.floor(
        192 +
          64 *
            Math.sin(
              (x * x * Math.cos(time / 4) + y * y * Math.sin(time / 3)) / 300
            )
      )
    }

    const blue = function (x: number, y: number, time: number) {
      return Math.floor(
        192 +
          64 *
            Math.sin(
              5 * Math.sin(time / 9) +
                ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
            )
      )
    }

    let requestId: number | undefined = undefined
    const startAnimation = function () {
      for (let x = 0; x <= 30; x++) {
        for (let y = 0; y <= 30; y++) {
          color(x, y, red(x, y, time), green(x, y, time), blue(x, y, time))
        }
      }

      time = time + 0.01
      requestId = window.requestAnimationFrame(startAnimation)
    }

    startAnimation()

    return () => {
      if (requestId) {
        window.cancelAnimationFrame(requestId)
      }
    }
  }, [canvas])
}
