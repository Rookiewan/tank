class Tank {
  constructor (bg, options = {}) {
    this._options_ = Object.assign({
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
    }, options)
    this.x = 0
    this.y = 0
    this.dir = 1 // 1 up; 2 right; 3 down; 4 left
    this.width = this._options_.width
    this.height = this._options_.height
    this.speed = 1
    this.entity = document.createElement('canvas')
    this.ctx = this.entity.getContext('2d')
    this.bgCanvas = document.createElement('canvas')
    this.bgCtx = this.bgCanvas.getContext('2d')
    this.show = false
    this.color = '#fff'
    this.level = 1
    this.init()
  }
  init () {
    this.color = this.randomColor()
    this.bgCtx = this.bgCanvas.getContext('2d')
    this.ctx = this.entity.getContext('2d')
    this.entity.width = this.bgCanvas.width = this.width
    this.entity.height = this.bgCanvas.height = this.height
    this.bgCtx.beginPath()
    this.bgCtx.moveTo(0, this.height)
    this.bgCtx.lineTo(0, this.height / 3)
    this.bgCtx.lineTo(this.width / 3, this.height / 3)
    this.bgCtx.lineTo(this.width / 3, 0)
    this.bgCtx.lineTo(this.width * 2 / 3, 0)
    this.bgCtx.lineTo(this.width * 2 / 3, this.height / 3)
    this.bgCtx.lineTo(this.width, this.height / 3)
    this.bgCtx.lineTo(this.width, this.height)
    this.bgCtx.lineTo(this.width * 2 / 3, this.height)
    this.bgCtx.lineTo(this.width * 2 / 3, this.height * 2 / 3)
    this.bgCtx.lineTo(this.width / 3, this.height * 2 / 3)
    this.bgCtx.lineTo(this.width / 3, this.height)
    this.bgCtx.closePath()
    this.bgCtx.fillStyle = this._options_.color ? this._options_.color : this.color
    this.bgCtx.fill()
  }
  draw () {
    let deg = 0
    switch (this.dir) {
      case 1:
        // up
        deg = 0
        break
      case 2:
        // right
        deg = 90
        break
      case 3:
        // down
        deg = 180
        break
      case 4:
        // left
        deg = 270
        break
      default:
    }
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.save()
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.rotate(deg * Math.PI / 180)
    this.ctx.drawImage(this.bgCanvas, -this.width / 2, -this.height / 2)
    this.ctx.restore()
  }
  randomColor () {
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    return `rgb(${r}, ${g}, ${b})`
  }
  born () {
    if (!this._options_.isRole) {
      this.x = Math.ceil(Math.random() * this._options_.canvasWidth)
      this.y = Math.ceil(Math.random() * this._options_.canvasHeight)
      this.color = this.randomColor()
    }
    this.show = true
    this.draw()
  }
  die () {
    this.show = false
  }
  AiLevel (level = 1) {
    this.level = level
    // 转向概率
    let turnProbability = Math.random() > (1 - level / 500)
    if (turnProbability) {
      this.changeDir()
    }
  }
  changeDir () {
    let dirs = [1, 2, 3, 4].filter(d => d !== this.dir)
    this.dir = dirs[Math.floor(Math.random() * (dirs.length))]
    this.draw()
  }
  checkImpact (els = [], cb = () => {}) {
    let _deltaDis = this.speed
    if ((this.x - _deltaDis <= 0 && this.dir === 4) ||
      (this.y - _deltaDis <= 0 && this.dir === 1) ||
      (this.x + this.width + _deltaDis >= this._options_.canvasWidth && this.dir === 2) ||
      (this.y + this.height + _deltaDis >= this._options_.canvasHeight && this.dir === 3)
    ) {
      cb()
    }
    // 碰撞检测，未实现
    let impact = false
    els.map(tank => {
      // 两个物体左上角的距离
      let dis = Math.sqrt(Math.pow(tank.x - this.x, 2) + Math.pow(tank.y - this.y, 2))
      if (dis <= this.width || dis <= tank.width) {
        if (this.dir === 1 && tank.y < this.y) {
          // 碰撞
          impact = true
        } else if (this.dir === 2 && tank.x > this.x) {
          // 碰撞
          impact = true
        } else if (this.dir === 3 && tank.y > this.y) {
          // 碰撞
          impact = true
        } else if (this.dir === 4 && tank.x < this.x) {
          // 碰撞
          impact = true
        }
      }
    })
    if (impact) {
      _deltaDis = 0
      this.changeDir()
    }
    switch (this.dir) {
      case 1:
        // up
        this.y -= _deltaDis
        break
      case 2:
        // right
        this.x += _deltaDis
        break
      case 3:
        // down
        this.y += _deltaDis
        break
      case 4:
        // left
        this.x -= _deltaDis
        break
      default:
    }
  }
}

export default Tank
