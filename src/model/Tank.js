class Tank {
  constructor (bg, options = {}) {
    this._options_ = Object.assign({}, options)
    this.x = 0
    this.y = 0
    this.dir = 1
    this.width = this._options_.width
    this.height = this._options_.height
    this.speed = 1
    this.bg = document.createElement('canvas')
    this.bgCanvas = bg.canvas
    this.init()
  }
  init () {
    let ctx = this.bg.getContext('2d')
    this.bg.width = this.width
    this.bg.height = this.height
    ctx.drawImage(this.bgCanvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
  }
}

export default Tank
