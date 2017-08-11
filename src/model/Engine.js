class Engine {
  constructor (canvas, options = {}) {
    this.canvas = canvas
    this.ctx = null
    this.offCanvas = null
    this.offCtx = null
    this._options_ = Object.assign({}, options)
    this.delta = 0
    this.lastTime = new Date().getTime()
    this.fps = 60
    this.interval = 1000 / this.fps
    this.init()
  }
  init () {
    this.offCanvas = document.createElement('canvas')
    this.offCanvas.width = this.canvas.width
    this.offCanvas.height = this.canvas.height
    this.offCanvas.style.width = `${this.canvas.style.width}px`
    this.offCanvas.style.height = `${this.canvas.style.height}px`
    this.ctx = this.canvas.getContext('2d')
    this.offCtx = this.offCanvas.getContext('2d')
  }
  render () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.offCanvas, 0, 0, this.offCanvas.width, this.offCanvas.height)
  }
  start (callback = () => {}) {
    window.requestAnimationFrame(this.start.bind(this, callback))
    let now = new Date().getTime()
    this.delta = now - this.lastTime
    if (this.delta > this.interval) {
      this.lastTime = now - Math.floor((this.delta % this.interval))
      this.render()
      callback(this.offCtx)
    }
  }
}
export default Engine
